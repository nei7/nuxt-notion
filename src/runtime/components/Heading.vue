<script setup lang="ts">
import { computed } from 'vue'
import type { RichTextItemResponse } from '@notionhq/client'
import type { NotionColor, NotionHeadingBlock } from '../types/notion'
import { notionColorToCss } from '../utils'
import { useNotionRenderer } from '../utils/renderer-context'
import TextRenderer from './TextRenderer.vue'
import Blocks from './Blocks.vue'

interface HeadingContent {
  rich_text: RichTextItemResponse[]
  color: NotionColor
  is_toggleable: boolean
}

const props = defineProps<{
  block: NotionHeadingBlock
}>()

const context = useNotionRenderer()

const content = computed(() => (props.block as unknown as Record<string, HeadingContent>)[props.block.type]!)
const level = computed(() => Number(props.block.type.slice(-1)))
const tag = computed(() => `h${Math.min(6, Math.max(1, level.value + context.headingOffset))}`)
const id = computed(() => context.headingIds.get(props.block.id))
const color = computed(() => notionColorToCss(content.value.color))
</script>

<template>
  <details
    v-if="content.is_toggleable"
    class="notion-toggle notion-toggle-heading"
  >
    <summary>
      <component
        :is="tag"
        :id="id"
        :class="color"
      >
        <TextRenderer :text="content.rich_text" />
      </component>
    </summary>
    <Blocks
      v-if="block.children?.length"
      :blocks="block.children"
    />
  </details>
  <component
    :is="tag"
    v-else
    :id="id"
    :class="color"
  >
    <TextRenderer :text="content.rich_text" />
  </component>
</template>
