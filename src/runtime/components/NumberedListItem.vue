<script setup lang="ts">
import type { NumberedListItemBlockObjectResponse } from '@notionhq/client'
import TextRenderer from './TextRenderer.vue'

defineProps<{
  block: NumberedListItemBlockObjectResponse
}>()
</script>

<template>
  <li>
    <TextRenderer :text="block.numbered_list_item.rich_text" />
  </li>
</template>
