<script setup lang="ts">
// import TextRenderer from './TextRenderer.vue'
import type { NotionListBlock } from '../types/notion'
import { isNotionBlockType } from '../utils'

defineProps<{
  block: NotionListBlock
}>()
</script>

<template>
  <div class="mt-3 text-muted-foreground">
    <div
      v-if="isNotionBlockType(block, 'to_do')"
      class="flex items-center gap-x-2"
    >
      <input
        type="checkbox"
        :model-value="block.to_do.checked"
        disabled
      >
      <div
        :class="{
          'line-through': block.to_do.checked,
        }"
      >
        <!-- <TextRenderer :text="rich_text" /> -->
      </div>
    </div>

    <div
      v-else
      class="list-item list-inside"
      :class="{
        'list-decimal': block.type === 'numbered_list_item',
      }"
    >
      <!-- <TextRenderer :text="rich_text" /> -->
    </div>
  </div>
</template>
