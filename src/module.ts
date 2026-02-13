import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerScanDir,
  addServerImportsDir,
  addImportsDir,

} from '@nuxt/kit'

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
