<script setup lang="ts">
import type { ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import TextRenderer from './TextRenderer.vue'

defineProps<{
  paragraph: ParagraphBlockObjectResponse
}>()
</script>

<template>
  <p
    v-if="paragraph.paragraph.rich_text.length > 0"
    class="my-3 leading-loose text-muted-foreground"
  >
    <TextRenderer :text="paragraph.paragraph.rich_text" />
  </p>
  <div
    v-else
    class="my-5 h-px"
  />
</template>
