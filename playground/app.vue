<template>
  <div class="prose mx-auto">
    <NotionRenderer
      v-if="data"
      class="max-w-4xl mx-auto mb-20 w-full prose"
      :blocks="data.results"
    />
  </div>
</template>

<script setup lang="ts">
const { data } = await useNotionBlocks({ block_id: '19617292-7d72-801f-bb26-dec69caa7f71' })
</script>

<style>
@import "tailwindcss";
@plugin "@tailwindcss/typography";

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
