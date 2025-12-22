<script setup lang="ts">
import { computed } from 'vue'
import type { NotionListBlock, NotionListType } from '../types/notion'
import BulletedList from './BulletedListItem.vue'
import NumberedListItem from './NumberedListItem.vue'
import TodoListItem from './TodoListItem.vue'

const props = defineProps<{
  blocks: NotionListBlock[]
  type: NotionListType
}>()

const listHtmlTag = computed(() => {
  switch (props.type) {
    case 'bulleted_list_item':
      return 'ul'
    case 'numbered_list_item':
      return 'ol'
    case 'to_do':
    default:
      return 'di'
  }
})
</script>

<template>
  <component
    :is="listHtmlTag"
    :class="{
      'list-disc': props.type === 'bulleted_list_item',
      'list-decimal': props.type === 'numbered_list_item',
    }"
  >
    <template
      v-for="block in blocks"
      :key="block.id"
    >
      <BulletedList
        v-if="block.type === 'bulleted_list_item'"
        :block="block"
      />
      <NumberedListItem
        v-else-if="block.type === 'numbered_list_item'"
        :block="block"
      />
      <TodoListItem
        v-else-if="block.type === 'to_do'"
        :block="block"
      />
    </template>
  </component>
</template>
