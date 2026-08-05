import { readValidatedBody, defineEventHandler, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { useNotionClient } from '../../../composables/server/useNotionClient'
import { z } from 'zod'

const schema = z.object({
  data_source_id: z.string().optional(),

  filter: z
    .any()
    .optional(),
  sorts: z.array(z.any()).optional(),

  page_size: z.number().optional().default(25),
})

export default defineEventHandler(async (event) => {
  const query = await readValidatedBody(event, schema.parse)
  const { dataSourceId } = useRuntimeConfig(event).nuxtNotion

  const data_source_id = query.data_source_id ?? dataSourceId
  if (!data_source_id) {
    throw createError({
      statusCode: 400,
      message: 'data_source_id is required when no default data source is configured',
    })
  }
  if (dataSourceId && data_source_id !== dataSourceId) {
    throw createError({ statusCode: 403, message: 'Querying this data source is not allowed' })
  }

  const client = useNotionClient()

  return client.dataSources.query({ ...query, data_source_id })
})
