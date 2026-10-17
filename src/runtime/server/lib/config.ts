import type { H3Event } from 'h3'
import { createError } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import type { NuxtNotionRuntimeConfig } from '../../types/module'
import type { ResolvedCollectionConfig } from '../../types/collections'

/**
 * Typed access to the module's runtime config. Always pass the event when you
 * have one: on serverless platforms secrets are only applied per request.
 */
export function useNotionConfig(event?: H3Event): NuxtNotionRuntimeConfig {
  const config = useRuntimeConfig(event) as unknown as { nuxtNotion?: NuxtNotionRuntimeConfig }
  if (!config.nuxtNotion) {
    throw createError({ statusCode: 500, message: '[nuxt-notion] runtime config is missing; is the module registered?' })
  }
  return config.nuxtNotion
}

export const collectionEnvName = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[-\s]+/g, '_').toUpperCase()

export function getCollectionConfig(event: H3Event | undefined, name: string): ResolvedCollectionConfig {
  const config = useNotionConfig(event).collections?.[name]
  if (!config) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: `Unknown Notion collection "${name}"` })
  }
  if (!config.dataSourceId) {
    throw createError({
      statusCode: 503,
      message: `Notion collection "${name}" has no data source id. Set NUXT_NUXT_NOTION_COLLECTIONS_${collectionEnvName(name)}_DATA_SOURCE_ID.`,
    })
  }
  return config
}
