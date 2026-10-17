import { createError, defineEventHandler, getValidatedRouterParams, setResponseHeader } from 'h3'
import { z } from 'zod'
import type { NotionCollectionItemResponse } from '../../../../../types/collections'
import { getCollectionItem } from '../../../../lib/collections'

const paramsSchema = z.object({
  name: z.string().regex(/^[\w-]{1,40}$/),
  slug: z.string().regex(/^[\w.-]{1,200}$/),
})

export default defineEventHandler(async (event): Promise<NotionCollectionItemResponse> => {
  const { name, slug } = await getValidatedRouterParams(event, paramsSchema.parse)

  const response = await getCollectionItem(event, name, slug)
  if (!response) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: `No "${name}" item with slug "${slug}"` })
  }

  setResponseHeader(event, 'cache-control', 'public, max-age=60, stale-while-revalidate=600')

  return response
})
