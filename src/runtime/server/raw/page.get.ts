import { createError, getValidatedQuery, defineEventHandler } from 'h3'
import { isFullPage } from '@notionhq/client'
import { z } from 'zod'
import { useNotionClient } from '../lib/client'
import { useNotionConfig } from '../lib/config'
import { dashlessId } from '../../utils/mapping'

const schema = z.object({
  page_id: z.string(),
  filter_properties: z
    .union([z.string().transform(v => [v]), z.array(z.string())])
    .optional(),
})

/** Raw proxy (only mounted with `exposeRawApi`). Pages outside the configured data sources are rejected. */
export default defineEventHandler(async (event) => {
  const client = useNotionClient(event)
  const query = await getValidatedQuery(event, schema.parse)

  const page = await client.pages.retrieve(query)
  if (!isFullPage(page)) return page

  const allowed = new Set(Object.values(useNotionConfig(event).collections).map(c => dashlessId(c.dataSourceId)))
  const parent = page.parent
  if (parent.type !== 'data_source_id' || !allowed.has(dashlessId(parent.data_source_id))) {
    throw createError({ statusCode: 403, message: 'This page is not part of a configured collection' })
  }

  return page
})
