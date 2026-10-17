import { useAsyncData, type AsyncDataOptions, type NuxtApp } from '#app'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type {
  NotionCollectionItemResponse,
  NotionCollectionName,
  NotionCollectionProps,
  NotionCollectionQuery,
  NotionCollectionResponse,
} from '../../types/collections'

type CachedDataContext = { cause: 'initial' | 'refresh:manual' | 'refresh:hook' | 'watch' }

/**
 * Reuses the SSR payload on hydration and across client-side navigations, but
 * lets an explicit `refresh()` reach the network.
 */
export function notionCachedData<T>(key: string, nuxtApp: NuxtApp, ctx: CachedDataContext): T | undefined {
  if (ctx.cause === 'refresh:manual' || ctx.cause === 'refresh:hook') return undefined
  return (nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]) as T | undefined
}

const toQueryParams = (query: NotionCollectionQuery) => {
  const params: Record<string, string> = {}
  if (query.tag) params.tag = query.tag
  if (query.limit) params.limit = String(query.limit)
  if (query.featured !== undefined) params.featured = String(query.featured)
  return params
}

/** Lists a collection's published items (optionally filtered by tag/featured and limited). */
export function useNotionCollection<N extends NotionCollectionName>(
  name: MaybeRefOrGetter<N>,
  query: MaybeRefOrGetter<NotionCollectionQuery> = {},
  options: AsyncDataOptions<NotionCollectionResponse<NotionCollectionProps<N>>> = {},
) {
  type Response = NotionCollectionResponse<NotionCollectionProps<N>>

  const params = computed(() => toQueryParams(toValue(query)))
  const key = computed(() => `notion:collection:${toValue(name)}:${JSON.stringify(params.value)}`)

  return useAsyncData<Response>(
    key,
    () => $fetch<Response>(`/api/_notion/collections/${toValue(name)}`, { query: params.value }),
    { getCachedData: notionCachedData, ...options },
  )
}

/** One item by slug, with its block tree, headings, reading time and neighbours. */
export function useNotionCollectionItem<N extends NotionCollectionName>(
  name: MaybeRefOrGetter<N>,
  slug: MaybeRefOrGetter<string>,
  options: AsyncDataOptions<NotionCollectionItemResponse<NotionCollectionProps<N>>> = {},
) {
  type Response = NotionCollectionItemResponse<NotionCollectionProps<N>>

  const key = computed(() => `notion:item:${toValue(name)}:${toValue(slug)}`)

  return useAsyncData<Response>(
    key,
    () => $fetch<Response>(`/api/_notion/collections/${toValue(name)}/${encodeURIComponent(toValue(slug))}`),
    { getCachedData: notionCachedData, ...options },
  )
}
