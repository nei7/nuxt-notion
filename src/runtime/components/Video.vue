<script setup lang="ts">
import type { VideoBlockObjectResponse } from '@notionhq/client'
import { computed } from 'vue'
import TextRenderer from './TextRenderer.vue'
import Embed from './Embed.vue'

const props = defineProps<{ block: VideoBlockObjectResponse }>()

const videoUrl = computed(() => {
  return (
    props.block.video.type === 'external'
      ? props.block?.video?.external?.url
      : props.block?.video?.file?.url
  )
  || ''
})

const isExternalVideo = (block: VideoBlockObjectResponse): block is VideoBlockObjectResponse & { video: { type: 'external' } } => {
  return block.video.type === 'external'
}
</script>

<template>
  <div
    class="notion-video"
  >
    <Embed
      v-if="isExternalVideo(block)"
      :embed="block"
    />

    <video
      v-else

      controls
    >
      <source
        :src="videoUrl"
      >
      Your browser does not support the video tag.
    </video>

    <TextRenderer :text="block.video.caption" />
  </div>
</template>
