<template>
  <div
    v-if="blocks"
    class="max-w-4xl mx-auto"
  >
    <NotionRenderer :blocks="blocks" />
  </div>
</template>

<script setup>
const notion = useNotion()

const { data: blocks } = await useAsyncData('blocks', async () => await notion.getPageBlocks({ page_size: 100, block_id: '19617292-7d72-801f-bb26-dec69caa7f71' }))
</script>
