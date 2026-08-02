import createMetascraper from 'metascraper'
import metascraperTitle from 'metascraper-title'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperFavicon from 'metascraper-logo-favicon'
import { getValidatedQuery } from 'h3'
import { z } from 'zod'
import { defineCachedEventHandler } from 'nitropack/runtime'
import type { LinkMetadataResponse } from '../../../types'

const scraper = createMetascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
  metascraperFavicon(),
])

const schema = z.object({
  url: z.url({ protocol: /^https?$/ }),
})

export default defineCachedEventHandler(async (event): Promise<LinkMetadataResponse> => {
  const { url } = await getValidatedQuery(event, schema.parse)

  const fallbackTitle = new URL(url).hostname

  try {
    const html = await $fetch<string>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
      timeout: 5000,
    })

    const metadata = await scraper({ html, url })

    return {
      success: true,
      title: metadata.title || fallbackTitle,
      description: metadata.description ?? undefined,
      image: metadata.image ?? undefined,
      icon: metadata.logo ?? undefined,
      url,
    }
  }
  catch {
    return {
      success: false,
      title: fallbackTitle,
      url,
    }
  }
})
