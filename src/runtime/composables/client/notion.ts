import { useAsyncData, type AsyncData, type AsyncDataOptions, type NuxtError } from '#app'
import type { GetPageParameters, GetPageResponse, ListBlockChildrenParameters, ListBlockChildrenResponse, QueryDataSourceParameters, QueryDataSourceResponse } from '@notionhq/client'

export type NotionComposable<
  TParams,
  TInput,
  TOutput = TInput,
> = (
  params: TParams,
  options?: AsyncDataOptions<TInput, TOutput>,
) => AsyncData<Pick<TOutput, TOutput extends TOutput ? keyof TOutput extends string ? string & keyof TOutput : never : never> | undefined, NuxtError | undefined>

export const createNotionData = <
  TParams,
  TInput,
  TOutput = TInput,
>(
  getKey: (params: TParams) => string,
  fetcher: (params: TParams) => Promise<TInput>,
): NotionComposable<TParams, TInput, TOutput> => {
  return (params, options) =>
    useAsyncData<TInput, NuxtError, TOutput>(
      getKey(params),
      () => fetcher(params),
      options,
    )
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
