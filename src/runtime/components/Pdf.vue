<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { notionFileUrl } from '../utils/files'
import TextRenderer from './TextRenderer.vue'

const props = defineProps<{
  block: NotionBlockOf<'pdf'>
}>()

const url = computed(() => notionFileUrl(props.block, props.block.pdf))
const caption = computed(() => props.block.pdf.caption)
</script>

<template>
  <figure
    v-if="url"
    class="notion-pdf"
  >
    <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ caption.length ? caption.map(t => t.plain_text).join('') : 'Open PDF' }}
    </a>
    <figcaption v-if="caption.length">
      <TextRenderer :text="caption" />
    </figcaption>
  </figure>
</template>
