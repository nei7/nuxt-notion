<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { notionColorToCss } from '../utils'
import TextRenderer from './TextRenderer.vue'
import Blocks from './Blocks.vue'

const props = defineProps<{
  block: NotionBlockOf<'toggle'>
}>()

const color = computed(() => notionColorToCss(props.block.toggle.color))
</script>

<template>
  <details
    class="notion-toggle"
    :class="color"
  >
    <summary>
      <TextRenderer :text="block.toggle.rich_text" />
    </summary>
    <div class="notion-toggle-content">
      <Blocks
        v-if="block.children?.length"
        :blocks="block.children"
      />
    </div>
  </details>
</template>
