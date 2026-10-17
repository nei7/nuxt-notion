<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { notionFileUrl } from '../utils/files'
import TextRenderer from './TextRenderer.vue'

const props = defineProps<{
  block: NotionBlockOf<'image'>
}>()

const url = computed(() => notionFileUrl(props.block, props.block.image))
const caption = computed(() => props.block.image.caption)
const alt = computed(() => caption.value.map(t => t.plain_text).join(''))
</script>

<template>
  <figure
    v-if="url"
    class="notion-image"
  >
    <img
      :src="url"
      :alt="alt"
      loading="lazy"
      decoding="async"
    >
    <figcaption v-if="caption.length > 0">
      <TextRenderer :text="caption" />
    </figcaption>
  </figure>
</template>
