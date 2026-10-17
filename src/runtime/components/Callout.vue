<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { notionColorToCss } from '../utils'
import { notionFileUrl } from '../utils/files'
import TextRenderer from './TextRenderer.vue'
import Blocks from './Blocks.vue'

const props = defineProps<{
  block: NotionBlockOf<'callout'>
}>()

const color = computed(() => notionColorToCss(props.block.callout.color))

const icon = computed(() => props.block.callout.icon)

const iconUrl = computed(() => {
  const value = icon.value
  if (!value) return null
  if (value.type === 'external') return value.external.url
  if (value.type === 'file') return notionFileUrl(props.block, value, 'callout')
  if (value.type === 'custom_emoji') return value.custom_emoji.url
  return null
})
</script>

<template>
  <div
    class="notion-callout"
    :class="color"
  >
    <div
      v-if="icon && (icon.type === 'emoji' || iconUrl)"
      class="notion-callout-icon"
      aria-hidden="true"
    >
      <span v-if="icon.type === 'emoji'">{{ icon.emoji }}</span>
      <img
        v-else-if="iconUrl"
        :src="iconUrl"
        alt=""
      >
    </div>

    <div class="notion-callout-body">
      <div
        v-if="block.callout.rich_text.length"
        class="notion-callout-text"
      >
        <TextRenderer :text="block.callout.rich_text" />
      </div>
      <Blocks
        v-if="block.children?.length"
        :blocks="block.children"
      />
    </div>
  </div>
</template>
