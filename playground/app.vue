<template>
  <div>
    <NotionRenderer
      v-if="data"
      class="max-w-4xl mx-auto mb-20 w-full prose"
      :blocks="data.results"
    />
  </div>
</template>

<script setup>
import { getNotionBlocks } from '../src/runtime/composables/notion'

const { data } = await useAsyncData('blocks', () =>
  getNotionBlocks({ block_id: '77c36c79-5d5c-463b-abbe-890071acca79' }),
)

console.log(data.value.results)
</script>

<style>
@import "tailwindcss";

@plugin "@tailwindcss/typography";
@source "../**/*.{js,ts,vue}";

@media (prefers-color-scheme: dark) {
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;

    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
</style>
