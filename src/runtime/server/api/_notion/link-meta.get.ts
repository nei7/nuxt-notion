import { createError, getQuery, getValidatedQuery } from 'h3'
import { z } from 'zod'
import { defineCachedEventHandler } from 'nitropack/runtime'
import type { LinkMetadataResponse } from '../../../types'
import { isAllowedUrl, scrapeLinkMetadata } from '../../../utils/link-meta'
import { useNotionConfig } from '../../lib/config'

const schema = z.object({
  url: z.url({ protocol: /^https?$/ }),
})

const LINK_META_MAX_AGE = 60 * 60 * 24

export default defineCachedEventHandler(async (event): Promise<LinkMetadataResponse> => {
  const { linkMeta } = useNotionConfig(event)
  if (!linkMeta.enabled) throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  const { url } = await getValidatedQuery(event, schema.parse)
  if (!isAllowedUrl(url, linkMeta.allowedHosts)) {
    throw createError({ statusCode: 403, message: 'This URL cannot be previewed' })
  }

  return scrapeLinkMetadata(url, linkMeta.allowedHosts)
}, {
  group: 'notion-meta',
  name: 'link',
  maxAge: LINK_META_MAX_AGE,
  swr: true,
  getKey: event => encodeURIComponent(String(getQuery(event).url ?? '')).slice(0, 512),
})
