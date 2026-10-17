import { createError, defineEventHandler, getHeader, getValidatedQuery, getValidatedRouterParams, sendProxy } from 'h3'
import { z } from 'zod'
import { getNotionFileUrl } from '../../../lib/files'

const paramsSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{32}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
})

const querySchema = z.object({
  kind: z.enum(['block', 'cover', 'icon', 'callout']).default('block'),
  v: z.string().max(32).optional(),
})

/**
 * Streams a Notion-hosted file through the site. Signed S3 URLs expire after an
 * hour, so cached block trees reference this stable route instead; the lookup
 * behind `getNotionFileUrl` is cached for 50 minutes.
 */
export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)
  const { kind, v } = await getValidatedQuery(event, querySchema.parse)

  const target = await getNotionFileUrl(event, id, kind)
  if (!target) throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  const range = getHeader(event, 'range')
  const cacheControl = v ? 'public, max-age=31536000, immutable' : 'public, max-age=3600'

  return sendProxy(event, target, {
    headers: range ? { range } : {},
    fetchOptions: { redirect: 'follow' },
    onResponse(proxiedEvent) {
      proxiedEvent.node.res.setHeader('cache-control', cacheControl)
      proxiedEvent.node.res.removeHeader('set-cookie')
    },
  })
})
