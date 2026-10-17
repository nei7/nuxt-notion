import { inject, type InjectionKey, type VNode } from 'vue'
import type { NotionBlock, NotionHeading } from '../types/collections'

export interface NotionLinkTarget {
  href: string
  title?: string
}

/** Maps a Notion page/database id to a link on your site. Return `null` to fall back to notion.so. */
export type NotionLinkResolver = (id: string, type: 'page' | 'database') => NotionLinkTarget | null | undefined

export interface NotionRendererContext {
  /** block id → anchor id, shared with `extractHeadings` so TOC links match. */
  headingIds: Map<string, string>
  headings: NotionHeading[]
  headingOffset: number
  linkResolver?: NotionLinkResolver
  renderFallback?: (block: NotionBlock) => VNode[] | undefined
}

export const notionRendererKey: InjectionKey<NotionRendererContext> = Symbol('nuxt-notion:renderer')

const EMPTY_CONTEXT: NotionRendererContext = {
  headingIds: new Map(),
  headings: [],
  headingOffset: 0,
}

export const useNotionRenderer = () => inject(notionRendererKey, EMPTY_CONTEXT)

export const notionPageUrl = (id: string) => `https://www.notion.so/${id.replace(/-/g, '')}`

export const isExternalHref = (href: string) => /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href) || /^mailto:|^tel:/i.test(href)
