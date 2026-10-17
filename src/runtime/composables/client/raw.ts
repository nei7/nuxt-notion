import { useAsyncData, type AsyncDataOptions } from '#app'
import type {
  GetPageParameters,
  GetPageResponse,
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
  QueryDataSourceParameters,
  QueryDataSourceResponse,
} from '@notionhq/client'
import { notionCachedData } from './collections'

/**
 * Thin wrappers around the raw proxy routes (available with `exposeRawApi`).
 * Prefer `useNotionCollection` / `useNotionCollectionItem` for published content.
 */

export function useNotionDatabase(params: QueryDataSourceParameters, options: AsyncDataOptions<QueryDataSourceResponse> = {}) {
  return useAsyncData<QueryDataSourceResponse>(
    `notion:db:${JSON.stringify(params)}`,
    () => $fetch<QueryDataSourceResponse>('/api/_notion/query-database', { method: 'POST', body: params }),
    { getCachedData: notionCachedData, ...options },
  )
}

export function useNotionPage(params: GetPageParameters, options: AsyncDataOptions<GetPageResponse> = {}) {
  return useAsyncData<GetPageResponse>(
    `notion:page:${JSON.stringify(params)}`,
    () => $fetch<GetPageResponse>('/api/_notion/page', { query: params }),
    { getCachedData: notionCachedData, ...options },
  )
}

export function useNotionBlocks(params: ListBlockChildrenParameters, options: AsyncDataOptions<ListBlockChildrenResponse> = {}) {
  return useAsyncData<ListBlockChildrenResponse>(
    `notion:blocks:${JSON.stringify(params)}`,
    () => $fetch<ListBlockChildrenResponse>('/api/_notion/blocks', { query: params }),
    { getCachedData: notionCachedData, ...options },
  )
}
