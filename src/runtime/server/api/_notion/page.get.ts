import { getValidatedQuery, defineEventHandler } from 'h3'
import { useNotionClient } from '../../../composables/server/useNotionClient'
import { z } from 'zod'

const schema = z.object({
  page_id: z.string(),
  filter_properties: z
    .union([z.string().transform(v => [v]), z.array(z.string())])
    .optional(),
})

export default defineEventHandler(async (event) => {
  const client = useNotionClient()

  const query = await getValidatedQuery(event, schema.parse)

  return client.pages.retrieve(query)
})
