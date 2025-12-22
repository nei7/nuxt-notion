<script setup lang="ts">
import type { FileBlockObjectResponse } from '@notionhq/client'
import { computed } from 'vue'

const props = defineProps<{
  block: FileBlockObjectResponse
}>()

const fileUrl = computed(() => {
  if (props.block.file.type === 'external') return props.block.file.external.url
  else return props.block.file.file.url
})
</script>

<template>
  <div class="my-3">
    <a
      :href="fileUrl"
      download
    >
      {{ block.file.name }}
    </a>
  </div>
</template>
