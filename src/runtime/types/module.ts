import type { CollectionConfig, ResolvedCollectionConfig } from './collections'

export type NotionDarkMode = 'class' | 'media' | 'both'

export interface ModuleOptions {
  /**
   * Notion integration token. Can also be set via the
   * `NUXT_NUXT_NOTION_API_KEY` environment variable.
   */
  apiKey?: string
  /**
   * Verification token of the Notion webhook subscription, used to check the
   * `X-Notion-Signature` header. Can also be set via `NUXT_NUXT_NOTION_WEBHOOK_SECRET`.
   */
  webhookSecret?: string
  /**
   * Named Notion data sources exposed as collections. Keys should be lowercase
   * (`posts`, `projects`); each data source id can be overridden at runtime with
   * `NUXT_NUXT_NOTION_COLLECTIONS_<NAME>_DATA_SOURCE_ID`.
   */
  collections?: Record<string, CollectionConfig>
  /**
   * Server-side cache for Notion calls (Nitro cache storage). `false` disables it.
   * Defaults to `{ maxAge: 3600, swr: true }`; webhooks invalidate entries early.
   */
  cache?: { maxAge?: number, swr?: boolean } | false
  /**
   * Mount the raw proxy routes (`/api/_notion/{blocks,page,query-database}`) and the
   * matching `useNotionBlocks`/`useNotionPage`/`useNotionDatabase` composables.
   * Defaults to `false`.
   */
  exposeRawApi?: boolean
  /** How `<NotionRenderer>` picks dark colours. Defaults to `class` (a `.dark` ancestor). */
  darkMode?: NotionDarkMode
  /** Include KaTeX's stylesheet. Defaults to `true`. */
  katexCss?: boolean
  /** Pre-render code blocks with Shiki on the server when content is cached. Defaults to `true`. */
  highlightCode?: boolean
  readingTime?: { wordsPerMinute?: number }
  /** Bookmark previews fetched server-side. `allowedHosts` restricts which hosts may be scraped. */
  linkMeta?: { enabled?: boolean, allowedHosts?: string[] }
}

export interface NuxtNotionRuntimeConfig {
  apiKey: string
  webhookSecret: string
  cache: { maxAge: number, swr: boolean }
  highlightCode: boolean
  readingTime: { wordsPerMinute: number }
  linkMeta: { enabled: boolean, allowedHosts: string[] }
  collections: Record<string, ResolvedCollectionConfig>
}

export interface NuxtNotionPublicRuntimeConfig {
  darkMode: NotionDarkMode
}
