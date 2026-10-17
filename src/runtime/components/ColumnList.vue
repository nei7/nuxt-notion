<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { isNotionBlockType } from '../utils'
import Blocks from './Blocks.vue'

const props = defineProps<{
  block: NotionBlockOf<'column_list'>
}>()

const columns = computed(() =>
  (props.block.children ?? []).filter(child => isNotionBlockType(child, 'column')),
)

// Notion stores relative widths; missing ratios share the row evenly.
const template = computed(() =>
  columns.value.map(column => `minmax(0, ${column.column.width_ratio ?? 1}fr)`).join(' '),
)
</script>

<template>
  <div
    class="notion-columns"
    :style="{ '--notion-columns-template': template }"
  >
    <div
      v-for="column in columns"
      :key="column.id"
      class="notion-column"
    >
      <Blocks
        v-if="column.children?.length"
        :blocks="column.children"
      />
    </div>
  </div>
</template>
