import type { ListBlockChildrenParameters, ListBlockChildrenResponse } from '@notionhq/client'

export const getNotionBlocks = (params: ListBlockChildrenParameters) => {
  return $fetch<ListBlockChildrenResponse>('/api/_notion/blocks', { query: params })
}
