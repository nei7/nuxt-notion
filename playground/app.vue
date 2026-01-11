<template>
  <div>
    <NotionRenderer
      v-if="data"
      class="max-w-4xl mx-auto mb-20 w-full"
      :blocks="data.results"
    />
  </div>
</template>

<script setup>
import { getNotionBlocks } from '../src/runtime/composables/notion'

const { data } = await useAsyncData('blocks', () =>
  getNotionBlocks({ block_id: '19617292-7d72-801f-bb26-dec69caa7f71' }),
)

console.log(data.value.results)
</script>

<style>
@import "tailwindcss";

@source "../**/*.{js,ts,vue}";
</style>
