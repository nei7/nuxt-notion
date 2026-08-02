import { getValidatedQuery, defineEventHandler } from 'h3'
import { useNotionClient } from '../../../composables/server/useNotionClient'
import { z } from 'zod'

// query params arrive as strings, so numbers must be coerced
const schema = z.object({
  block_id: z.string(),
  start_cursor: z.string().optional(),
  page_size: z.coerce.number().int().min(1).max(100).optional(),
})

export default defineEventHandler(async (event) => {
  const client = useNotionClient()

  const query = await getValidatedQuery(event, schema.parse)

  return client.blocks.children.list(query)
})
