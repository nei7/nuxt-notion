import { readValidatedBody, defineEventHandler } from 'h3'
import { useNotionClient } from '../../../composables/server/useNotionClient'
import { z } from 'zod'

const schema = z.object({
  data_source_id: z.string(),

  filter: z
    .any()
    .optional(),
  sorts: z.array(z.any()).optional(),

  page_size: z.number().optional().default(25),
})

export default defineEventHandler(async (event) => {
  const client = useNotionClient()
  const query = await readValidatedBody(event, schema.parse)

  return client.dataSources.query(query)
})
