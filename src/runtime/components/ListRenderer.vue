<script setup lang="ts">
import { computed } from 'vue'
import type { NotionListBlock, NotionListType } from '../types/notion'
import BulletedListItem from './BulletedListItem.vue'
import NumberedListItem from './NumberedListItem.vue'
import TodoListItem from './TodoListItem.vue'

const props = defineProps<{
  blocks: NotionListBlock[]
  type: NotionListType
}>()

const tag = computed(() => (props.type === 'numbered_list_item' ? 'ol' : 'ul'))
</script>

<template>
  <component
    :is="tag"
    :class="type === 'to_do' ? 'notion-todo-list' : undefined"
  >
    <template
      v-for="block in blocks"
      :key="block.id"
    >
      <BulletedListItem
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
