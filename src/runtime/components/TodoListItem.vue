<script setup lang="ts">
import type { ToDoBlockObjectResponse } from '@notionhq/client'
import TextRenderer from './TextRenderer.vue'

defineProps<{
  block: ToDoBlockObjectResponse
}>()
</script>

<template>
  <div class="flex items-center space-x-3 mb-3 ">
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
      <TextRenderer :text="block.to_do.rich_text" />
    </div>
  </div>
</template>
