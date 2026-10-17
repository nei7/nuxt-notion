import { describe, expect, it } from 'vitest'
import { signWebhookPayload } from '@notionhq/client'
import {
  collectionsByDataSourceId,
  invalidationTargets,
  parseWebhook,
  verifyNotionWebhook,
} from '../../src/runtime/utils/webhook'

const SECRET = 'secret_test_token'
const POSTS_DS = '855b82e0-9293-4034-909b-40c31660c9d2'

/** `dataSourceId: null` produces a parent without `data_source_id`. */
const pageEvent = (type: string, dataSourceId: string | null = POSTS_DS) => ({
  id: 'evt',
  type,
  entity: { id: '77c36c79-5d5c-463b-abbe-890071acca79', type: 'page' },
  data: { parent: { id: 'x', type: 'data_source', ...(dataSourceId ? { data_source_id: dataSourceId } : {}) } },
})

describe('parseWebhook', () => {
  it('detects the verification handshake', () => {
    expect(parseWebhook(JSON.stringify({ verification_token: 'tok' }))).toEqual({ kind: 'handshake', token: 'tok' })
  })

  it('detects events', () => {
    const parsed = parseWebhook(JSON.stringify(pageEvent('page.content_updated')))
    expect(parsed.kind).toBe('event')
  })

  it('rejects garbage', () => {
    expect(parseWebhook('not json').kind).toBe('invalid')
    expect(parseWebhook('[]').kind).toBe('invalid')
    expect(parseWebhook('{}').kind).toBe('invalid')
  })
})

describe('verifyNotionWebhook', () => {
  it('accepts a signature produced with the same token', async () => {
    const body = JSON.stringify(pageEvent('page.content_updated'))
    const signature = await signWebhookPayload({ body, verificationToken: SECRET })

    await expect(verifyNotionWebhook(body, signature, SECRET)).resolves.toBe(true)
  })

  it('rejects a tampered body, a wrong token and a missing header', async () => {
    const body = JSON.stringify(pageEvent('page.content_updated'))
    const signature = await signWebhookPayload({ body, verificationToken: SECRET })

    await expect(verifyNotionWebhook(body + ' ', signature, SECRET)).resolves.toBe(false)
    await expect(verifyNotionWebhook(body, signature, 'other')).resolves.toBe(false)
    await expect(verifyNotionWebhook(body, undefined, SECRET)).resolves.toBe(false)
    await expect(verifyNotionWebhook(body, 'sha256=deadbeef', SECRET)).resolves.toBe(false)
  })
})

describe('invalidationTargets', () => {
  const byDataSource = collectionsByDataSourceId({
    posts: { dataSourceId: POSTS_DS },
    projects: { dataSourceId: '11111111222233334444555555555555' },
    unset: { dataSourceId: '' },
  })

  it('maps configured data sources regardless of dashes', () => {
    expect(byDataSource).toEqual({
      '855b82e092934034909b40c31660c9d2': 'posts',
      '11111111222233334444555555555555': 'projects',
    })
  })

  it('targets the page and its collection for page events', () => {
    expect(invalidationTargets(pageEvent('page.content_updated'), byDataSource)).toEqual({
      collection: 'posts',
      pageId: '77c36c795d5c463babbe890071acca79',
    })
  })

  it('clears everything when the parent data source is unknown', () => {
    expect(invalidationTargets(pageEvent('page.created', 'ffffffffffffffffffffffffffffffff'), byDataSource)).toEqual({})
    expect(invalidationTargets(pageEvent('page.created', null), byDataSource)).toEqual({})
  })

  it('targets the collection for data source events', () => {
    const event = { type: 'data_source.schema_updated', entity: { id: POSTS_DS, type: 'data_source' } }
    expect(invalidationTargets(event, byDataSource)).toEqual({ collection: 'posts' })
  })

  it('ignores comment and file upload events', () => {
    expect(invalidationTargets({ type: 'comment.created' }, byDataSource)).toBeNull()
    expect(invalidationTargets({ type: 'file_upload.completed' }, byDataSource)).toBeNull()
  })

  it('clears everything for unknown event families', () => {
    expect(invalidationTargets({ type: 'something.new' }, byDataSource)).toEqual({})
  })
})
