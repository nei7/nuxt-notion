import createMetascraper from 'metascraper'
import metascraperTitle from 'metascraper-title'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperFavicon from 'metascraper-logo-favicon'
import { defineCachedEventHandler } from 'nitropack/runtime'
import { getQuery, createError } from 'h3'

const scraper = createMetascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
  metascraperFavicon(),
])

export default defineCachedEventHandler(async (event) => {
  const { url } = getQuery(event)
  const targetUrl = url?.toString()

  if (!targetUrl) {
    throw createError({ statusCode: 400, message: `"url" is required` })
  }
  const title = targetUrl ? new URL(targetUrl).hostname : 'Link'

  try {
    const html = await $fetch<string>(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
      timeout: 5000,
    })

    const metadata = await scraper({ html, url: targetUrl })
    return {
      success: true,
      title: metadata.title || title,
      description: metadata.description,
      image: metadata.image,
      icon: metadata.logo,
      url: url,
    }
  }
  catch {
    return {
      success: false,
      title,
      url: url,

    }
  }
})
