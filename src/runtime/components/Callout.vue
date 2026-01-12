<script setup lang="ts">
import type { CalloutBlockObjectResponse } from '@notionhq/client'
import TextRenderer from './TextRenderer.vue'
import { notionColorToCss } from '../utils'

const props = defineProps<{
  block: CalloutBlockObjectResponse
}>()

const color = notionColorToCss(props.block.callout.color)

const { icon } = props.block.callout

const imgUrl = () => {
  if (!icon) return
  if (icon.type === 'external') return icon.external.url
  if (icon.type === 'file') return icon.file.url
}
</script>

<template>
  <div
    class="p-3 my-5 flex space-x-3 not-prose"
    :class="color"
  >
    <div
      v-if="icon"
      class="flex items-center justify-center "
    >
      <span v-if="icon.type === 'emoji'">
        {{ icon.emoji }}
      </span>

      <img
        v-else-if="icon.type === 'external' || icon.type === 'file'"
        class="w-5 h-5 rounded-md"
        :src="imgUrl()"
      >
    </div>

    <div>
      <TextRenderer :text="block.callout.rich_text" />
    </div>
  </div>
</template>
