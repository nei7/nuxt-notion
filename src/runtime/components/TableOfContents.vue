<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { notionColorToCss } from '../utils'
import { useNotionRenderer } from '../utils/renderer-context'

const props = defineProps<{
  block: NotionBlockOf<'table_of_contents'>
}>()

const context = useNotionRenderer()

const minLevel = computed(() => Math.min(...context.headings.map(h => h.level), 4))
const color = computed(() => notionColorToCss(props.block.table_of_contents.color))
</script>

<template>
  <nav
    v-if="context.headings.length"
    class="notion-toc"
    :class="color"
    aria-label="Table of contents"
  >
    <ul>
      <li
        v-for="heading in context.headings"
        :key="heading.id"
        :style="{ '--notion-toc-level': heading.level - minLevel }"
      >
        <a :href="`#${heading.id}`">{{ heading.text }}</a>
      </li>
    </ul>
  </nav>
</template>
