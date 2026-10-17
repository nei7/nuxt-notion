import { defineEventHandler, getValidatedQuery, getValidatedRouterParams, setResponseHeader } from 'h3'
import { z } from 'zod'
import type { NotionCollectionResponse } from '../../../../../types/collections'
import { getCollectionItems, getCollectionTags } from '../../../../lib/collections'

const paramsSchema = z.object({
  name: z.string().regex(/^[\w-]{1,40}$/),
})

const querySchema = z.object({
  tag: z.string().max(60).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  featured: z.enum(['true', 'false']).optional(),
})

export default defineEventHandler(async (event): Promise<NotionCollectionResponse> => {
  const { name } = await getValidatedRouterParams(event, paramsSchema.parse)
  const query = await getValidatedQuery(event, querySchema.parse)

  const all = await getCollectionItems(event, name)

  let items = all
  if (query.tag) items = items.filter(item => item.tags.includes(query.tag!))
  if (query.featured) items = items.filter(item => item.featured === (query.featured === 'true'))
  if (query.limit) items = items.slice(0, query.limit)

  setResponseHeader(event, 'cache-control', 'public, max-age=60, stale-while-revalidate=600')

  return { items, tags: getCollectionTags(all), total: all.length }
})
