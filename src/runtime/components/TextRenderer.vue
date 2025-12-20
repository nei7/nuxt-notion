<script setup lang="ts">
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import Text from './Text.vue'

defineProps<{
  text: RichTextItemResponse[]
}>()
</script>

<template>
  <Text
    v-for="(t, i) in text"
    :key="i"
    :text="t"
  />
</template>
