/** `block`: media block file, `callout`: callout icon, `cover`/`icon`: page cover/icon. */
export type NotionFileKind = 'block' | 'callout' | 'cover' | 'icon'

export interface NotionFileSource {
  id: string
  last_edited_time?: string
}

/** The shape shared by image/video/file/pdf/audio blocks, page covers and file icons. */
export type NotionFileLike
  = | { type: 'external', external: { url: string } }
    | { type: 'file', file: { url: string, expiry_time?: string } }
    | { type: 'file_upload', file_upload?: { id: string } }
    | { type: string }

export const IMAGE_ROUTE = '/api/_notion/image'

const versionOf = (source: NotionFileSource) => {
  const ts = source.last_edited_time ? Date.parse(source.last_edited_time) : 0
  return (Number.isNaN(ts) ? 0 : ts).toString(36)
}

/**
 * Returns a URL safe to embed in cached HTML. External files are used as-is;
 * Notion-hosted files (whose signed URLs expire after an hour) are routed
 * through `/api/_notion/image/:id`, which re-resolves a fresh URL on demand.
 */
export function notionFileUrl(source: NotionFileSource, file: NotionFileLike | null | undefined, kind: NotionFileKind = 'block'): string | null {
  if (!file) return null
  if (file.type === 'external') return (file as { external: { url: string } }).external.url
  if (file.type === 'file') return `${IMAGE_ROUTE}/${source.id}?kind=${kind}&v=${versionOf(source)}`
  return null
}

/** Reads the current signed URL from a Notion file object (`null` for external files). */
export function notionHostedUrl(file: NotionFileLike | null | undefined): string | null {
  if (file && file.type === 'file') return (file as { file: { url: string } }).file.url
  return null
}
