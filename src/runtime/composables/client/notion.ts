import { useAsyncData, type AsyncData, type AsyncDataOptions, type NuxtError } from '#app'
import type { GetPageParameters, GetPageResponse, ListBlockChildrenParameters, ListBlockChildrenResponse, QueryDataSourceParameters, QueryDataSourceResponse } from '@notionhq/client'

export type NotionComposable<TParams, TData> = {
  <TResult = TData>(
    params: TParams,
    options?: AsyncDataOptions<TData, TResult>
  ): AsyncData<TResult | null, NuxtError | null>

  withTransform: <TTransformed>(
    transformFn: (data: TData) => TTransformed,
  ) => NotionComposable<TParams, TTransformed>
}

export const createNotionData = <TParams, TData>(
  getKey: (params: TParams) => string,
  fetcher: (params: TParams) => Promise<TData>,
): NotionComposable<TParams, TData> => {
  const composableFn = <TResult = TData>(
    params: TParams,
    options?: AsyncDataOptions<TData, TResult>,
  ) => {
    return useAsyncData(
      getKey(params),
      () => fetcher(params),
      options,
    )
  }

  composableFn.withTransform = <TTransformed>(
    transformFn: (data: TData) => TTransformed,
  ): NotionComposable<TParams, TTransformed> => {
    const transformedFetcher = async (p: TParams) => {
      const data = await fetcher(p)
      return transformFn(data)
    }

    return createNotionData(getKey, transformedFetcher)
  }

  return composableFn as NotionComposable<TParams, TData>
}

export const useNotionDatabase = createNotionData(
  (p: QueryDataSourceParameters) => `notion-db-${p.data_source_id}-${JSON.stringify(p.filter)}`,
  p => $fetch<QueryDataSourceResponse>('/api/_notion/query-database', {
    method: 'POST',
    body: p,
  }),
)

export const useNotionPage = createNotionData(
  (p: GetPageParameters) => `notion-page-${p.page_id}`,
  p => $fetch<GetPageResponse>('/api/_notion/page', {
    query: p,
  }),
)

export const useNotionBlocks = createNotionData(
  (p: ListBlockChildrenParameters) => `notion-blocks-${p.block_id}`,
  p => $fetch<ListBlockChildrenResponse>('/api/_notion/blocks', {
    query: p,
  }),
)
