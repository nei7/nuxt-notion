<script setup lang="ts">
import { isFullBlock, type BlockObjectResponse } from '@notionhq/client'
import type { AnyNotionBlock, NotionListBlock, NotionListType } from '../types/notion'
import { isNotionBlockType } from '../utils'
import Header from './Header.vue'
import Paragraph from './Paragraph.vue'
import Image from './Image.vue'
import Code from './Code.vue'
import Callout from './Callout.vue'
import Quote from './Quote.vue'
import { computed } from 'vue'
import ListRenderer from './ListRenderer.vue'

const props = defineProps<{
  blocks: AnyNotionBlock[]
}>()

enum RenderBlockType {
  Block = 'block',
  List = 'list',
}

type RenderBlock
  = | AnyNotionRenderBlock
    | ListRenderBlock

interface AnyNotionRenderBlock {
  type: RenderBlockType.Block
  block: BlockObjectResponse
}

interface ListRenderBlock {
  type: RenderBlockType.List
  listType: NotionListType
  items: NotionListBlock []
}

const renderableBlocks = computed(() => {
  const result: RenderBlock[] = []

  for (const block of props.blocks) {
    if (!isFullBlock(block)) continue

    const isListBlock = isNotionBlockType(block, 'bulleted_list_item', 'numbered_list_item', 'to_do')
    const lastItem = result[result.length - 1]
    if (
      isListBlock
      && lastItem?.type === RenderBlockType.List
      && lastItem.listType === block.type
    ) {
      lastItem.items.push(block)
    }
    else if (isListBlock) {
      result.push({
        type: RenderBlockType.List,
        listType: block.type,
        items: [block],
      })
    }
    // Zwykły blok
    else {
      result.push({ type: RenderBlockType.Block, block })
    }
  }

  return result
})
</script>

<template>
  <template
    v-for="(renderBlock, idx) in renderableBlocks"
    :key="idx"
  >
    <template v-if="renderBlock.type === RenderBlockType.Block">
      <Header
        v-if="isNotionBlockType(renderBlock.block, 'heading_1', 'heading_2', 'heading_3')"
        :block="renderBlock.block"
      />
      <Paragraph
        v-else-if="isNotionBlockType(renderBlock.block, 'paragraph')"
        :paragraph="renderBlock.block"
      />
      <Image
        v-else-if="isNotionBlockType(renderBlock.block, 'image')"
        :image="renderBlock.block"
      />
      <Code
        v-else-if="isNotionBlockType(renderBlock.block, 'code')"
        :code="renderBlock.block"
      />

      <Callout
        v-else-if="isNotionBlockType(renderBlock.block, 'callout')"
        :callout="renderBlock.block"
      />

      <Quote
        v-else-if="isNotionBlockType(renderBlock.block, 'quote')"
        :block="renderBlock.block"
      />
    </template>
    <ListRenderer
      v-else-if="renderBlock.type === RenderBlockType.List"
      :blocks="renderBlock.items"
      :type="renderBlock.listType"
    />
  </template>
</template>
