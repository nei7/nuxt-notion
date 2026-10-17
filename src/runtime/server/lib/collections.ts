import type { H3Event } from 'h3'
import { collectPaginatedAPI, isFullPage } from '@notionhq/client'
import { defineCachedFunction, useStorage } from 'nitropack/runtime'
import type {
  NotionCollectionItem,
  NotionCollectionItemResponse,
  NotionCollectionNeighbour,
  NotionCollectionTag,
  NotionHeading,
  NotionReadingTime,
  NotionBlock,
} from '../../types/collections'
import { buildCollectionQuery, collectTags, dashlessId, sortItems, toCollectionItem } from '../../utils/mapping'
import { fetchBlockTree } from '../../utils/block-tree'
import { extractHeadings } from '../../utils/headings'
import { computeReadingTime } from '../../utils/reading-time'
import type { InvalidationTarget } from '../../utils/webhook'
import { useNotionClient } from './client'
import { getCollectionConfig, useNotionConfig } from './config'
import { prehighlightCode } from './highlight'

/** Cache group for everything the module stores (`cache:notion:*`). */
export const NOTION_CACHE_GROUP = 'notion'
/** Cache group for site-level caches built from collections (RSS, sitemap…); cleared on every invalidation. */
export const NOTION_DERIVED_CACHE_GROUP = 'notion-derived'

interface CollectionContent {
  blocks: NotionBlock[]
  headings: NotionHeading[]
  readingTime: NotionReadingTime
}

type ListFn = (event: H3Event | undefined, name: string) => Promise<NotionCollectionItem[]>
type ContentFn = (event: H3Event | undefined, name: string, pageId: string) => Promise<CollectionContent>

async function fetchItems(event: H3Event | undefined, name: string): Promise<NotionCollectionItem[]> {
  const config = getCollectionConfig(event, name)
  const client = useNotionClient(event)
  const { filter, sorts } = buildCollectionQuery(config)

  const pages = await collectPaginatedAPI(client.dataSources.query, {
    data_source_id: config.dataSourceId,
    filter,
    sorts,
    page_size: 100,
  })

  const items = pages.filter(isFullPage).map(page => toCollectionItem(page, config.properties))
  return sortItems(items, config)
}

async function fetchContent(event: H3Event | undefined, _name: string, pageId: string): Promise<CollectionContent> {
  const { highlightCode, readingTime } = useNotionConfig(event)
  const client = useNotionClient(event)

  const blocks = await fetchBlockTree(client, pageId)
  if (highlightCode) await prehighlightCode(blocks)

  return {
    blocks,
    headings: extractHeadings(blocks),
    readingTime: computeReadingTime(blocks, readingTime.wordsPerMinute),
  }
}

// Cached wrappers are created lazily on the first request, so cache options can
// come from runtime config (which is only reliable inside a request on Workers).
let cachedList: ListFn | undefined
let cachedContent: ContentFn | undefined

function getCachedList(event: H3Event | undefined): ListFn {
  const { maxAge, swr } = useNotionConfig(event).cache
  if (maxAge <= 0) return fetchItems
  cachedList ??= defineCachedFunction(fetchItems, {
    group: NOTION_CACHE_GROUP,
    name: 'collection',
    getKey: (_event, name) => name,
    maxAge,
    swr,
  })
  return cachedList
}

function getCachedContent(event: H3Event | undefined): ContentFn {
  const { maxAge, swr } = useNotionConfig(event).cache
  if (maxAge <= 0) return fetchContent
  cachedContent ??= defineCachedFunction(fetchContent, {
    group: NOTION_CACHE_GROUP,
    name: 'item',
    getKey: (_event, name, pageId) => `${name}:${dashlessId(pageId)}`,
    maxAge,
    swr,
  })
  return cachedContent
}

/** All published items of a collection, sorted. */
export function getCollectionItems(event: H3Event | undefined, name: string): Promise<NotionCollectionItem[]> {
  return getCachedList(event)(event, name)
}

export function getCollectionTags(items: NotionCollectionItem[]): NotionCollectionTag[] {
  return collectTags(items)
}

const neighbour = (item: NotionCollectionItem | undefined): NotionCollectionNeighbour | null =>
  item ? { slug: item.slug, title: item.title } : null

/** One item with its block tree, headings and reading time, or `null` when the slug is unknown. */
export async function getCollectionItem(event: H3Event | undefined, name: string, slug: string): Promise<NotionCollectionItemResponse | null> {
  const items = await getCollectionItems(event, name)
  const index = items.findIndex(item => item.slug === slug)
  if (index === -1) return null

  const item = items[index]!
  const config = getCollectionConfig(event, name)
  const content: CollectionContent = config.content
    ? await getCachedContent(event)(event, name, item.id)
    : { blocks: [], headings: [], readingTime: { minutes: 0, words: 0 } }

  return {
    item,
    ...content,
    prev: neighbour(items[index + 1]),
    next: neighbour(items[index - 1]),
  }
}

/**
 * Drops cached Notion data. Without arguments everything is cleared; with a
 * collection (and optionally a page id) only the affected entries go. Derived
 * caches (`notion-derived` group) are always cleared.
 */
export async function invalidateNotionCache(target: InvalidationTarget = {}): Promise<void> {
  const storage = useStorage('cache')

  if (!target.collection) {
    await storage.clear(`${NOTION_CACHE_GROUP}:collection`)
    await storage.clear(`${NOTION_CACHE_GROUP}:item`)
  }
  else {
    await storage.removeItem(`${NOTION_CACHE_GROUP}:collection:${target.collection}.json`)
    if (target.pageId) {
      await storage.removeItem(`${NOTION_CACHE_GROUP}:item:${target.collection}:${dashlessId(target.pageId)}.json`)
    }
    else {
      await storage.clear(`${NOTION_CACHE_GROUP}:item:${target.collection}`)
    }
  }

  await storage.clear(NOTION_DERIVED_CACHE_GROUP)
}
