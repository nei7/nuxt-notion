import { useRuntimeConfig } from '#imports'
import { Client } from '@notionhq/client'

let notionClient: Client

export const useNotionClient = () => {
  if (notionClient) return notionClient

  const config = useRuntimeConfig().nuxtNotion

  notionClient = new Client({
    auth: config.notionApiKey,
  })

  return notionClient
}
