import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerScanDir,
  addServerImports,
  addServerHandler,
  addImports,
  useLogger,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions, NuxtNotionPublicRuntimeConfig, NuxtNotionRuntimeConfig } from './runtime/types/module'
import { resolveCollectionConfig } from './runtime/utils/mapping'

export type { ModuleOptions } from './runtime/types/module'

const COLLECTION_NAME = /^[a-z0-9_-]{1,40}$/

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-notion',
    configKey: 'nuxtNotion',
  },
  defaults: {
    apiKey: '',
    webhookSecret: '',
    collections: {},
    cache: { maxAge: 3600, swr: true },
    exposeRawApi: false,
    darkMode: 'class',
    katexCss: true,
    highlightCode: true,
    readingTime: { wordsPerMinute: 200 },
    linkMeta: { enabled: true, allowedHosts: [] },
  },
  moduleDependencies: {
    'nuxt-shiki': {
      version: '^0.3.2',
    },
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const logger = useLogger('nuxt-notion')

    const collections: NuxtNotionRuntimeConfig['collections'] = {}
    for (const [name, config] of Object.entries(options.collections ?? {})) {
      if (!COLLECTION_NAME.test(name)) {
        logger.warn(`Collection name "${name}" is ignored: use lowercase letters, digits, "-" or "_".`)
        continue
      }
      collections[name] = resolveCollectionConfig(config)
    }
    if (Object.keys(collections).length === 0) {
      logger.warn('No collections configured (`nuxtNotion.collections`), collection routes will return 404.')
    }

    const cache = options.cache === false
      ? { maxAge: 0, swr: false }
      : { maxAge: options.cache?.maxAge ?? 3600, swr: options.cache?.swr ?? true }

    const runtime: NuxtNotionRuntimeConfig = {
      apiKey: options.apiKey ?? '',
      webhookSecret: options.webhookSecret ?? '',
      cache,
      highlightCode: options.highlightCode ?? true,
      readingTime: { wordsPerMinute: options.readingTime?.wordsPerMinute ?? 200 },
      linkMeta: { enabled: options.linkMeta?.enabled ?? true, allowedHosts: options.linkMeta?.allowedHosts ?? [] },
      collections,
    }
    const publicRuntime: NuxtNotionPublicRuntimeConfig = { darkMode: options.darkMode ?? 'class' }

    nuxt.options.runtimeConfig.nuxtNotion = defu(
      nuxt.options.runtimeConfig.nuxtNotion as Partial<NuxtNotionRuntimeConfig> | undefined,
      runtime,
    )
    nuxt.options.runtimeConfig.public.nuxtNotion = defu(
      nuxt.options.runtimeConfig.public.nuxtNotion as Partial<NuxtNotionPublicRuntimeConfig> | undefined,
      publicRuntime,
    )

    nuxt.options.build.transpile.push('@notionhq/client')

    // Shiki is reached through nuxt-shiki's inlined runtime; bundle it into the
    // server too, otherwise node-server builds trace an incomplete copy of it.
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.externals ||= {}
      nitroConfig.externals.inline ||= []
      nitroConfig.externals.inline.push('shiki', '@shikijs/')
    })

    nuxt.options.css.push(resolver.resolve('./runtime/assets/notion.css'))
    if (options.katexCss) {
      nuxt.options.css.push(await resolver.resolvePath('katex/dist/katex.min.css'))
    }

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'Notion',
    })

    addImports([
      { name: 'useNotionCollection', from: resolver.resolve('./runtime/composables/client/collections') },
      { name: 'useNotionCollectionItem', from: resolver.resolve('./runtime/composables/client/collections') },
    ])

    addServerImports([
      { name: 'useNotionClient', from: resolver.resolve('./runtime/server/lib/client') },
      { name: 'useNotionConfig', from: resolver.resolve('./runtime/server/lib/config') },
      { name: 'getCollectionConfig', from: resolver.resolve('./runtime/server/lib/config') },
      { name: 'getCollectionItems', from: resolver.resolve('./runtime/server/lib/collections') },
      { name: 'getCollectionItem', from: resolver.resolve('./runtime/server/lib/collections') },
      { name: 'getCollectionTags', from: resolver.resolve('./runtime/server/lib/collections') },
      { name: 'invalidateNotionCache', from: resolver.resolve('./runtime/server/lib/collections') },
    ])

    addServerScanDir(resolver.resolve('./runtime/server'))

    if (options.exposeRawApi) {
      addServerHandler({ route: '/api/_notion/blocks', method: 'get', handler: resolver.resolve('./runtime/server/raw/blocks.get') })
      addServerHandler({ route: '/api/_notion/page', method: 'get', handler: resolver.resolve('./runtime/server/raw/page.get') })
      addServerHandler({ route: '/api/_notion/query-database', method: 'post', handler: resolver.resolve('./runtime/server/raw/query-database.post') })
      addImports(['useNotionDatabase', 'useNotionPage', 'useNotionBlocks'].map(name => ({
        name,
        from: resolver.resolve('./runtime/composables/client/raw'),
      })))
    }
  },
})
