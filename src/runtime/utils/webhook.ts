import { verifyWebhookSignature } from '@notionhq/client'
import { dashlessId } from './mapping'

export type ParsedWebhook
  = | { kind: 'handshake', token: string }
    | { kind: 'event', payload: WebhookEventPayload }
    | { kind: 'invalid' }

/** The subset of Notion's webhook payload the module relies on. */
export interface WebhookEventPayload {
  id?: string
  type?: string
  entity?: { id?: string, type?: string }
  data?: { parent?: { id?: string, type?: string, data_source_id?: string } }
}

export interface InvalidationTarget {
  collection?: string
  pageId?: string
}

export function parseWebhook(raw: string): ParsedWebhook {
  let body: unknown
  try {
    body = JSON.parse(raw)
  }
  catch {
    return { kind: 'invalid' }
  }
  if (!body || typeof body !== 'object') return { kind: 'invalid' }

  const record = body as Record<string, unknown>
  if (typeof record.verification_token === 'string') return { kind: 'handshake', token: record.verification_token }
  if (typeof record.type === 'string') return { kind: 'event', payload: record as WebhookEventPayload }
  return { kind: 'invalid' }
}

export function verifyNotionWebhook(raw: string, signature: string | null | undefined, secret: string): Promise<boolean> {
  return verifyWebhookSignature({ body: raw, signature, verificationToken: secret })
}

/** Event families that never affect rendered content. */
const IGNORED_PREFIXES = ['comment.', 'file_upload.', 'view.']

/**
 * Decides what to invalidate for a webhook event. Returns `null` when nothing
 * should happen, `{}` when everything should be cleared (unknown scope).
 */
export function invalidationTargets(payload: WebhookEventPayload, collectionsByDataSourceId: Record<string, string>): InvalidationTarget | null {
  const type = payload.type ?? ''
  if (IGNORED_PREFIXES.some(prefix => type.startsWith(prefix))) return null

  const entityId = payload.entity?.id ? dashlessId(payload.entity.id) : undefined
  const parentDataSource = payload.data?.parent?.data_source_id ? dashlessId(payload.data.parent.data_source_id) : undefined

  if (type.startsWith('page.')) {
    const collection = parentDataSource ? collectionsByDataSourceId[parentDataSource] : undefined
    if (!collection || !entityId) return {}
    return { collection, pageId: entityId }
  }

  if (type.startsWith('data_source.') || type.startsWith('database.')) {
    const collection = (entityId && collectionsByDataSourceId[entityId]) || (parentDataSource && collectionsByDataSourceId[parentDataSource])
    return collection ? { collection } : {}
  }

  return {}
}

export function collectionsByDataSourceId(collections: Record<string, { dataSourceId?: string }>): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [name, config] of Object.entries(collections)) {
    if (config.dataSourceId) map[dashlessId(config.dataSourceId)] = name
  }
  return map
}
