<script setup lang="ts">
import type { VideoBlockObjectResponse } from '@notionhq/client'
import { computed } from 'vue'
import TextRenderer from './TextRenderer.vue'

const props = defineProps<{ block: VideoBlockObjectResponse }>()

const videoUrl = computed(() => {
  return (
    props.block.video.type === 'external'
      ? props.block?.video?.external?.url
      : props.block?.video?.file?.url
  )
  || ''
})

const isYouTube = computed(() => {
  return (
    videoUrl.value.includes('youtube.com')
    || videoUrl.value.includes('youtu.be')
  )
})

const youtubeUrl = computed(() => {
  if (!isYouTube.value) return ''

  try {
    const matches = videoUrl.value.match(/[?&]v=([\w-]{11})/)

    const videoId = matches ? matches[1] : ''

    return `https://www.youtube.com/embed/${videoId}`
  }
  catch {
    return ''
  }
})
</script>

<template>
  <div>
    <div
      class="relative aspect-video"
    >
      <iframe
        v-if="isYouTube"
        class="absolute inset-0 w-full h-full"
        :src="youtubeUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      <video
        v-else
        class="absolute inset-0 w-full h-full"

        controls
      >
        <source
          :src="videoUrl"
        >
        Your browser does not support the video tag.
      </video>

      <TextRenderer :text="block.video.caption" />
    </div>
  </div>
</template>
