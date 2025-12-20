import { useRuntimeConfig } from '#app'
import { Client, type ListBlockChildrenParameters } from '@notionhq/client'

export const useNotion = () => {
  const notionClient = new Client({
  })

  const getPageBlocks = async (params: ListBlockChildrenParameters) => {
    const config = useRuntimeConfig().nuxtNotion

    const response = await notionClient.blocks.children.list({
      ...params,
      auth: config?.notionApiKey,
    })
    return response.results
  }

  return {
    getPageBlocks,
  }
}
