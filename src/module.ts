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
  shiki?: {
    themes?: string[]
    langs?: string[]
    theme?: {
      light: string
      dark: string
    }
  }
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

    nuxt.options.css.push(
      resolver.resolve('./runtime/tailwind.css'),
      resolver.resolve('./runtime/main.css'),
    )

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
