import type { BlockObjectResponse, QueryDataSourceParameters } from '@notionhq/client'
import type { ParsedPropertyValue } from '../../utils'

/** A full Notion block with its (recursively fetched) children attached. */
export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[]
}

/** A code block whose HTML was pre-rendered on the server (see `highlightCode`). */
export type NotionCodeBlock = Extract<NotionBlock, { type: 'code' }> & {
  code: { html?: string }
}

export interface NotionHeading {
  /** Anchor id, unique within the document. */
  id: string
  text: string
  level: 1 | 2 | 3 | 4
  blockId: string
}

export interface NotionReadingTime {
  minutes: number
  words: number
}

export type NotionIcon
  = | { type: 'emoji', emoji: string }
    | { type: 'url', url: string }
    | null

export interface NotionCollectionItem<P extends Record<string, ParsedPropertyValue> = Record<string, ParsedPropertyValue>> {
  id: string
  slug: string
  title: string
  /** ISO date string: the mapped date property, falling back to `created_time`. */
  date: string | null
  description: string
  tags: string[]
  featured: boolean
  order: number | null
  /** External URL or a same-origin `/api/_notion/image/...` URL for Notion-hosted covers. */
  cover: string | null
  icon: NotionIcon
  /** The page URL on notion.so. */
  url: string
  createdTime: string
  lastEditedTime: string
  /** Every page property, parsed with `parseProperties`. */
  properties: P
}

export interface NotionCollectionTag {
  name: string
  count: number
}

export interface NotionCollectionResponse<P extends Record<string, ParsedPropertyValue> = Record<string, ParsedPropertyValue>> {
  items: NotionCollectionItem<P>[]
  tags: NotionCollectionTag[]
  total: number
}

export type NotionCollectionNeighbour = Pick<NotionCollectionItem, 'slug' | 'title'>

export interface NotionCollectionItemResponse<P extends Record<string, ParsedPropertyValue> = Record<string, ParsedPropertyValue>> {
  item: NotionCollectionItem<P>
  blocks: NotionBlock[]
  headings: NotionHeading[]
  readingTime: NotionReadingTime
  /** The older item (next in the list). */
  prev: NotionCollectionNeighbour | null
  /** The newer item (previous in the list). */
  next: NotionCollectionNeighbour | null
}

export interface NotionCollectionQuery {
  tag?: string
  limit?: number
  featured?: boolean
}

/**
 * Augment this interface from your app to get typed `properties` per collection:
 *
 * ```ts
 * declare module '@nei7/nuxt-notion/types' {
 *   interface NotionCollections { projects: { repo: string | null } }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NotionCollections {}

/**
 * Known collection names with autocomplete, while still accepting any string.
 * Kept free of conditional types so a literal argument stays a literal during inference.
 */
export type NotionCollectionName = (keyof NotionCollections & string) | (string & {})

export type NotionCollectionProps<N> = N extends keyof NotionCollections
  ? NotionCollections[N] extends Record<string, ParsedPropertyValue> ? NotionCollections[N] : Record<string, ParsedPropertyValue>
  : Record<string, ParsedPropertyValue>

export interface CollectionPublishedFilter {
  property: string
  /** Option name for `status`/`select` properties, boolean for `checkbox` properties. */
  equals: string | boolean
  /** Property type. Inferred as `checkbox` for boolean `equals`, otherwise defaults to `status`. */
  type?: 'status' | 'select' | 'checkbox'
}

export interface CollectionPropertyMap {
  /** Defaults to the first property of type `title`. */
  title?: string
  /** First non-empty wins. Defaults to `['slug', 'url']`; falls back to the page id. */
  slug?: string | string[]
  /** Defaults to `['date', 'published']`; falls back to `created_time`. */
  date?: string | string[]
  /** Defaults to `['description', 'summary']`. */
  description?: string | string[]
  /** Defaults to `['tags', 'category']`. A `select` becomes a one-element array. */
  tags?: string | string[]
  /** Checkbox property. Defaults to `featured`. */
  featured?: string
  /** Number property used as the primary sort (ascending). Defaults to `order`. */
  order?: string
  /** Defaults to `{ property: 'status', equals: 'Published' }`. `false` disables the filter. */
  published?: CollectionPublishedFilter | false
}

export interface ResolvedPropertyMap {
  title: string | null
  slug: string[]
  date: string[]
  description: string[]
  tags: string[]
  featured: string
  order: string
  published: CollectionPublishedFilter | false
}

export interface CollectionConfig {
  /** Can be overridden at runtime with `NUXT_NUXT_NOTION_COLLECTIONS_<NAME>_DATA_SOURCE_ID`. */
  dataSourceId?: string
  properties?: CollectionPropertyMap
  /** Extra Notion filter, AND-ed with the published filter. Never client-controlled. */
  filter?: QueryDataSourceParameters['filter']
  /** Notion sorts. When set, the in-memory `order`/`date` sort is skipped. */
  sorts?: QueryDataSourceParameters['sorts']
  /** Whether items have block content (`false` for list-only collections). Defaults to `true`. */
  content?: boolean
}

export interface ResolvedCollectionConfig {
  dataSourceId: string
  properties: ResolvedPropertyMap
  filter?: QueryDataSourceParameters['filter']
  sorts?: QueryDataSourceParameters['sorts']
  content: boolean
}
