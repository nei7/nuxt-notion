<script setup lang="ts">
import type { BlockObjectResponse } from '@notionhq/client'
import TextRenderer from './TextRenderer.vue'

defineProps<{
  block: BlockObjectResponse
}>()
</script>

<template>
  <h1
    v-if="block.type === 'heading_1'"
  >
    <TextRenderer :text="block.heading_1.rich_text" />
  </h1>
  <h2
    v-else-if="block.type === 'heading_2'"
  >
    <TextRenderer :text="block.heading_2.rich_text" />
  </h2>
  <h3
    v-else-if="block.type === 'heading_3'"
  >
    <TextRenderer :text="block.heading_3.rich_text" />
  </h3>
</template>
