<script setup lang="ts">
import { computed } from 'vue'
import type { CodeBlockObjectResponse } from '@notionhq/client'

const props = defineProps<{ block: CodeBlockObjectResponse }>()

// Notion splits long code into multiple 2000-char rich_text segments
const code = computed(() => props.block.code.rich_text.map(t => t.plain_text).join(''))
</script>

<template>
  <Shiki
    class="not-prose"
    :lang="
      block.code.language as any
    "
    :code="code"
    unwrap
  />
</template>

<style>
code.shiki {
  display: block;
  width: 100%;
  padding: 1rem;
  overflow: auto;
}

pre:has(code.shiki) {
  margin: 0;
  padding: 0;
  background: transparent;
}
</style>
