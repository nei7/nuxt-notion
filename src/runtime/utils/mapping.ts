import type { PageObjectResponse, QueryDataSourceParameters } from '@notionhq/client'
import { parseProperties, type ParsedPropertyValue } from '../../utils'
import type {
  CollectionConfig,
  CollectionPropertyMap,
  NotionCollectionItem,
  NotionCollectionTag,
  NotionIcon,
  ResolvedCollectionConfig,
  ResolvedPropertyMap,
} from '../types/collections'
import { notionFileUrl } from './files'

const toArray = (value: string | string[] | undefined, fallback: string[]) =>
  value === undefined ? fallback : Array.isArray(value) ? value : [value]

export function resolvePropertyMap(map: CollectionPropertyMap = {}): ResolvedPropertyMap {
  return {
    title: map.title ?? null,
    slug: toArray(map.slug, ['slug', 'url']),
    date: toArray(map.date, ['date', 'published']),
    description: toArray(map.description, ['description', 'summary']),
    tags: toArray(map.tags, ['tags', 'category']),
    featured: map.featured ?? 'featured',
    order: map.order ?? 'order',
    published: map.published === undefined ? { property: 'status', equals: 'Published' } : map.published,
  }
}

export function resolveCollectionConfig(config: CollectionConfig = {}): ResolvedCollectionConfig {
  return {
    dataSourceId: config.dataSourceId ?? '',
    properties: resolvePropertyMap(config.properties),
    filter: config.filter,
    sorts: config.sorts,
    content: config.content ?? true,
  }
}

const isEmpty = (value: ParsedPropertyValue) =>
  value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)

/** Returns the first property (by name) with a non-empty parsed value. */
export function pickProperty(props: Record<string, ParsedPropertyValue>, names: string[]): ParsedPropertyValue {
  for (const name of names) {
    const value = props[name]
    if (!isEmpty(value)) return value
  }
  return undefined
}

/** Accepts a plain slug or a full URL and returns its last path segment, lower-cased. */
export function normalizeSlug(raw: string): string {
  const path = raw.trim()
    .replace(/^https?:\/\/[^/]+\/?/, '')
    .replace(/[?#].*$/, '')
  const segment = path.split('/').filter(Boolean).pop() ?? ''
  return segment.trim().toLowerCase()
}

export const dashlessId = (id: string) => id.replace(/-/g, '').toLowerCase()

function findTitle(page: PageObjectResponse): string {
  for (const property of Object.values(page.properties)) {
    if (property.type === 'title') return property.title.map(t => t.plain_text).join('')
  }
  return ''
}

function toIsoDate(value: ParsedPropertyValue): string | null {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && !Array.isArray(value) && 'start' in value) return value.start
  return null
}

function pageIcon(page: PageObjectResponse): NotionIcon {
  const icon = page.icon
  if (!icon) return null
  if (icon.type === 'emoji') return { type: 'emoji', emoji: icon.emoji }
  if (icon.type === 'external') return { type: 'url', url: icon.external.url }
  if (icon.type === 'file') {
    const url = notionFileUrl(page, icon, 'icon')
    return url ? { type: 'url', url } : null
  }
  if (icon.type === 'custom_emoji') return { type: 'url', url: icon.custom_emoji.url }
  return null
}

export function toCollectionItem<P extends Record<string, ParsedPropertyValue> = Record<string, ParsedPropertyValue>>(
  page: PageObjectResponse,
  map: ResolvedPropertyMap,
): NotionCollectionItem<P> {
  const props = parseProperties<Record<string, ParsedPropertyValue>>(page.properties)

  const titleValue = map.title ? props[map.title] : undefined
  const title = typeof titleValue === 'string' && titleValue ? titleValue : findTitle(page)

  const slugValue = pickProperty(props, map.slug)
  const slug = (typeof slugValue === 'string' && normalizeSlug(slugValue)) || dashlessId(page.id)

  const description = pickProperty(props, map.description)
  const tagsValue = pickProperty(props, map.tags)
  const tags = Array.isArray(tagsValue) ? tagsValue : isEmpty(tagsValue) ? [] : [String(tagsValue)]

  const orderValue = props[map.order]

  return {
    id: page.id,
    slug,
    title,
    date: toIsoDate(pickProperty(props, map.date)) ?? page.created_time,
    description: typeof description === 'string' ? description : '',
    tags,
    featured: props[map.featured] === true,
    order: typeof orderValue === 'number' ? orderValue : null,
    cover: page.cover ? notionFileUrl(page, page.cover, 'cover') : null,
    icon: pageIcon(page),
    url: page.url,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    properties: props as P,
  }
}

type Filter = NonNullable<QueryDataSourceParameters['filter']>

export function buildCollectionQuery(config: ResolvedCollectionConfig): Pick<QueryDataSourceParameters, 'filter' | 'sorts'> {
  const filters: Filter[] = []

  const published = config.properties.published
  if (published) {
    const { property, equals } = published
    const type = published.type ?? (typeof equals === 'boolean' ? 'checkbox' : 'status')
    filters.push(
      type === 'checkbox'
        ? { property, checkbox: { equals: Boolean(equals) } } as Filter
        : { property, [type]: { equals: String(equals) } } as Filter,
    )
  }
  if (config.filter) filters.push(config.filter)

  const filter = filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : { and: filters } as Filter

  return {
    filter,
    sorts: config.sorts ?? [{ timestamp: 'created_time', direction: 'descending' }],
  }
}

/** Default ordering when the collection has no explicit `sorts`: `order` asc (nulls last), then `date` desc. */
export function sortItems<T extends NotionCollectionItem>(items: T[], config: ResolvedCollectionConfig): T[] {
  if (config.sorts) return items

  return [...items].sort((a, b) => {
    if (a.order !== b.order) {
      if (a.order === null) return 1
      if (b.order === null) return -1
      return a.order - b.order
    }
    return (b.date ?? '').localeCompare(a.date ?? '')
  })
}

export function collectTags(items: NotionCollectionItem[]): NotionCollectionTag[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const tag of item.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
