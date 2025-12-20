<script setup lang="ts">
import type { DividerBlockObjectResponse } from '@notionhq/client'

defineProps<{
  block: DividerBlockObjectResponse
}>()
</script>

<template>
  <hr class="border-gray-200 dark:border-gray-700 my-8">
</template>
