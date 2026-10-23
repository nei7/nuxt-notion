import { describe, expect, it } from 'vitest'
import {
  buildCollectionQuery,
  collectTags,
  normalizeSlug,
  resolveCollectionConfig,
  resolvePropertyMap,
  sortItems,
  toCollectionItem,
} from '../../src/runtime/utils/mapping'
import { makePage, prop } from './fixtures'

const articlesPage = () => makePage({
  title: prop.title('How I build my own kubernetes cluster part. 1'),
  url: prop.url('k3s-cluster-on-raspberrypi'),
  description: prop.text('Building kubernetes cluster'),
  category: prop.select('Kubernetes'),
  status: prop.status('Published'),
  published: prop.createdTime('2023-06-18T12:18:35.900Z'),
})

describe('toCollectionItem', () => {
  const map = resolvePropertyMap()

  it('falls back to url, category and created_time for the Articles schema', () => {
    const item = toCollectionItem(articlesPage(), map)

    expect(item.slug).toBe('k3s-cluster-on-raspberrypi')
    expect(item.title).toBe('How I build my own kubernetes cluster part. 1')
    expect(item.description).toBe('Building kubernetes cluster')
    expect(item.tags).toEqual(['Kubernetes'])
    expect(item.date).toBe('2023-06-18T12:18:35.900Z')
    expect(item.featured).toBe(false)
    expect(item.order).toBeNull()
    expect(item.cover).toBeNull()
    expect(item.icon).toBeNull()
    expect(item.properties.status).toBe('Published')
  })

  it('prefers date and tags when they exist', () => {
    const page = makePage({
      ...articlesPage().properties,
      date: prop.date('2024-02-01'),
      tags: prop.multiSelect(['Linux', 'Homelab']),
      featured: prop.checkbox(true),
      order: prop.number(2),
    })

    const item = toCollectionItem(page, map)

    expect(item.date).toBe('2024-02-01')
    expect(item.tags).toEqual(['Linux', 'Homelab'])
    expect(item.featured).toBe(true)
    expect(item.order).toBe(2)
  })

  it('ignores empty preferred properties', () => {
    const page = makePage({
      ...articlesPage().properties,
      date: prop.date(null),
      tags: prop.multiSelect([]),
    })

    const item = toCollectionItem(page, map)

    expect(item.date).toBe('2023-06-18T12:18:35.900Z')
    expect(item.tags).toEqual(['Kubernetes'])
  })

  it('uses the last path segment of a URL-shaped slug', () => {
    const page = makePage({ ...articlesPage().properties, url: prop.url('https://example.com/blog/My-Post/') })
    expect(toCollectionItem(page, map).slug).toBe('my-post')
  })

  it('falls back to the page id when no slug is set', () => {
    const page = makePage({ ...articlesPage().properties, url: prop.url(null) })
    expect(toCollectionItem(page, map).slug).toBe('77c36c795d5c463babbe890071acca79')
  })

  it('finds the title property by type when the mapped name is missing', () => {
    const page = makePage({ Name: prop.title('Untitled schema') })
    expect(toCollectionItem(page, map).title).toBe('Untitled schema')
  })

  it('routes Notion-hosted covers through the image proxy and keeps external ones', () => {
    const hosted = makePage(articlesPage().properties, {
      cover: { type: 'file', file: { url: 'https://s3.example/x', expiry_time: '2030-01-01' } },
      icon: { type: 'emoji', emoji: '📰' },
    })
    const external = makePage(articlesPage().properties, { cover: { type: 'external', external: { url: 'https://img.example/c.png' } } })

    expect(toCollectionItem(hosted, map).cover).toMatch(/^\/api\/_notion\/image\/77c36c79-5d5c-463b-abbe-890071acca79\?kind=cover&v=\w+$/)
    expect(toCollectionItem(hosted, map).icon).toEqual({ type: 'emoji', emoji: '📰' })
    expect(toCollectionItem(external, map).cover).toBe('https://img.example/c.png')
  })

  it('honours a custom property map', () => {
    const page = makePage({
      name: prop.title('nuxt-notion'),
      tech: prop.multiSelect(['Nuxt', 'TypeScript']),
      published: prop.checkbox(true),
    })
    const custom = resolvePropertyMap({ title: 'name', tags: 'tech', published: { property: 'published', equals: true } })

    const item = toCollectionItem(page, custom)
    expect(item.title).toBe('nuxt-notion')
    expect(item.tags).toEqual(['Nuxt', 'TypeScript'])
  })
})

describe('normalizeSlug', () => {
  it.each([
    ['hello-world', 'hello-world'],
    ['  Hello ', 'hello'],
    ['https://site.dev/blog/post?x=1#top', 'post'],
    ['/nested/path/slug/', 'slug'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeSlug(input)).toBe(expected)
  })
})

describe('buildCollectionQuery', () => {
  it('builds a status filter by default and sorts by created_time', () => {
    const query = buildCollectionQuery(resolveCollectionConfig({ dataSourceId: 'x' }))
    expect(query.filter).toEqual({ property: 'status', status: { equals: 'Published' } })
    expect(query.sorts).toEqual([{ timestamp: 'created_time', direction: 'descending' }])
  })

  it('builds a checkbox filter for boolean equals', () => {
    const query = buildCollectionQuery(resolveCollectionConfig({ properties: { published: { property: 'live', equals: true } } }))
    expect(query.filter).toEqual({ property: 'live', checkbox: { equals: true } })
  })

  it('supports select properties explicitly', () => {
    const query = buildCollectionQuery(resolveCollectionConfig({ properties: { published: { property: 'state', equals: 'Live', type: 'select' } } }))
    expect(query.filter).toEqual({ property: 'state', select: { equals: 'Live' } })
  })

  it('ANDs the user filter with the published filter', () => {
    const userFilter = { property: 'lang', select: { equals: 'en' } } as const
    const query = buildCollectionQuery(resolveCollectionConfig({ filter: userFilter }))
    expect(query.filter).toEqual({ and: [{ property: 'status', status: { equals: 'Published' } }, userFilter] })
  })

  it('omits the filter when published is disabled', () => {
    const query = buildCollectionQuery(resolveCollectionConfig({ properties: { published: false } }))
    expect(query.filter).toBeUndefined()
  })

  it('does not emit unset filter/sorts keys, so Nuxt cannot turn them into empty strings', () => {
    const config = resolveCollectionConfig({ dataSourceId: 'x' })
    expect(config).not.toHaveProperty('filter')
    expect(config).not.toHaveProperty('sorts')
  })

  it('treats the empty string Nuxt substitutes for unset runtime config as "no filter/sorts"', () => {
    // Nuxt replaces `undefined` runtime-config values with '' (so env vars can override them).
    const runtimeConfig = { ...resolveCollectionConfig({ dataSourceId: 'x' }), filter: '', sorts: '' } as unknown as ReturnType<typeof resolveCollectionConfig>
    const query = buildCollectionQuery(runtimeConfig)
    expect(query.filter).toEqual({ property: 'status', status: { equals: 'Published' } })
    expect(query.sorts).toEqual([{ timestamp: 'created_time', direction: 'descending' }])
  })

  it('falls back to the default sort for an empty sorts array', () => {
    const query = buildCollectionQuery(resolveCollectionConfig({ sorts: [] }))
    expect(query.sorts).toEqual([{ timestamp: 'created_time', direction: 'descending' }])
  })
})

describe('sortItems', () => {
  const map = resolvePropertyMap()
  const make = (id: string, order: number | null, date: string) => ({
    ...toCollectionItem(makePage({ title: prop.title(id) }), map),
    id,
    order,
    date,
  })

  it('orders by `order` ascending with nulls last, then by date descending', () => {
    const items = [make('a', null, '2024-01-01'), make('b', 2, '2020-01-01'), make('c', 1, '2021-01-01'), make('d', null, '2025-01-01')]
    expect(sortItems(items, resolveCollectionConfig({})).map(i => i.id)).toEqual(['c', 'b', 'd', 'a'])
  })

  it('keeps Notion order when the collection defines sorts', () => {
    const items = [make('a', null, '2020-01-01'), make('b', 1, '2025-01-01')]
    expect(sortItems(items, resolveCollectionConfig({ sorts: [{ property: 'x', direction: 'ascending' }] })).map(i => i.id)).toEqual(['a', 'b'])
  })

  it('applies the default order when sorts is the empty string Nuxt substitutes for undefined', () => {
    const items = [make('a', null, '2020-01-01'), make('b', 1, '2025-01-01')]
    const runtimeConfig = { ...resolveCollectionConfig({}), sorts: '' } as unknown as ReturnType<typeof resolveCollectionConfig>
    expect(sortItems(items, runtimeConfig).map(i => i.id)).toEqual(['b', 'a'])
  })
})

describe('collectTags', () => {
  it('counts tags and sorts by count then name', () => {
    const map = resolvePropertyMap()
    const items = [
      toCollectionItem(makePage({ title: prop.title('1'), tags: prop.multiSelect(['b', 'a']) }), map),
      toCollectionItem(makePage({ title: prop.title('2'), tags: prop.multiSelect(['b']) }), map),
    ]
    expect(collectTags(items)).toEqual([{ name: 'b', count: 2 }, { name: 'a', count: 1 }])
  })
})
