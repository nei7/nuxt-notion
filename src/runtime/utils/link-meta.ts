import type { LinkMetadataResponse } from '../types'

const MAX_HTML_BYTES = 512 * 1024
const MAX_REDIRECTS = 5
const FETCH_TIMEOUT_MS = 5000
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'

const BLOCKED_HOST_SUFFIXES = ['.local', '.internal', '.arpa', '.localhost', '.home', '.lan']
const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/

/**
 * Only public http(s) hosts may be fetched server-side: literal IPs and
 * internal-looking names are rejected to keep the route from becoming an SSRF proxy.
 */
export function isAllowedUrl(input: string, allowedHosts: string[] = []): boolean {
  let url: URL
  try {
    url = new URL(input)
  }
  catch {
    return false
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
  if (url.username || url.password) return false

  const host = url.hostname.toLowerCase()
  if (!host || host === 'localhost' || host.startsWith('[') || IPV4.test(host)) return false
  if (!host.includes('.')) return false
  if (BLOCKED_HOST_SUFFIXES.some(suffix => host.endsWith(suffix))) return false

  if (allowedHosts.length > 0) {
    return allowedHosts.some(allowed => host === allowed || host.endsWith(`.${allowed}`))
  }
  return true
}

const decodeEntities = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&nbsp;/g, ' ')

const findMeta = (html: string, keys: string[]): string | undefined => {
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const key = tag.match(/(?:name|property)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    if (!key || !keys.includes(key)) continue

    const content = tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1]
    if (content) return decodeEntities(content.trim())
  }
  return undefined
}

const findIcon = (html: string): string | undefined => {
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = tag.match(/rel\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    if (!rel || !/(?:^|\s)(?:icon|shortcut icon|apple-touch-icon)(?:\s|$)/.test(rel)) continue

    const href = tag.match(/href\s*=\s*["']([^"']*)["']/i)?.[1]
    if (href) return href
  }
  return undefined
}

const pageTitle = (html: string): string | undefined => {
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim()
  return title ? decodeEntities(title) : undefined
}

const absoluteUrl = (value: string | undefined, base: string): string | undefined => {
  if (!value) return undefined
  try {
    return new URL(value, base).href
  }
  catch {
    return undefined
  }
}

export function parseLinkMetadata(html: string, url: string): LinkMetadataResponse {
  return {
    success: true,
    title: findMeta(html, ['og:title', 'twitter:title']) || pageTitle(html) || new URL(url).hostname,
    description: findMeta(html, ['og:description', 'twitter:description', 'description']),
    image: absoluteUrl(findMeta(html, ['og:image', 'og:image:url', 'twitter:image']), url),
    icon: absoluteUrl(findIcon(html), url) ?? absoluteUrl('/favicon.ico', url),
    url,
  }
}

async function readLimited(response: Response, limit: number): Promise<string> {
  if (!response.body) return ''
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let html = ''
  let received = 0

  while (received < limit) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    html += decoder.decode(value, { stream: true })
  }
  await reader.cancel().catch(() => {})
  return html
}

/** Fetches an HTML document, re-validating every redirect hop against `isAllowedUrl`. */
export async function fetchHtml(url: string, allowedHosts: string[] = [], fetchImpl: typeof fetch = fetch): Promise<string | null> {
  let current = url

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isAllowedUrl(current, allowedHosts)) return null

    const response = await fetchImpl(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'user-agent': USER_AGENT, 'accept': 'text/html,application/xhtml+xml' },
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      await response.body?.cancel().catch(() => {})
      if (!location) return null
      current = new URL(location, current).href
      continue
    }

    if (!response.ok) return null
    const contentType = response.headers.get('content-type') ?? ''
    if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      await response.body?.cancel().catch(() => {})
      return null
    }
    return readLimited(response, MAX_HTML_BYTES)
  }

  return null
}

export async function scrapeLinkMetadata(url: string, allowedHosts: string[] = [], fetchImpl?: typeof fetch): Promise<LinkMetadataResponse> {
  const fallback: LinkMetadataResponse = { success: false, title: new URL(url).hostname, url }
  try {
    const html = await fetchHtml(url, allowedHosts, fetchImpl)
    return html ? parseLinkMetadata(html, url) : fallback
  }
  catch {
    return fallback
  }
}
