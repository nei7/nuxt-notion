<script setup lang="ts">
import { isFullBlock } from '@notionhq/client'
import type { AnyNotionBlock } from '../types/notion'
import { isNotionBlockType } from '../utils'
import Header from './Header.vue'
import Paragraph from './Paragraph.vue'
import Image from './Image.vue'
import Code from './Code.vue'
import Callout from './Callout.vue'
import Quote from './Quote.vue'

defineProps<{
  block: AnyNotionBlock
}>()
</script>

<template>
  <div v-if="!isFullBlock(block)">
    Block is not supported
  </div>
  <Header
    v-else-if="isNotionBlockType(block, 'heading_1', 'heading_2', 'heading_3')"
    :block="block"
  />
  <Paragraph
    v-else-if="isNotionBlockType(block, 'paragraph')"
    :paragraph="block"
  />
  <Image
    v-else-if="isNotionBlockType(block, 'image')"
    :image="block"
  />
  <Code
    v-else-if="isNotionBlockType(block, 'code')"
    :code="block"
  />

  <Callout
    v-else-if="isNotionBlockType(block, 'callout')"
    :callout="block"
  />

  <Quote
    v-else-if="isNotionBlockType(block, 'quote')"
    :block="block"
  />
</template>
