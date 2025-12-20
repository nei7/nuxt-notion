<script setup lang="ts">
import type { CalloutBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import TextRenderer from './TextRenderer.vue'
import { notionColorToCss } from '../utils'

const props = defineProps<{
  block: CalloutBlockObjectResponse
}>()

const color = notionColorToCss(props.block.callout.color)
</script>

<template>
  <div
    :style="color"
    class="p-3"
    :class="{
      border: !color,
    }"
  >
    <TextRenderer :text="block.callout.rich_text" />
  </div>
</template>
