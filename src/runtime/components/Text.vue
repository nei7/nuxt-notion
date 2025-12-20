<script setup lang="ts">
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { notionAnnotationsToCss } from '../utils'

defineProps<{
  text: RichTextItemResponse
}>()
</script>

<template>
  <span
    :class="notionAnnotationsToCss(text.annotations)"
  >
    {{ text.plain_text }}
  </span>
</template>
