import { useRuntimeConfig } from '#imports'
import { Client } from '@notionhq/client'

export const useNotionClient = () => {
  const config = useRuntimeConfig().nuxtNotion

  return new Client({
    auth: config.apiKey,
  })
}
