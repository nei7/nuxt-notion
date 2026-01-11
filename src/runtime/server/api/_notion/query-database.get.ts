import { getValidatedQuery } from 'h3'
import { useNotionClient } from '../../../composables/useNotionClient'
import { z } from 'zod'
import { defineCachedEventHandler } from 'nitropack/runtime'

const schema = z.object({
  data_source_id: z.string(),

  filter: z
    .object()
    .optional(),
  sorts: z.array(z.object()).optional(),

  page_size: z.number().optional().default(25),
})

export default defineCachedEventHandler(async (event) => {
  const client = useNotionClient()

  const query = await getValidatedQuery(event, schema.parse)

  // @ts-expect-error notion api validates data anyway
  return client.dataSources.query(query)
})
