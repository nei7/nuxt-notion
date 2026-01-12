import { getValidatedQuery } from 'h3'
import { useNotionClient } from '../../../composables/server/useNotionClient'
import { z } from 'zod'
import type { ListBlockChildrenParameters } from '@notionhq/client'
import { defineCachedEventHandler } from 'nitropack/runtime'

const schema: z.ZodType<ListBlockChildrenParameters> = z.object({
  block_id: z.string(),
  start_cursor: z.string().optional(),
  page_size: z.number().optional(),
})

export default defineCachedEventHandler(async (event) => {
  const client = useNotionClient()

  const query = await getValidatedQuery(event, schema.parse)

  return client.blocks.children.list(query)
})
