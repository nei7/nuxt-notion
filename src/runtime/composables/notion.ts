import type { GetPageParameters, GetPageResponse, ListBlockChildrenParameters, ListBlockChildrenResponse, QueryDataSourceParameters, QueryDataSourceResponse } from '@notionhq/client'

export const getNotionBlocks = (params: ListBlockChildrenParameters) => {
  return $fetch<ListBlockChildrenResponse>('/api/_notion/blocks', { query: params })
}

export const queryNotionDatabase = (params: QueryDataSourceParameters) => {
  return $fetch<QueryDataSourceResponse>('/api/_notion/query-database', { query: params })
}

export const getNotionPage = (params: GetPageParameters) => {
  return $fetch<GetPageResponse>('/api/_notion/page', { query: params })
}
