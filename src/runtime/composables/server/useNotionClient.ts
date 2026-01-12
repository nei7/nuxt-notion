import { useRuntimeConfig } from '#imports'
import { Client } from '@notionhq/client'

let notionClient: Client

export const useNotionClient = () => {
  if (notionClient) return notionClient

  if (import.meta.server) {
    const config = useRuntimeConfig().nuxtNotion

    notionClient = new Client({
      auth: config.notionApiKey,
    })
  }
  else
    notionClient = new Client()

  return notionClient
}
