<script setup lang="ts">
import type { NotionBlockOf } from '../types/notion'
import TextRenderer from './TextRenderer.vue'
import Blocks from './Blocks.vue'

defineProps<{
  block: NotionBlockOf<'paragraph'>
}>()
</script>

<template>
  <p v-if="block.paragraph.rich_text.length > 0">
    <TextRenderer :text="block.paragraph.rich_text" />
  </p>
  <p
    v-else
    class="notion-empty"
  />
  <div
    v-if="block.children?.length"
    class="notion-indent"
  >
    <Blocks :blocks="block.children" />
  </div>
</template>
