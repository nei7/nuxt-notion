<script setup lang="ts">
import type { BookmarkBlockObjectResponse } from '@notionhq/client'
import { useLazyFetch } from '#app'
import type { LinkMetadataResponse } from '../types'
import TextRenderer from './TextRenderer.vue'

const props = defineProps<{
  block: BookmarkBlockObjectResponse
}>()

const { data: linkMetadata } = useLazyFetch<LinkMetadataResponse>('/api/_notion/link-meta', {
  query: { url: props.block.bookmark.url },
  server: false,
})
</script>

<template>
  <div class="notion-bookmark">
    <a
      :href="block.bookmark.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="notion-bookmark-content">
        <div class="notion-bookmark-title">
          {{ linkMetadata?.title || block.bookmark.url }}
        </div>
        <div
          v-if="linkMetadata?.success && linkMetadata.description"
          class="notion-bookmark-description"
        >
          {{ linkMetadata.description }}
        </div>
        <div class="notion-bookmark-url">
          <img
            v-if="linkMetadata?.success && linkMetadata.icon"
            :src="linkMetadata.icon"
            alt=""
            loading="lazy"
          >
          <span>{{ block.bookmark.url }}</span>
        </div>
      </div>
      <div
        v-if="linkMetadata?.success && linkMetadata.image"
        class="notion-bookmark-image"
      >
        <img
          :src="linkMetadata.image"
          alt=""
          loading="lazy"
        >
      </div>
    </a>
    <div v-if="block.bookmark.caption.length > 0">
      <TextRenderer :text="block.bookmark.caption" />
    </div>
  </div>
</template>

<style>
.notion-bookmark > a {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 0.375rem;
  text-decoration: none;
}

.notion-bookmark-content {
  min-width: 0;
  padding: 0.75rem 1rem;
}

.notion-bookmark-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.notion-bookmark-description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 0.875em;
  opacity: 0.7;
}

.notion-bookmark-url {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75em;
  opacity: 0.7;
}

.notion-bookmark-url img {
  width: 1em;
  height: 1em;
  margin: 0;
}

.notion-bookmark-url span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.notion-bookmark-image {
  flex-shrink: 0;
  max-width: 30%;
}

.notion-bookmark-image img {
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
}
</style>
