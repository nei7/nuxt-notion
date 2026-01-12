<script setup lang="ts">
import type { QuoteBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import TextRenderer from './TextRenderer.vue'
import { notionColorToCss } from '../utils'

const { block } = defineProps<{
  block: QuoteBlockObjectResponse
}>()

const color = notionColorToCss(block.quote.color)
</script>

<template>
  <blockquote :class="color">
    <TextRenderer :text="block.quote.rich_text" />
  </blockquote>
</template>
