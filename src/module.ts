import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerScanDir,
  addServerImportsDir,
  addImportsDir,
} from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  /**
   * Notion integration token. Can also be set via the
   * NUXT_NUXT_NOTION_API_KEY environment variable.
   */
  apiKey?: string
  /**
   * Default Notion data source id. When set, `/api/_notion/query-database`
   * only accepts queries against this data source (other ids are rejected
   * with 403) and uses it when the request omits `data_source_id`.
   * Can also be set via the NUXT_NUXT_NOTION_DATA_SOURCE_ID environment variable.
   */
  dataSourceId?: string
}

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    nuxtNotion: {
      apiKey: string
      dataSourceId: string
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-notion',
    configKey: 'nuxtNotion',
  },
  defaults: {
    apiKey: '',
    dataSourceId: '',
  },
  moduleDependencies: {
    'nuxt-shiki': {
      version: '^0.3.2',
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.nuxtNotion = defu(
      nuxt.options.runtimeConfig.nuxtNotion,
      { apiKey: options.apiKey, dataSourceId: options.dataSourceId },
    )

    nuxt.options.build.transpile.push('@notionhq/client')

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'Notion',
      global: true,
    })

    addImportsDir(resolver.resolve('./runtime/composables/client'))

    addServerImportsDir(resolver.resolve('./runtime/composables/server'))

    addServerScanDir(resolver.resolve('./runtime/server'))
  },
})
