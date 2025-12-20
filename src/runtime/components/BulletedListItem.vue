<script setup lang="ts">
import type { BulletedListItemBlockObjectResponse } from '@notionhq/client'
import TextRenderer from './TextRenderer.vue'

defineProps<{
  block: BulletedListItemBlockObjectResponse
}>()
</script>

<template>
  <li>
    <TextRenderer :text="block.bulleted_list_item.rich_text" />
  </li>
</template>
