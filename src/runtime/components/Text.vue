<script setup lang="ts">
import type { RichTextItemResponse } from '@notionhq/client'
import { notionAnnotationsToCss } from '../utils'
import MathFormula from './MathFormula.vue'

defineProps<{
  text: RichTextItemResponse
}>()
</script>

<template>
  <MathFormula
    v-if="text.type === 'equation'"
    :expression="text.equation.expression"
  />
  <a
    v-else-if="text.href"
    :href="text.href"
    :class="notionAnnotationsToCss(text.annotations)"
  >
    <code v-if="text.annotations.code">{{ text.plain_text }}</code>
    <template v-else>{{ text.plain_text }}</template>
  </a>
  <component
    :is="text.annotations.code ? 'code' : 'span'"
    v-else
    :class="notionAnnotationsToCss(text.annotations)"
  >
    {{ text.plain_text }}
  </component>
</template>
