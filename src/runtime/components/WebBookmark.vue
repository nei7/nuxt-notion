<script setup lang="ts">
import { computed } from 'vue'
import { useLazyFetch } from '#app'
import type { NotionBlockOf } from '../types/notion'
import type { LinkMetadataResponse } from '../types'
import TextRenderer from './TextRenderer.vue'

const props = defineProps<{
  block: NotionBlockOf<'bookmark' | 'link_preview'>
}>()

const url = computed(() => (props.block.type === 'bookmark' ? props.block.bookmark.url : props.block.link_preview.url))
const caption = computed(() => (props.block.type === 'bookmark' ? props.block.bookmark.caption : []))

const { data: linkMetadata } = useLazyFetch<LinkMetadataResponse>('/api/_notion/link-meta', {
  query: { url: url.value },
  server: false,
})
</script>

<template>
  <figure class="notion-bookmark">
    <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="notion-bookmark-content">
        <div class="notion-bookmark-title">
          {{ linkMetadata?.title || url }}
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
          <span>{{ url }}</span>
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
    <figcaption v-if="caption.length > 0">
      <TextRenderer :text="caption" />
    </figcaption>
  </figure>
</template>
