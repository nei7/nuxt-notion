import { readValidatedBody } from 'h3'
import { useNotionClient } from '../../../composables/server/useNotionClient'
import { z } from 'zod'
import { defineCachedEventHandler } from 'nitropack/runtime'

const schema = z.object({
  data_source_id: z.string(),

  filter: z
    .any()
    .optional(),
  sorts: z.array(z.any()).optional(),

  page_size: z.number().optional().default(25),
})

export default defineCachedEventHandler(async (event) => {
  const client = useNotionClient()
  const query = await readValidatedBody(event, schema.parse)

  return client.dataSources.query(query)
})
