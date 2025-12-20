<script setup lang="ts">
import type { CodeBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

defineProps<{ code: CodeBlockObjectResponse }>()
</script>

<template>
  <div
    class="rounded-md overflow-x-auto"
  />
</template>
