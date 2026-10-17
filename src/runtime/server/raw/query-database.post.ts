import { readValidatedBody, defineEventHandler, createError } from 'h3'
import { z } from 'zod'
import { useNotionClient } from '../lib/client'
import { useNotionConfig } from '../lib/config'
import { buildCollectionQuery, dashlessId } from '../../utils/mapping'

const schema = z.object({
  data_source_id: z.string(),
  filter: z.any().optional(),
  sorts: z.array(z.any()).optional(),
  start_cursor: z.string().optional(),
  page_size: z.number().int().min(1).max(100).optional().default(25),
})

/**
 * Raw proxy (only mounted with `exposeRawApi`). Only configured data sources can
 * be queried, and the collection's published filter is always AND-ed in, so
 * clients cannot read drafts by overriding the filter.
 */
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  const { collections } = useNotionConfig(event)

  const requested = dashlessId(body.data_source_id)
  const config = Object.values(collections).find(c => dashlessId(c.dataSourceId) === requested)
  if (!config) {
    throw createError({ statusCode: 403, message: 'Querying this data source is not allowed' })
  }

  const { filter: serverFilter } = buildCollectionQuery(config)
  const filter = serverFilter && body.filter
    ? { and: [serverFilter, body.filter] }
    : serverFilter ?? body.filter

  const client = useNotionClient(event)

  return client.dataSources.query({
    data_source_id: config.dataSourceId,
    filter,
    sorts: body.sorts,
    start_cursor: body.start_cursor,
    page_size: body.page_size,
  })
})
