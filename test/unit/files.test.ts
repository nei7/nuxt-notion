import { describe, expect, it } from 'vitest'
import { notionFileUrl, notionHostedUrl } from '../../src/runtime/utils/files'

const source = { id: 'abc-123', last_edited_time: '2024-05-01T00:00:00.000Z' }

describe('notionFileUrl', () => {
  it('keeps external URLs', () => {
    expect(notionFileUrl(source, { type: 'external', external: { url: 'https://cdn.example/a.png' } })).toBe('https://cdn.example/a.png')
  })

  it('routes Notion-hosted files through the image route with a version', () => {
    const url = notionFileUrl(source, { type: 'file', file: { url: 'https://s3/signed' } })
    expect(url).toBe(`/api/_notion/image/abc-123?kind=block&v=${Date.parse(source.last_edited_time).toString(36)}`)
    expect(notionFileUrl(source, { type: 'file', file: { url: 'x' } }, 'cover')).toContain('kind=cover')
  })

  it('returns null for unknown or missing files', () => {
    expect(notionFileUrl(source, null)).toBeNull()
    expect(notionFileUrl(source, { type: 'file_upload' })).toBeNull()
  })
})

describe('notionHostedUrl', () => {
  it('only exposes signed URLs of hosted files', () => {
    expect(notionHostedUrl({ type: 'file', file: { url: 'https://s3/signed' } })).toBe('https://s3/signed')
    expect(notionHostedUrl({ type: 'external', external: { url: 'https://x' } })).toBeNull()
    expect(notionHostedUrl(null)).toBeNull()
  })
})
