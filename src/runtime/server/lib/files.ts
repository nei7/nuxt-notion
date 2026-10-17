import type { H3Event } from 'h3'
import { isFullBlock, isFullPage } from '@notionhq/client'
import { defineCachedFunction } from 'nitropack/runtime'
import { dashlessId } from '../../utils/mapping'
import { notionHostedUrl, type NotionFileKind } from '../../utils/files'
import { useNotionClient } from './client'
import { useNotionConfig } from './config'
import { NOTION_CACHE_GROUP } from './collections'

/** Notion signs file URLs for one hour; re-resolve well before that. */
const FILE_URL_MAX_AGE = 50 * 60

const MEDIA_BLOCKS = new Set(['image', 'video', 'file', 'pdf', 'audio'])

async function resolveFileUrl(event: H3Event | undefined, id: string, kind: NotionFileKind): Promise<string | null> {
  const client = useNotionClient(event)

  if (kind === 'block' || kind === 'callout') {
    const block = await client.blocks.retrieve({ block_id: id })
    if (!isFullBlock(block)) return null
    if (kind === 'callout') return block.type === 'callout' ? notionHostedUrl(block.callout.icon) : null
    if (!MEDIA_BLOCKS.has(block.type)) return null
    return notionHostedUrl((block as unknown as Record<string, Parameters<typeof notionHostedUrl>[0]>)[block.type])
  }

  const page = await client.pages.retrieve({ page_id: id })
  if (!isFullPage(page)) return null

  // Only pages that belong to a configured collection may have their files proxied.
  const allowed = new Set(Object.values(useNotionConfig(event).collections).map(c => dashlessId(c.dataSourceId)))
  const parent = page.parent
  const parentDataSource = parent.type === 'data_source_id' ? dashlessId(parent.data_source_id) : null
  if (!parentDataSource || !allowed.has(parentDataSource)) return null

  return kind === 'cover' ? notionHostedUrl(page.cover) : notionHostedUrl(page.icon)
}

const cachedFileUrl = defineCachedFunction(resolveFileUrl, {
  group: NOTION_CACHE_GROUP,
  name: 'file',
  getKey: (_event, id, kind) => `${dashlessId(id)}:${kind}`,
  maxAge: FILE_URL_MAX_AGE,
  swr: false,
})

/** A currently valid signed URL for a Notion-hosted file, or `null`. */
export function getNotionFileUrl(event: H3Event | undefined, id: string, kind: NotionFileKind): Promise<string | null> {
  return cachedFileUrl(event, id, kind)
}
