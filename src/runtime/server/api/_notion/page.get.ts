import { getValidatedQuery } from 'h3'
import { useNotionClient } from '../../../composables/useNotionClient'
import { z } from 'zod'
import type { GetPageParameters } from '@notionhq/client'
import { defineCachedEventHandler } from 'nitropack/runtime'

const schema: z.ZodType<GetPageParameters> = z.object({
  page_id: z.string(),
  filter_properties: z.array(z.string()),
})

export default defineCachedEventHandler(async (event) => {
  const client = useNotionClient()

  const query = await getValidatedQuery(event, schema.parse)

  return client.pages.retrieve(query)
})
