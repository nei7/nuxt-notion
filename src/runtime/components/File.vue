<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { notionFileUrl } from '../utils/files'
import TextRenderer from './TextRenderer.vue'

const props = defineProps<{
  block: NotionBlockOf<'file'>
}>()

const url = computed(() => notionFileUrl(props.block, props.block.file))
</script>

<template>
  <p
    v-if="url"
    class="notion-file"
  >
    <a
      :href="url"
      download
    >
      {{ block.file.name }}
    </a>
    <span
      v-if="block.file.caption.length"
      class="notion-file-caption"
    >
      <TextRenderer :text="block.file.caption" />
    </span>
  </p>
</template>
