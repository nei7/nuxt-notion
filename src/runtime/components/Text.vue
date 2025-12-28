<script setup lang="ts">
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { notionAnnotationsToCss } from '../utils'
import MathFormula from './MathFormula.vue'

defineProps<{
  text: RichTextItemResponse
}>()
</script>

<template>
  <span
    v-if="text.type === 'text'"
    :class="notionAnnotationsToCss(text.annotations)"
  >
    {{ text.plain_text }}
  </span>
  <MathFormula
    v-else-if="text.type === 'equation'"
    :expression="text.equation.expression"
  />
</template>
