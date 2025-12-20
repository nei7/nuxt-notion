<script setup lang="ts">
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import TextRenderer from './TextRenderer.vue'

defineProps<{
  block: BlockObjectResponse
}>()
</script>

<template>
  <h1
    v-if="block.type === 'heading_1'"
    class="text-3xl font-bold mt-7 mb-3"
  >
    <TextRenderer :text="block.heading_1.rich_text" />
  </h1>
  <h2
    v-else-if="block.type === 'heading_2'"
    class="text-2xl font-bold mt-7 mb-3"
  >
    <TextRenderer :text="block.heading_2.rich_text" />
  </h2>
  <h1
    v-else-if="block.type === 'heading_3'"
    class="text-xl font-bold mt-7 mb-3"
  >
    <TextRenderer :text="block.heading_3.rich_text" />
  </h1>
</template>
