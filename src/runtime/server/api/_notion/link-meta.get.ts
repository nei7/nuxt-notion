import { getValidatedQuery } from 'h3'
import { z } from 'zod'
import { defineCachedEventHandler } from 'nitropack/runtime'
import type { LinkMetadataResponse } from '../../../types'

const schema = z.object({
  url: z.url({ protocol: /^https?$/ }),
})

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
    if (!rel || !/(^|\s)(icon|shortcut icon|apple-touch-icon)(\s|$)/.test(rel)) continue

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

export default defineCachedEventHandler(async (event): Promise<LinkMetadataResponse> => {
  const { url } = await getValidatedQuery(event, schema.parse)

  const fallbackTitle = new URL(url).hostname

  try {
    const html = await $fetch<string>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
      timeout: 5000,
    })

    return {
      success: true,
      title: findMeta(html, ['og:title', 'twitter:title']) || pageTitle(html) || fallbackTitle,
      description: findMeta(html, ['og:description', 'twitter:description', 'description']),
      image: absoluteUrl(findMeta(html, ['og:image', 'og:image:url', 'twitter:image']), url),
      icon: absoluteUrl(findIcon(html), url) ?? absoluteUrl('/favicon.ico', url),
      url,
    }
  }
  catch {
    return {
      success: false,
      title: fallbackTitle,
      url,
    }
  }
})
