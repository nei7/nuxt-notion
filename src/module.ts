import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImportsDir,
  addVitePlugin,
  addServerScanDir,
} from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'

export interface ModuleOptions {
  notionApiKey: string

}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-notion',
    configKey: 'nuxtNotion',
  },
  defaults: {},
  moduleDependencies: {
    'nuxt-shiki': {
      version: '^0.3.2',
    },
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.nuxtNotion = {
      notionApiKey: _options.notionApiKey,

    }

    addVitePlugin(tailwindcss())

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'Notion',
      global: true,
    })

    addImportsDir(resolver.resolve('./runtime/composables'))

    addServerScanDir(resolver.resolve('./runtime/server'))
  },
})
