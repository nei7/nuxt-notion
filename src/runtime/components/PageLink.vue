<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'
import type { NotionBlockOf } from '../types/notion'
import { isExternalHref, notionPageUrl, useNotionRenderer } from '../utils/renderer-context'

const props = defineProps<{
  block: NotionBlockOf<'child_page' | 'child_database' | 'link_to_page'>
}>()

const context = useNotionRenderer()

const target = computed(() => {
  const block = props.block
  if (block.type === 'child_page') return { id: block.id, type: 'page' as const, title: block.child_page.title }
  if (block.type === 'child_database') return { id: block.id, type: 'database' as const, title: block.child_database.title }
  if (block.link_to_page.type === 'page_id') return { id: block.link_to_page.page_id, type: 'page' as const, title: '' }
  if (block.link_to_page.type === 'database_id') return { id: block.link_to_page.database_id, type: 'database' as const, title: '' }
  return null
})

const resolved = computed(() => (target.value ? context.linkResolver?.(target.value.id, target.value.type) : null))
const href = computed(() => resolved.value?.href ?? (target.value ? notionPageUrl(target.value.id) : null))
const title = computed(() => resolved.value?.title || target.value?.title || (target.value?.type === 'database' ? 'Linked database' : 'Linked page'))
const external = computed(() => !!href.value && isExternalHref(href.value))
</script>

<template>
  <p
    v-if="href"
    class="notion-page-link"
  >
    <NuxtLink
      :href="href"
      :target="external ? '_blank' : undefined"
    >
      {{ title }}
    </NuxtLink>
  </p>
</template>
