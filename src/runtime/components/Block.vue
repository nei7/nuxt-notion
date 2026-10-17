<script setup lang="ts">
import type { NotionBlock } from '../types/collections'
import { isNotionBlockType } from '../utils'

import Heading from './Heading.vue'
import Paragraph from './Paragraph.vue'
import Image from './Image.vue'
import Code from './Code.vue'
import Callout from './Callout.vue'
import Quote from './Quote.vue'
import Divider from './Divider.vue'
import Video from './Video.vue'
import File from './File.vue'
import Pdf from './Pdf.vue'
import Audio from './Audio.vue'
import Embed from './Embed.vue'
import WebBookmark from './WebBookmark.vue'
import Equation from './Equation.vue'
import Toggle from './Toggle.vue'
import Table from './Table.vue'
import ColumnList from './ColumnList.vue'
import SyncedBlock from './SyncedBlock.vue'
import PageLink from './PageLink.vue'
import TableOfContents from './TableOfContents.vue'
import Fallback from './Fallback.vue'

defineProps<{
  block: NotionBlock
}>()
</script>

<template>
  <Heading
    v-if="isNotionBlockType(block, 'heading_1', 'heading_2', 'heading_3', 'heading_4')"
    :block="block"
  />
  <Paragraph
    v-else-if="isNotionBlockType(block, 'paragraph')"
    :block="block"
  />
  <Image
    v-else-if="isNotionBlockType(block, 'image')"
    :block="block"
  />
  <Code
    v-else-if="isNotionBlockType(block, 'code')"
    :block="block"
  />
  <Callout
    v-else-if="isNotionBlockType(block, 'callout')"
    :block="block"
  />
  <Quote
    v-else-if="isNotionBlockType(block, 'quote')"
    :block="block"
  />
  <Toggle
    v-else-if="isNotionBlockType(block, 'toggle')"
    :block="block"
  />
  <Table
    v-else-if="isNotionBlockType(block, 'table')"
    :block="block"
  />
  <ColumnList
    v-else-if="isNotionBlockType(block, 'column_list')"
    :block="block"
  />
  <SyncedBlock
    v-else-if="isNotionBlockType(block, 'synced_block')"
    :block="block"
  />
  <Divider
    v-else-if="isNotionBlockType(block, 'divider')"
    :block="block"
  />
  <Video
    v-else-if="isNotionBlockType(block, 'video')"
    :block="block"
  />
  <File
    v-else-if="isNotionBlockType(block, 'file')"
    :block="block"
  />
  <Pdf
    v-else-if="isNotionBlockType(block, 'pdf')"
    :block="block"
  />
  <Audio
    v-else-if="isNotionBlockType(block, 'audio')"
    :block="block"
  />
  <Embed
    v-else-if="isNotionBlockType(block, 'embed')"
    :embed="block"
  />
  <WebBookmark
    v-else-if="isNotionBlockType(block, 'bookmark', 'link_preview')"
    :block="block"
  />
  <Equation
    v-else-if="isNotionBlockType(block, 'equation')"
    :block="block"
  />
  <PageLink
    v-else-if="isNotionBlockType(block, 'child_page', 'child_database', 'link_to_page')"
    :block="block"
  />
  <TableOfContents
    v-else-if="isNotionBlockType(block, 'table_of_contents')"
    :block="block"
  />
  <Fallback
    v-else
    :block="block"
  />
</template>
