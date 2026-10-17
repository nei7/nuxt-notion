<script setup lang="ts">
import { computed, provide, useSlots } from 'vue'
import { useRuntimeConfig } from '#app'
import type { NotionBlock } from '../types/collections'
import type { NotionDarkMode } from '../types/module'
import { extractHeadings } from '../utils/headings'
import { notionRendererKey, type NotionLinkResolver } from '../utils/renderer-context'
import Blocks from './Blocks.vue'

const props = withDefaults(defineProps<{
  blocks: NotionBlock[]
  /** Added to every heading level (use `1` when the page title is already an `<h1>`). */
  headingOffset?: number
  /** Overrides the module's `darkMode` option for this renderer. */
  darkMode?: NotionDarkMode
  /** Turns Notion page/database references into links on your site. */
  linkResolver?: NotionLinkResolver
}>(), {
  headingOffset: 0,
  darkMode: undefined,
  linkResolver: undefined,
})

defineSlots<{
  /** Rendered for block types the module does not support. */
  fallback?: (props: { block: NotionBlock }) => unknown
  after?: () => unknown
}>()

const slots = useSlots()

const headings = computed(() => extractHeadings(props.blocks))
const headingIds = computed(() => new Map(headings.value.map(h => [h.blockId, h.id])))

const publicConfig = useRuntimeConfig().public.nuxtNotion as { darkMode?: NotionDarkMode } | undefined
const darkMode = computed(() => props.darkMode ?? publicConfig?.darkMode ?? 'class')

provide(notionRendererKey, {
  get headingIds() {
    return headingIds.value
  },
  get headings() {
    return headings.value
  },
  get headingOffset() {
    return props.headingOffset
  },
  get linkResolver() {
    return props.linkResolver
  },
  renderFallback: block => slots.fallback?.({ block }),
})
</script>

<template>
  <div
    class="notion-renderer"
    :data-dark-mode="darkMode"
  >
    <Blocks :blocks="blocks" />
    <slot name="after" />
  </div>
</template>
