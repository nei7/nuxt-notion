<script setup lang="ts">
import type { CodeBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const props = defineProps<{ block: CodeBlockObjectResponse }>()

const code = props.block.code.rich_text[0]?.plain_text || ''
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
