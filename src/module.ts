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
   * NUXT_NUXT_NOTION_NOTION_API_KEY environment variable.
   */
  notionApiKey?: string
}

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    nuxtNotion: {
      notionApiKey: string
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-notion',
    configKey: 'nuxtNotion',
  },
  defaults: {
    notionApiKey: '',
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
      { notionApiKey: options.notionApiKey },
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
