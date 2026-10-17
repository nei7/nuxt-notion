import type { H3Event } from 'h3'
import { Client } from '@notionhq/client'
import { useNotionConfig } from './config'

/**
 * Creates a Notion client for the current request. A new instance per call is
 * intentional: it keeps the module safe on isolate-based runtimes where
 * secrets are bound per request.
 */
export const useNotionClient = (event?: H3Event) => {
  const { apiKey } = useNotionConfig(event)

  return new Client({ auth: apiKey })
}
