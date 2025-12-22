import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImportsDir,
  addVitePlugin,
  addServerHandler,
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
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.nuxtNotion = {
      notionApiKey: _options.notionApiKey,
    }

    addVitePlugin(tailwindcss())
    nuxt.options.css.push(resolver.resolve('./runtime/tailwind.css'))

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'Notion',
      global: true,
    })

    addImportsDir(resolver.resolve('./runtime/composables'))

    addServerHandler({
      handler: resolver.resolve('./runtime/server/api/blocks.get'),
      route: '/api/_notion/blocks',
      method: 'get',
    })
  },
})
