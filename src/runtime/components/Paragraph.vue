<script setup lang="ts">
import type { ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import TextRenderer from './TextRenderer.vue'

defineProps<{
  block: ParagraphBlockObjectResponse
}>()
</script>

<template>
  <p
    v-if="block.paragraph.rich_text.length > 0"
    class="my-3 leading-loose"
  >
    <TextRenderer :text="block.paragraph.rich_text" />
  </p>
  <div
    v-else
    class="my-5 h-px"
  />
</template>
