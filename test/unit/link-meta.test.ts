import { describe, expect, it, vi } from 'vitest'
import { fetchHtml, isAllowedUrl, parseLinkMetadata, scrapeLinkMetadata } from '../../src/runtime/utils/link-meta'

describe('isAllowedUrl', () => {
  it.each([
    ['https://example.com/page', true],
    ['http://blog.example.org', true],
    ['ftp://example.com', false],
    ['file:///etc/passwd', false],
    ['https://localhost:3000', false],
    ['http://127.0.0.1/admin', false],
    ['http://10.0.0.1', false],
    ['http://[::1]/', false],
    ['http://intranet', false],
    ['http://router.local', false],
    ['http://service.internal', false],
    ['https://user:pass@example.com', false],
    ['not a url', false],
  ])('%s → %s', (url, expected) => {
    expect(isAllowedUrl(url)).toBe(expected)
  })

  it('restricts to allowed hosts (including subdomains) when configured', () => {
    expect(isAllowedUrl('https://github.com/x', ['github.com'])).toBe(true)
    expect(isAllowedUrl('https://gist.github.com/x', ['github.com'])).toBe(true)
    expect(isAllowedUrl('https://example.com', ['github.com'])).toBe(false)
  })
})

describe('parseLinkMetadata', () => {
  it('reads Open Graph tags, decodes entities and resolves relative URLs', () => {
    const html = `<html><head>
      <title>Fallback &amp; title</title>
      <meta property="og:title" content="OG &quot;Title&quot;">
      <meta name="description" content="Desc &#x27;here&#x27;">
      <meta property="og:image" content="/img/cover.png">
      <link rel="icon" href="favicon.svg">
    </head></html>`

    expect(parseLinkMetadata(html, 'https://example.com/blog/post')).toEqual({
      success: true,
      title: 'OG "Title"',
      description: 'Desc \'here\'',
      image: 'https://example.com/img/cover.png',
      icon: 'https://example.com/blog/favicon.svg',
      url: 'https://example.com/blog/post',
    })
  })

  it('falls back to <title>, hostname and /favicon.ico', () => {
    const meta = parseLinkMetadata('<title>Only title</title>', 'https://example.com/')
    expect(meta.title).toBe('Only title')
    expect(meta.success && meta.icon).toBe('https://example.com/favicon.ico')
    expect(parseLinkMetadata('', 'https://example.com/').title).toBe('example.com')
  })
})

const response = (status: number, body = '', headers: Record<string, string> = {}) =>
  new Response(body, { status, headers })

describe('fetchHtml', () => {
  it('follows redirects but re-validates every hop', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(302, '', { location: 'https://example.com/final' }))
      .mockResolvedValueOnce(response(200, '<title>ok</title>', { 'content-type': 'text/html; charset=utf-8' }))

    await expect(fetchHtml('https://example.com/start', [], fetchMock as unknown as typeof fetch)).resolves.toContain('ok')

    const toInternal = vi.fn().mockResolvedValueOnce(response(302, '', { location: 'http://127.0.0.1/' }))
    await expect(fetchHtml('https://example.com/start', [], toInternal as unknown as typeof fetch)).resolves.toBeNull()
    expect(toInternal).toHaveBeenCalledTimes(1)
  })

  it('ignores non-HTML responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200, '{}', { 'content-type': 'application/json' }))
    await expect(fetchHtml('https://example.com/data', [], fetchMock as unknown as typeof fetch)).resolves.toBeNull()
  })
})

describe('scrapeLinkMetadata', () => {
  it('returns the hostname fallback on failure', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('boom'))
    await expect(scrapeLinkMetadata('https://example.com/x', [], fetchMock as unknown as typeof fetch)).resolves.toEqual({
      success: false,
      title: 'example.com',
      url: 'https://example.com/x',
    })
  })
})
