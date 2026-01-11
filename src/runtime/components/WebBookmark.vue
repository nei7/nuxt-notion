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
    :href="linkMetadata?.url"
    target="_blank"
    class="group my-8 flex h-32 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50"
  >

    <div class="flex flex-1 flex-col justify-center p-4">
      <h3 class="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 dark:text-slate-100">
        {{ linkMetadata?.title }}
      </h3>
      <p
        v-if="linkMetadata?.success"
        class="mt-1 text-sm text-slate-500 line-clamp-2 dark:text-slate-400"
      >
        {{ linkMetadata.description }}
      </p>
      <div class="mt-auto flex items-center gap-1 text-xs text-slate-400">
        <svg
          class="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <span>{{ linkMetadata?.url }}</span>
      </div>
    </div>

    <div
      v-if="linkMetadata?.success && linkMetadata.image"
      class="hidden w-48 shrink-0 sm:block"
    >
      <img
        :src="linkMetadata.image"
        alt="Preview image"
        class="h-full w-full object-cover transition group-hover:scale-105"
      >
    </div>
  </a>
</template>
