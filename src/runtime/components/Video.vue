<script setup lang="ts">
import { computed } from 'vue'
import type { NotionBlockOf, NotionEmbed } from '../types/notion'
import { notionFileUrl } from '../utils/files'
import TextRenderer from './TextRenderer.vue'
import Embed from './Embed.vue'

const props = defineProps<{
  block: NotionBlockOf<'video'>
}>()

const external = computed(() => props.block.video.type === 'external')
const url = computed(() => notionFileUrl(props.block, props.block.video))
</script>

<template>
  <Embed
    v-if="external"
    :embed="(block as NotionEmbed)"
  />
  <figure
    v-else-if="url"
    class="notion-video"
  >
    <video
      controls
      preload="metadata"
      :src="url"
    />
    <figcaption v-if="block.video.caption.length">
      <TextRenderer :text="block.video.caption" />
    </figcaption>
  </figure>
</template>
