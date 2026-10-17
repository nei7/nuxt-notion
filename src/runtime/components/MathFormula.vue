<script setup lang="ts">
import katex from 'katex'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  displayMode?: boolean
  expression: string
}>(), {
  displayMode: false,
})

const html = computed(() => {
  try {
    return katex.renderToString(props.expression, {
      displayMode: props.displayMode,
      throwOnError: false,
    })
  }
  catch {
    return props.expression
  }
})
</script>

<template>
  <div
    v-if="displayMode"
    class="notion-equation notion-equation-block"
    v-html="html"
  />
  <span
    v-else
    class="notion-equation"
    v-html="html"
  />
</template>
