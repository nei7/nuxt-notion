import { useAsyncData, useNuxtApp, type AsyncData, type AsyncDataOptions, type NuxtError } from '#app'
import type { GetPageParameters, GetPageResponse, ListBlockChildrenParameters, ListBlockChildrenResponse, QueryDataSourceParameters, QueryDataSourceResponse } from '@notionhq/client'

export type NotionComposable<TParams, TData> = {
  <TResult = TData>(
    params: TParams,
    options?: AsyncDataOptions<TData, TResult>
  ): AsyncData<TResult | null, NuxtError | null>

  withTransform: <TTransformed>(
    transformFn: (data: TData) => TTransformed,
  ) => NotionComposable<TParams, TTransformed>

  withCachedData: (getCacheKey?: (params: TParams) => string) => NotionComposable<TParams, TData>
}

export const createNotionData = <TParams, TData>(
  getKey: (params: TParams) => string,
  fetcher: (params: TParams) => Promise<TData>,
  initialOptions: AsyncDataOptions<TData> = {},
): NotionComposable<TParams, TData> => {
  const composableFn = (
    params: TParams,
    callOptions?: AsyncDataOptions<TData>,
  ) => {
    return useAsyncData(
      getKey(params),
      () => fetcher(params),
      { ...initialOptions, ...callOptions },
    )
  }

  composableFn.withTransform = <TTransformed>(
    transformFn: (data: TData) => TTransformed,
  ): NotionComposable<TParams, TTransformed> => {
    const transformedFetcher = async (p: TParams) => {
      const data = await fetcher(p)
      return transformFn(data)
    }

    return createNotionData(
      getKey,
      transformedFetcher,
      initialOptions as unknown as AsyncDataOptions<TTransformed>,
    )
  }

  composableFn.withCachedData = (getCacheKey?: (params: TParams) => string) => {
    const newOptions: AsyncDataOptions<TData> = {
      ...initialOptions,
      getCachedData: (key) => {
        const nuxtApp = useNuxtApp()
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      },
    }

    return createNotionData(getCacheKey ?? getKey, fetcher, newOptions)
  }

  return composableFn as NotionComposable<TParams, TData>
}

export const useNotionDatabase = createNotionData(
  (p: QueryDataSourceParameters) => `notion-db-${JSON.stringify(p)}`,
  p => $fetch<QueryDataSourceResponse>('/api/_notion/query-database', {
    method: 'POST',
    body: p,
  }),
)

export const useNotionPage = createNotionData(
  (p: GetPageParameters) => `notion-page-${JSON.stringify(p)}`,
  p => $fetch<GetPageResponse>('/api/_notion/page', {
    query: p,
  }),
)

export const useNotionBlocks = createNotionData(
  (p: ListBlockChildrenParameters) => `notion-blocks-${JSON.stringify(p)}`,
  p => $fetch<ListBlockChildrenResponse>('/api/_notion/blocks', {
    query: p,
  }),
)
