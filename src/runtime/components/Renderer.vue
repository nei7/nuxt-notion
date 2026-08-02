<script setup lang="ts">
import { isFullBlock, type BlockObjectResponse } from '@notionhq/client'
import type { AnyNotionBlock, NotionListBlock, NotionListType } from '../types/notion'
import { isNotionBlockType } from '../utils'
import { computed } from 'vue'

import Header from './Header.vue'
import Paragraph from './Paragraph.vue'
import Image from './Image.vue'
import Code from './Code.vue'
import Callout from './Callout.vue'
import Quote from './Quote.vue'
import ListRenderer from './ListRenderer.vue'
import Divider from './Divider.vue'
import Video from './Video.vue'
import File from './File.vue'
import Embed from './Embed.vue'
import WebBookmark from './WebBookmark.vue'
import Equation from './Equation.vue'

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
  key: string
  block: BlockObjectResponse
}

interface ListRenderBlock {
  type: RenderBlockType.List
  key: string
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
        key: block.id,
        listType: block.type,
        items: [block],
      })
    }
    else {
      result.push({ type: RenderBlockType.Block, key: block.id, block })
    }
  }

  return result
})
</script>

<template>
  <div class="notion-renderer">
    <template
      v-for="renderBlock in renderableBlocks"
      :key="renderBlock.key"
    >
      <template v-if="renderBlock.type === RenderBlockType.Block">
        <Header
          v-if="isNotionBlockType(renderBlock.block, 'heading_1', 'heading_2', 'heading_3')"
          :block="renderBlock.block"
        />
        <Paragraph
          v-else-if="isNotionBlockType(renderBlock.block, 'paragraph')"
          :block="renderBlock.block"
        />
        <Image
          v-else-if="isNotionBlockType(renderBlock.block, 'image')"
          :block="renderBlock.block"
        />
        <Code
          v-else-if="isNotionBlockType(renderBlock.block, 'code')"
          :block="renderBlock.block"
        />
        <Callout
          v-else-if="isNotionBlockType(renderBlock.block, 'callout')"
          :block="renderBlock.block"
        />
        <Quote
          v-else-if="isNotionBlockType(renderBlock.block, 'quote')"
          :block="renderBlock.block"
        />
        <Divider
          v-else-if="isNotionBlockType(renderBlock.block, 'divider')"
          :block="renderBlock.block"
        />
        <Video
          v-else-if="isNotionBlockType(renderBlock.block, 'video')"
          :block="renderBlock.block"
        />
        <File
          v-else-if="isNotionBlockType(renderBlock.block, 'file')"
          :block="renderBlock.block"
        />
        <Embed
          v-else-if="isNotionBlockType(renderBlock.block, 'embed')"
          :embed="renderBlock.block"
        />
        <WebBookmark
          v-else-if="isNotionBlockType(renderBlock.block, 'bookmark')"
          :block="renderBlock.block"
        />
        <Equation
          v-else-if="isNotionBlockType(renderBlock.block, 'equation')"
          :block="renderBlock.block"
        />
      </template>
      <ListRenderer
        v-else-if="renderBlock.type === RenderBlockType.List"
        :blocks="renderBlock.items"
        :type="renderBlock.listType"
      />
    </template>
  </div>
</template>

<style>
:root {
  --nc-gray: #6b7280;    /* gray-500 */
  --nc-brown: #9a3412;   /* orange-800 */
  --nc-orange: #ea580c;  /* orange-600 */
  --nc-yellow: #ca8a04;  /* yellow-600 */
  --nc-green: #16a34a;   /* green-600 */
  --nc-blue: #2563eb;    /* blue-600 */
  --nc-purple: #9333ea;  /* purple-600 */
  --nc-pink: #db2777;    /* pink-600 */
  --nc-red: #dc2626;     /* red-600 */

  --bg-gray: #f3f4f6;    /* gray-100 */
  --bg-brown: #ffedd5;   /* orange-100 */
  --bg-orange: #ffedd5;  /* orange-100 */
  --bg-yellow: #fef9c3;  /* yellow-100 */
  --bg-green: #dcfce7;   /* green-100 */
  --bg-blue: #dbeafe;    /* blue-100 */
  --bg-purple: #f3e8ff;  /* purple-100 */
  --bg-pink: #fce7f3;    /* pink-100 */
  --bg-red: #fee2e2;     /* red-100 */
}

@media (prefers-color-scheme: dark) {
  :root {
    --nc-gray: #9ca3af;    /* gray-400 */
    --nc-brown: #fdba74;   /* orange-300 */
    --nc-orange: #fb923c;  /* orange-400 */
    --nc-yellow: #fde047;  /* yellow-300 */
    --nc-green: #4ade80;   /* green-400 */
    --nc-blue: #60a5fa;    /* blue-400 */
    --nc-purple: #c084fc;  /* purple-400 */
    --nc-pink: #f472b6;    /* pink-400 */
    --nc-red: #f87171;     /* red-400 */

    --bg-gray: #1f2937;           /* gray-800 */
    --bg-brown: rgba(124, 45, 18, 0.5);  /* orange-900/50 */
    --bg-orange: rgba(124, 45, 18, 0.5); /* orange-900/50 */
    --bg-yellow: rgba(113, 63, 18, 0.5); /* yellow-900/50 */
    --bg-green: rgba(20, 83, 45, 0.5);   /* green-900/50 */
    --bg-blue: rgba(30, 58, 138, 0.5);   /* blue-900/50 */
    --bg-purple: rgba(88, 28, 135, 0.5); /* purple-900/50 */
    --bg-pink: rgba(131, 24, 67, 0.5);   /* pink-900/50 */
    --bg-red: rgba(127, 29, 29, 0.5);    /* red-900/50 */
  }
}

.notion-color-gray { color: var(--nc-gray); }
.notion-color-brown { color: var(--nc-brown); }
.notion-color-orange { color: var(--nc-orange); }
.notion-color-yellow { color: var(--nc-yellow); }
.notion-color-green { color: var(--nc-green); }
.notion-color-blue { color: var(--nc-blue); }
.notion-color-purple { color: var(--nc-purple); }
.notion-color-pink { color: var(--nc-pink); }
.notion-color-red { color: var(--nc-red); }

.notion-bg-gray { background-color: var(--bg-gray); }
.notion-bg-brown { background-color: var(--bg-brown); }
.notion-bg-orange { background-color: var(--bg-orange); }
.notion-bg-yellow { background-color: var(--bg-yellow); }
.notion-bg-green { background-color: var(--bg-green); }
.notion-bg-blue { background-color: var(--bg-blue); }
.notion-bg-purple { background-color: var(--bg-purple); }
.notion-bg-pink { background-color: var(--bg-pink); }
.notion-bg-red { background-color: var(--bg-red); }
.notion-bg-default { background-color: transparent; }

.notion-bold { font-weight: 700; }
.notion-italic { font-style: italic; }
.notion-underline { text-decoration: underline; }
.notion-strikethrough { text-decoration: line-through; }

.notion-renderer .todo-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notion-video   {
  position: relative;
  aspect-ratio: 16/9;
}

.notion-embed .youtube {
  position: relative;
  aspect-ratio: 16/9;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.notion-embed .spotify {
  position: relative;
  height: 10rem;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.notion-video video, .notion-embed iframe {
   position: absolute;
   width: 100%;
   height: 100%;
   inset: 0;
}
</style>
