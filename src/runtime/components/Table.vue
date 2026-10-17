<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf } from '../types/notion'
import { isNotionBlockType } from '../utils'
import TextRenderer from './TextRenderer.vue'

const props = defineProps<{
  block: NotionBlockOf<'table'>
}>()

const rows = computed(() =>
  (props.block.children ?? []).filter(child => isNotionBlockType(child, 'table_row')),
)

const hasColumnHeader = computed(() => props.block.table.has_column_header)
const hasRowHeader = computed(() => props.block.table.has_row_header)

const headerRow = computed(() => (hasColumnHeader.value ? rows.value[0] : undefined))
const bodyRows = computed(() => (hasColumnHeader.value ? rows.value.slice(1) : rows.value))
</script>

<template>
  <div class="notion-table-wrapper">
    <table class="notion-table">
      <thead v-if="headerRow">
        <tr>
          <th
            v-for="(cell, index) in headerRow.table_row.cells"
            :key="index"
            scope="col"
          >
            <TextRenderer :text="cell" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in bodyRows"
          :key="row.id"
        >
          <template
            v-for="(cell, index) in row.table_row.cells"
            :key="index"
          >
            <th
              v-if="hasRowHeader && index === 0"
              scope="row"
            >
              <TextRenderer :text="cell" />
            </th>
            <td v-else>
              <TextRenderer :text="cell" />
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
