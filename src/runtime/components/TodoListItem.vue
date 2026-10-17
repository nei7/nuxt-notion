<script setup lang="ts">
import type { NotionBlockOf } from '../types/notion'
import TextRenderer from './TextRenderer.vue'
import Blocks from './Blocks.vue'

defineProps<{
  block: NotionBlockOf<'to_do'>
}>()
</script>

<template>
  <li
    class="notion-todo"
    :class="{ 'notion-todo-done': block.to_do.checked }"
  >
    <input
      type="checkbox"
      :checked="block.to_do.checked"
      disabled
      aria-hidden="true"
    >
    <div class="notion-todo-content">
      <TextRenderer :text="block.to_do.rich_text" />
      <Blocks
        v-if="block.children?.length"
        :blocks="block.children"
      />
    </div>
  </li>
</template>
