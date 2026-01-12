<script setup lang="ts">
import type { DividerBlockObjectResponse } from '@notionhq/client'

defineProps<{
  block: DividerBlockObjectResponse
}>()
</script>

<template>
  <hr>
</template>
