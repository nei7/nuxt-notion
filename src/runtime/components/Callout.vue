<script setup lang="ts">
import { computed } from 'vue'
import type { CalloutBlockObjectResponse } from '@notionhq/client'
import TextRenderer from './TextRenderer.vue'
import { notionColorToCss } from '../utils'

const props = defineProps<{
  block: CalloutBlockObjectResponse
}>()

const color = computed(() => notionColorToCss(props.block.callout.color))

const icon = computed(() => props.block.callout.icon)

const iconUrl = computed(() => {
  if (icon.value?.type === 'external') return icon.value.external.url
  if (icon.value?.type === 'file') return icon.value.file.url
  return undefined
})
</script>

<template>
  <div :class="color">
    <div v-if="icon">
      <span v-if="icon.type === 'emoji'">
        {{ icon.emoji }}
      </span>

      <img
        v-else-if="iconUrl"
        :src="iconUrl"
        alt=""
      >
    </div>

    <div>
      <TextRenderer :text="block.callout.rich_text" />
    </div>
  </div>
</template>
