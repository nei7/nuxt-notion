import { createError, defineEventHandler, getHeader, readRawBody } from 'h3'
import { useNotionConfig } from '../../lib/config'
import { invalidateNotionCache } from '../../lib/collections'
import { collectionsByDataSourceId, invalidationTargets, parseWebhook, verifyNotionWebhook } from '../../../utils/webhook'

/**
 * Notion webhook receiver.
 *
 * 1. On subscription Notion POSTs `{ verification_token }` unsigned: the token is
 *    logged so it can be pasted back into Notion and stored as `webhookSecret`.
 * 2. Every later delivery is verified (HMAC over the raw body) and mapped to a
 *    cache invalidation: a page event clears its collection list and its content,
 *    a data-source event clears the collection, anything unknown clears all.
 */
export default defineEventHandler(async (event) => {
  const raw = (await readRawBody(event, 'utf8')) ?? ''
  const parsed = parseWebhook(raw)

  if (parsed.kind === 'invalid') {
    throw createError({ statusCode: 400, message: 'Malformed webhook payload' })
  }

  if (parsed.kind === 'handshake') {
    console.info(`[nuxt-notion] Webhook verification token received: ${parsed.token}`)
    return { ok: true, handshake: true }
  }

  const { webhookSecret, collections } = useNotionConfig(event)
  if (!webhookSecret) {
    throw createError({ statusCode: 503, message: 'nuxtNotion.webhookSecret is not configured' })
  }

  const valid = await verifyNotionWebhook(raw, getHeader(event, 'x-notion-signature'), webhookSecret)
  if (!valid) throw createError({ statusCode: 401, message: 'Invalid webhook signature' })

  const target = invalidationTargets(parsed.payload, collectionsByDataSourceId(collections))
  if (target) {
    const work = invalidateNotionCache(target)
    if (event.waitUntil) event.waitUntil(work)
    else await work
  }

  return { ok: true, invalidated: target ?? false }
})
