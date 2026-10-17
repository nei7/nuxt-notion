<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { notionFileUrl } from '../utils/files'
import TextRenderer from './TextRenderer.vue'

const props = defineProps<{
  block: NotionBlockOf<'audio'>
}>()

const url = computed(() => notionFileUrl(props.block, props.block.audio))
</script>

<template>
  <figure
    v-if="url"
    class="notion-audio"
  >
    <audio
      controls
      preload="none"
      :src="url"
    />
    <figcaption v-if="block.audio.caption.length">
      <TextRenderer :text="block.audio.caption" />
    </figcaption>
  </figure>
</template>
