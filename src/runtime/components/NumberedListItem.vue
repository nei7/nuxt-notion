<script setup lang="ts">
import type { NotionBlockOf } from '../types/notion'
import TextRenderer from './TextRenderer.vue'
import Blocks from './Blocks.vue'

defineProps<{
  block: NotionBlockOf<'numbered_list_item'>
}>()
</script>

<template>
  <li>
    <TextRenderer :text="block.numbered_list_item.rich_text" />
    <Blocks
      v-if="block.children?.length"
      :blocks="block.children"
    />
  </li>
</template>
