<script setup lang="ts">
import type { NotionBlockOf } from '../types/notion'
import Blocks from './Blocks.vue'

defineProps<{
  block: NotionBlockOf<'synced_block'>
}>()
</script>

<template>
  <Blocks
    v-if="block.children?.length"
    :blocks="block.children"
  />
</template>
