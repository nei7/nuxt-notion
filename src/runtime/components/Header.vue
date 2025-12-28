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
    class="text-3xl font-bold mb-8 text-slate-900 text-balance"
  >
    <TextRenderer :text="block.heading_1.rich_text" />
  </h1>
  <h2
    v-else-if="block.type === 'heading_2'"
    class="text-2xl font-bold mb-4 mt-10 text-slate-800 text-balance"
  >
    <TextRenderer :text="block.heading_2.rich_text" />
  </h2>
  <h3
    v-else-if="block.type === 'heading_3'"
    class="text-xl font-bold mb-2 mt-6 text-slate-800 text-balance"
  >
    <TextRenderer :text="block.heading_3.rich_text" />
  </h3>
</template>
