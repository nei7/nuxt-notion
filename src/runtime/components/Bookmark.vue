<script setup lang="ts">
import type { BookmarkBlockObjectResponse } from '@notionhq/client'
import { useLazyFetch } from '#app'
import type { LinkMetadataResponse } from '../types'

const props = defineProps<{
  block: BookmarkBlockObjectResponse
}>()

const { data: linkMetadata } = useLazyFetch<LinkMetadataResponse>('/api/_notion/link-meta', {
  query: { url: props.block.bookmark.url },
  server: false,
})
</script>

<template>
  <a
    :href="block.bookmark.url"
    target="_blank"
    class="not-prose my-3 hover:bg-gray-50 relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 pl-8 lg:grid-cols-2 lg:items-center border rounded-md border-gray-200"
  >
    <div
      class="flex flex-col flex-1 items-start p-4"
    >
      <div v-if="linkMetadata">
        <div class="text-base text-pretty font-semibold text-highlighted">
          {{ linkMetadata.title }}
        </div>

        <div
          v-if="linkMetadata.success"
          class="text-[15px] text-pretty text-muted mt-1"
        >
          {{ linkMetadata.description }}
        </div>
        <div class="flex items-center gap-x-2">
          <img
            v-if="linkMetadata.success"
            :src="linkMetadata.icon"
            class="w-5 h-5"
          >
          <div class="text-xs mt-2">
            {{ linkMetadata.url }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="linkMetadata?.success && linkMetadata.image"
      class="relative min-h-48"
    >
      <img
        class=" absolute inset-0 w-full h-full object-cover"
        :src="linkMetadata.image"
      >
    </div>
  </a>
</template>
