<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlock } from '../types/collections'
import type { NotionListBlock, NotionListType } from '../types/notion'
import { isNotionBlockType } from '../utils'
import Block from './Block.vue'
import ListRenderer from './ListRenderer.vue'

const props = defineProps<{
  blocks: NotionBlock[]
}>()

type RenderItem
  = | { kind: 'block', key: string, block: NotionBlock }
    | { kind: 'list', key: string, listType: NotionListType, items: NotionListBlock[] }

// Notion returns list items as flat siblings; consecutive items of one type form a list.
const items = computed(() => {
  const result: RenderItem[] = []

  for (const block of props.blocks) {
    if (isNotionBlockType(block, 'bulleted_list_item', 'numbered_list_item', 'to_do')) {
      const last = result[result.length - 1]
      if (last?.kind === 'list' && last.listType === block.type) {
        last.items.push(block)
      }
      else {
        result.push({ kind: 'list', key: block.id, listType: block.type, items: [block] })
      }
    }
    else {
      result.push({ kind: 'block', key: block.id, block })
    }
  }

  return result
})
</script>

<template>
  <template
    v-for="item in items"
    :key="item.key"
  >
    <ListRenderer
      v-if="item.kind === 'list'"
      :blocks="item.items"
      :type="item.listType"
    />
    <Block
      v-else
      :block="item.block"
    />
  </template>
</template>
