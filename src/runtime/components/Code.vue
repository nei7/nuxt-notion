<script setup lang="ts">
import { computed } from 'vue'
import type { NotionCodeBlock } from '../types/collections'
import TextRenderer from './TextRenderer.vue'
import CodeHighlight from './CodeHighlight.vue'

const props = defineProps<{ block: NotionCodeBlock }>()

// Notion splits long code into multiple 2000-char rich_text segments
const code = computed(() => props.block.code.rich_text.map(t => t.plain_text).join(''))
const caption = computed(() => props.block.code.caption)
</script>

<template>
  <figure
    class="notion-code not-prose"
    :data-lang="block.code.language"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <pre
      v-if="block.code.html"
      v-html="block.code.html"
    />
    <CodeHighlight
      v-else
      :code="code"
      :language="block.code.language"
    />
    <figcaption v-if="caption.length">
      <TextRenderer :text="caption" />
    </figcaption>
  </figure>
</template>
