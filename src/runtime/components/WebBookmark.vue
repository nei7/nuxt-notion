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
  <div>
    {{ linkMetadata }}
  </div>
</template>
