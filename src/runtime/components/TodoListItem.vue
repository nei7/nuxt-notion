<script setup lang="ts">
import type { ToDoBlockObjectResponse } from '@notionhq/client'
import TextRenderer from './TextRenderer.vue'

defineProps<{
  block: ToDoBlockObjectResponse
}>()
</script>

<template>
  <div class="todo-list">
    <input
      type="checkbox"
      :value="block.to_do.checked"
      disabled
    >
    <div
      :style="{
        'text-decoration': block.to_do.checked ? 'line-through' : undefined,
      }"
    >
      <TextRenderer :text="block.to_do.rich_text" />
    </div>
  </div>
</template>
