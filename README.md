# @nei7/nuxt-notion

[![GitHub release][release-src]][release-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for publishing Notion databases as typed, cached **collections** (a blog, a projects list…) and rendering Notion pages with Vue components. Notion is only ever called from the server; results are cached in Nitro's cache storage and invalidated by Notion webhooks.

## Features

- 🗂 **Collections** — name your Notion data sources once (`posts`, `projects`), get a typed list and item endpoint for each, with a server-side "published" filter clients cannot override
- 🧭 **Property mapping with fallbacks** — `title`, `slug`, `date`, `description`, `tags`, `featured`, `order` resolve from configurable property names (`date` → `published` → `created_time`, `tags` → `category`, …)
- 🌳 **Full block trees** — children are fetched recursively (nested lists, toggles, columns, tables, callouts, synced blocks) with bounded concurrency
- 🧱 **Renderer** — `<NotionRenderer>` covers headings (with anchor ids), paragraphs, lists, to-dos, toggles, tables, columns, images, video, audio, PDF, files, code (pre-highlighted with Shiki), callouts, quotes, dividers, embeds, bookmarks, link previews, equations, page links, table of contents, plus a `fallback` slot
- ⚡ **Caching** — every Notion call goes through `defineCachedFunction` (KV on Cloudflare via NuxtHub, filesystem in dev); a webhook endpoint clears exactly what changed
- 🖼 **Stable file URLs** — Notion's signed S3 links expire after an hour; the module serves them through `/api/_notion/image/:id`, re-resolving fresh URLs on demand
- 📏 **Headings, reading time, prev/next** — computed once, cached with the content
- 🔐 **Hardened proxy** — the raw Notion routes are off by default; bookmark scraping refuses private hosts and caps response size
- 🧮 **KaTeX** equations, 🎨 Notion colours with class- or media-based dark mode

## Installation

The package is published to the [GitHub Packages registry](https://github.com/nei7/nuxt-notion/pkgs/npm/nuxt-notion). Point the `@nei7` scope at it in your project's `.npmrc`:

```ini
@nei7:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

GitHub Packages requires authentication even for public packages: set `GITHUB_TOKEN` to a [personal access token](https://github.com/settings/tokens) with the `read:packages` scope. Then:

```bash
pnpm add @nei7/nuxt-notion
```

> `nuxt-shiki` is installed automatically as a module dependency.

## Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nei7/nuxt-notion'],

  nuxtNotion: {
    collections: {
      posts: {
        // overridable with NUXT_NUXT_NOTION_COLLECTIONS_POSTS_DATA_SOURCE_ID
        dataSourceId: '',
        properties: {
          slug: ['slug', 'url'],
          date: ['date', 'published'],
          tags: ['tags', 'category'],
          published: { property: 'status', equals: 'Published' },
        },
      },
      projects: {
        dataSourceId: '',
        content: false, // list only, no block content
        properties: {
          title: 'name',
          tags: 'tech',
          published: { property: 'published', equals: true }, // checkbox
          order: 'order',
          featured: 'featured',
        },
      },
    },
  },

  shiki: {
    defaultTheme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    bundledLangs: ['javascript', 'typescript', 'json', 'yaml', 'shellscript'],
  },
})
```

Secrets are regular Nuxt runtime config, so set them through the environment (or `wrangler secret put` on Cloudflare):

| Variable | Purpose |
| --- | --- |
| `NUXT_NUXT_NOTION_API_KEY` | Notion integration token |
| `NUXT_NUXT_NOTION_COLLECTIONS_<NAME>_DATA_SOURCE_ID` | Data source id of each collection (`<NAME>` is the upper-cased collection key) |
| `NUXT_NUXT_NOTION_WEBHOOK_SECRET` | Verification token of the webhook subscription |

Each collection must be declared in `nuxt.config.ts` (even with an empty `dataSourceId`) for the environment override to apply.

### Options

| Option | Default | Description |
| --- | --- | --- |
| `apiKey` | `''` | Notion integration token |
| `webhookSecret` | `''` | Webhook verification token |
| `collections` | `{}` | Named data sources, see below |
| `cache` | `{ maxAge: 3600, swr: true }` | Nitro cache options for Notion calls; `false` disables caching |
| `exposeRawApi` | `false` | Mount `/api/_notion/{blocks,page,query-database}` and the raw composables |
| `darkMode` | `'class'` | `'class'` (a `.dark` ancestor), `'media'` (`prefers-color-scheme`) or `'both'` |
| `katexCss` | `true` | Include KaTeX's stylesheet |
| `highlightCode` | `true` | Pre-render code blocks with Shiki when content is cached |
| `readingTime.wordsPerMinute` | `200` | Reading-time estimate |
| `linkMeta` | `{ enabled: true, allowedHosts: [] }` | Bookmark previews; `allowedHosts` restricts which hosts may be scraped |

### Collection config

| Key | Default | Description |
| --- | --- | --- |
| `dataSourceId` | `''` | Notion data source id |
| `content` | `true` | Whether items have block content |
| `filter` | – | Extra Notion filter, AND-ed with the published filter |
| `sorts` | created time desc | Notion sorts; when set, the in-memory `order`/`date` sort is skipped |
| `properties.title` | first `title` property | |
| `properties.slug` | `['slug', 'url']` | Falls back to the page id. URL values are reduced to their last path segment |
| `properties.date` | `['date', 'published']` | Falls back to `created_time` |
| `properties.description` | `['description', 'summary']` | |
| `properties.tags` | `['tags', 'category']` | `multi_select` or `select` |
| `properties.featured` | `'featured'` | Checkbox |
| `properties.order` | `'order'` | Number, sorted ascending before `date` desc |
| `properties.published` | `{ property: 'status', equals: 'Published' }` | `type` is `status`, `select` or `checkbox` (inferred from a boolean `equals`); `false` disables the filter |

Array values mean "first non-empty wins", which lets a database evolve (add a `date` property later) without breaking older pages.

## Usage

### Listing a collection

```vue
<script setup lang="ts">
const { data } = await useNotionCollection('posts', { limit: 5 })
// data.items: NotionCollectionItem[], data.tags: { name, count }[], data.total
</script>
```

`useNotionCollection(name, query?, asyncDataOptions?)` accepts a reactive `query` with `tag`, `limit` and `featured`.

### Rendering an item

```vue
<script setup lang="ts">
const route = useRoute()
const { data } = await useNotionCollectionItem('posts', () => route.params.slug as string)
if (!data.value) throw createError({ statusCode: 404, fatal: true })
</script>

<template>
  <article class="prose">
    <h1>{{ data.item.title }}</h1>
    <p>{{ data.readingTime.minutes }} min read</p>
    <NotionRenderer :blocks="data.blocks" :heading-offset="1" />
  </article>
</template>
```

The response also carries `headings` (`{ id, text, level, blockId }`, ids match the rendered anchors), `prev` and `next`.

### `<NotionRenderer>`

| Prop | Description |
| --- | --- |
| `blocks` | `NotionBlock[]` |
| `headingOffset` | Added to every heading level (`1` when your page title is already an `<h1>`) |
| `darkMode` | Overrides the module option |
| `linkResolver` | `(id, type: 'page' \| 'database') => { href, title? } \| null` turns Notion page mentions and links into links on your site |

Slots: `fallback` (`{ block }`) for unsupported block types, `after`.

The renderer ships structural CSS only (colours, columns, toggles, bookmark cards, code wrappers). Typography is yours; it pairs well with [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography).

### Typed properties

Augment `NotionCollections` to type `item.properties` per collection:

```ts
// shared/types/notion.d.ts
declare module '@nei7/nuxt-notion/types' {
  interface NotionCollections {
    posts: Record<string, never>
    projects: { repo: string | null, demo: string | null, year: number | null }
  }
}
```

### Server utilities

Auto-imported in Nitro (always pass the event so per-request secrets apply):

```ts
// server/routes/rss.xml.ts
export default defineCachedEventHandler(async (event) => {
  const posts = await getCollectionItems(event, 'posts')
  // …
}, { group: 'notion-derived', name: 'rss', maxAge: 3600, swr: true })
```

| Function | Description |
| --- | --- |
| `getCollectionItems(event, name)` | Sorted published items |
| `getCollectionItem(event, name, slug)` | Item with blocks, headings, reading time, prev/next, or `null` |
| `getCollectionTags(items)` | Tag counts |
| `getCollectionConfig(event, name)` | Resolved collection config (throws 404/503) |
| `invalidateNotionCache({ collection?, pageId? })` | Drop cached data |
| `useNotionClient(event)` | A `@notionhq/client` instance |

Caches live under the `notion` group (`cache:notion:collection:<name>`, `cache:notion:item:<name>:<pageId>`, `cache:notion:file:*`). Put site-level caches derived from collections in the `notion-derived` group: it is cleared on every invalidation.

### Endpoints

| Route | Description |
| --- | --- |
| `GET /api/_notion/collections/:name?tag&limit&featured` | `{ items, tags, total }` |
| `GET /api/_notion/collections/:name/:slug` | `{ item, blocks, headings, readingTime, prev, next }` |
| `GET /api/_notion/image/:id?kind=block\|cover\|icon\|callout&v=` | Streams a Notion-hosted file (immutable cache headers when `v` is present) |
| `POST /api/_notion/webhook` | Notion webhook receiver |
| `GET /api/_notion/link-meta?url=` | Bookmark metadata (cached a day) |
| `GET /api/_notion/blocks`, `GET /api/_notion/page`, `POST /api/_notion/query-database` | Raw proxy, only with `exposeRawApi` (queries are limited to configured data sources and always include the published filter) |

### Webhooks

1. Deploy with `NUXT_NUXT_NOTION_API_KEY` set.
2. In the integration settings create a webhook subscription pointing at `https://<your-site>/api/_notion/webhook` with the `page.*` and `data_source.*` events you care about.
3. Notion sends an unsigned `{ "verification_token": "…" }`; the module logs it (`[nuxt-notion] Webhook verification token received: …`, visible with `wrangler tail` on Cloudflare). Paste it back into Notion to verify the subscription.
4. Store the same token as `NUXT_NUXT_NOTION_WEBHOOK_SECRET`. From then on every delivery is verified with HMAC-SHA256 over the raw body.

Page events clear the collection list and that page's content, data-source events clear the collection, anything unrecognised clears all Notion caches.

### Utilities

`@nei7/nuxt-notion/utils` exports `parseProperties`, `parseProperty`, `toCollectionItem`, `extractHeadings`, `slugifyHeading`, `computeReadingTime`, `notionLangToShiki`, `notionFileUrl` and `fetchBlockTree`. Types are available from `@nei7/nuxt-notion/types`.

## Migrating from 0.2

- `dataSourceId` is replaced by `collections`; `NUXT_NUXT_NOTION_DATA_SOURCE_ID` becomes `NUXT_NUXT_NOTION_COLLECTIONS_<NAME>_DATA_SOURCE_ID`.
- The raw routes and `useNotionDatabase` / `useNotionPage` / `useNotionBlocks` require `exposeRawApi: true`. The `.withTransform()` / `.withCachedData()` chainers are gone: use `useAsyncData`'s `transform` option; SSR payload reuse is now the default.
- `<NotionRenderer>` expects a block tree (`NotionBlock[]` with `children`); `useNotionCollectionItem` provides one. Its CSS moved out of the component into a module stylesheet, and dark colours follow a `.dark` class by default (`darkMode: 'media'` restores the old behaviour).

## Development

```bash
pnpm install
pnpm dev:prepare          # type stubs
cp playground/.env.example playground/.env   # fill in the token and data source id
pnpm dev                  # playground
pnpm lint
pnpm test                 # unit + e2e
pnpm test:types
```

## Releasing

Releases are driven by [changelogen](https://github.com/unjs/changelogen) and conventional commits (`feat:`, `fix:`, …):

```bash
pnpm release
```

This runs lint and tests, bumps the version based on commit history, updates `CHANGELOG.md`, commits, tags and pushes. Pushing the tag triggers the [release workflow](.github/workflows/release.yml), which publishes the package to GitHub Packages and creates a GitHub release with generated notes.

## License

[MIT](./LICENSE)

<!-- Badges -->
[release-src]: https://img.shields.io/github/v/release/nei7/nuxt-notion?style=flat&colorA=020420&colorB=00DC82
[release-href]: https://github.com/nei7/nuxt-notion/releases

[license-src]: https://img.shields.io/github/license/nei7/nuxt-notion?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/nei7/nuxt-notion/blob/master/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
