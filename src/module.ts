import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponentsDir,
} from '@nuxt/kit'

export interface ModuleOptions {
  notionApiKey: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-notion',
    configKey: 'myModule',
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/plugin'))
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'Notion',
      global: true,
    })
  },
})
