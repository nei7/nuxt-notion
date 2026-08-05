# @nei7/nuxt-notion

[![npm version][npm-version-src]][npm-version-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for building a blog on top of the Notion API. It provides Vue components for rendering Notion blocks, composables for fetching pages, blocks and database entries, and server API routes that keep your Notion token on the server.

## Features

- 🧱 **Block renderer** — `<NotionRenderer>` renders a list of Notion blocks: headings, paragraphs, lists (bulleted, numbered, to-do), images, videos, code, callouts, quotes, dividers, files, embeds (YouTube, Spotify), bookmarks and equations
- 🔎 **Composables** — `useNotionBlocks`, `useNotionPage` and `useNotionDatabase` built on `useAsyncData`, with `.withTransform()` and `.withCachedData()` helpers
- 🔐 **Server-side API proxy** — Notion requests go through Nitro routes (`/api/_notion/*`), so your integration token never reaches the client
- 🔗 **Link previews** — bookmark blocks are enriched with title, description, image and favicon scraped server-side (and cached)
- 🎨 **Notion colors & annotations** — bold, italic, underline, strikethrough, inline code, text and background colors with dark-mode support
- 🧮 **Math** — inline and block equations rendered with KaTeX
- 🌈 **Syntax highlighting** — code blocks rendered with [nuxt-shiki](https://github.com/pi0/nuxt-shiki)
- 🛠 **Property parsing utils** — `parseProperties` / `parseProperty` flatten Notion page properties into plain values

## Installation

This package is published to the [GitHub Packages registry](https://github.com/nei7/nuxt-notion/pkgs/npm/nuxt-notion). Point the `@nei7` scope at it in your project's `.npmrc`:

```ini
@nei7:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

GitHub Packages requires authentication even for public packages — set `GITHUB_TOKEN` to a [personal access token](https://github.com/settings/tokens) with the `read:packages` scope. Then install as usual:

```bash
pnpm add @nei7/nuxt-notion
```

## Setup

Add the module to your `nuxt.config.ts` and provide a [Notion integration token](https://developers.notion.com/docs/create-a-notion-integration):

```ts
export default defineNuxtConfig({
  modules: ['@nei7/nuxt-notion'],

  nuxtNotion: {
    apiKey: process.env.NOTION_API_KEY,
    // optional: lock the query proxy to a single data source
    dataSourceId: process.env.NOTION_DATA_SOURCE_ID,
  },

  // optional: configure syntax highlighting
  shiki: {
    defaultTheme: 'material-theme',
    bundledLangs: ['js', 'typescript', 'bash'],
  },
})
```

Both options can also be provided via environment variables instead of config keys: `NUXT_NUXT_NOTION_API_KEY` and `NUXT_NUXT_NOTION_DATA_SOURCE_ID` (Nuxt runtime-config overrides).

When `dataSourceId` is set, `/api/_notion/query-database` uses it as the default and rejects requests for any other data source with a 403 — recommended for public deployments, since the proxy routes are unauthenticated.

> `nuxt-shiki` is installed automatically as a module dependency.

## Usage

### Rendering a page

```vue
<script setup lang="ts">
const { data } = await useNotionBlocks({ block_id: '<page-id>' })
</script>

<template>
  <NotionRenderer
    v-if="data"
    :blocks="data.results"
  />
</template>
```

### Querying a database

```ts
const { data: posts } = await useNotionDatabase({
  data_source_id: '<data-source-id>',
  sorts: [{ property: 'Date', direction: 'descending' }],
  page_size: 10,
})
```

### Fetching page metadata

```ts
const { data: page } = await useNotionPage({ page_id: '<page-id>' })
```

### Transforming and caching results

Every composable supports two chainable modifiers:

```ts
import { parseProperties } from '@nei7/nuxt-notion/utils'

// transform the response before it reaches your component
const useBlogPosts = useNotionDatabase.withTransform(data =>
  data.results.map(page => ({
    id: page.id,
    ...parseProperties(page.properties),
  })),
)

// reuse the payload from SSR instead of refetching on the client
const useCachedBlogPosts = useBlogPosts.withCachedData()

const { data: posts } = await useCachedBlogPosts({ data_source_id: '<id>' })
```

### Parsing page properties

`parseProperties` flattens Notion's verbose property objects into plain values (strings, numbers, booleans, string arrays, dates):

```ts
import { parseProperties } from '@nei7/nuxt-notion/utils'

const props = parseProperties(page.properties)
// { Name: 'Hello world', Tags: ['nuxt', 'notion'], Published: true, ... }
```

## Server routes

The module registers the following Nitro routes:

| Route | Method | Description |
| --- | --- | --- |
| `/api/_notion/blocks` | GET | List child blocks of a block/page |
| `/api/_notion/page` | GET | Retrieve a page |
| `/api/_notion/query-database` | POST | Query a database data source |
| `/api/_notion/link-meta` | GET | Scrape link metadata for bookmark previews (cached) |

## Components

All components are auto-registered with the `Notion` prefix. `<NotionRenderer>` is the entry point; the rest are used internally but can also be used standalone (e.g. `<NotionParagraph>`, `<NotionCallout>`, `<NotionCode>`).

The renderer ships only minimal structural CSS — typography is up to you (it pairs well with [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)'s `prose` classes). Notion text/background colors are exposed as CSS variables with automatic dark-mode values that you can override.

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm dev:prepare

# Develop with the playground (requires API_TOKEN env var)
pnpm dev

# Run ESLint
pnpm lint

# Run Vitest
pnpm test

# Type check
pnpm test:types
```

## Releasing

Releases are driven by [changelogen](https://github.com/unjs/changelogen) and conventional commits (`feat:`, `fix:`, ...):

```bash
pnpm release
```

This runs lint and tests, bumps the version based on commit history, updates `CHANGELOG.md`, commits, tags and pushes. Pushing the tag triggers the [release workflow](.github/workflows/release.yml), which publishes the package to npm and creates a GitHub release with generated notes.

## License

[MIT](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nei7/nuxt-notion/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@nei7/nuxt-notion

[license-src]: https://img.shields.io/npm/l/@nei7/nuxt-notion.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@nei7/nuxt-notion

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
