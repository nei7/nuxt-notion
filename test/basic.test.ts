import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch, fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('does not mount the raw proxy routes by default', async () => {
    // Without the handler the request falls through to the Nuxt app renderer.
    const res = await fetch('/api/_notion/blocks?block_id=x')
    expect(res.headers.get('content-type')).toContain('text/html')
  })

  it('returns 404 for unknown collections', async () => {
    const res = await fetch('/api/_notion/collections/nope')
    expect(res.status).toBe(404)
  })

  it('answers the webhook handshake without a secret', async () => {
    const res = await fetch('/api/_notion/webhook', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ verification_token: 'tok_test' }),
    })
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true, handshake: true })
  })

  it('rejects unsigned webhook events', async () => {
    const res = await fetch('/api/_notion/webhook', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'page.content_updated', entity: { id: 'x', type: 'page' } }),
    })
    expect(res.status).toBe(401)
  })
})
