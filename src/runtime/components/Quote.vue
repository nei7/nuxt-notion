<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { notionColorToCss } from '../utils'
import TextRenderer from './TextRenderer.vue'
import Blocks from './Blocks.vue'

const props = defineProps<{
  block: NotionBlockOf<'quote'>
}>()

const color = computed(() => notionColorToCss(props.block.quote.color))
</script>

<template>
  <blockquote :class="color">
    <p v-if="block.quote.rich_text.length">
      <TextRenderer :text="block.quote.rich_text" />
    </p>
    <Blocks
      v-if="block.children?.length"
      :blocks="block.children"
    />
  </blockquote>
</template>
