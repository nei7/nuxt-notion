<script setup lang="ts">
import { computed } from 'vue'
import TextRenderer from './TextRenderer.vue'
import type { NotionEmbed } from '../types/notion'

const props = defineProps<{ embed: NotionEmbed }>()

const embedUrl = computed(() => {
  if (props.embed.type === 'video')
    return props.embed.video.external.url
  else return props.embed.embed.url
})

const isYouTube = computed(() => {
  return (
    embedUrl.value.includes('youtube.com')
    || embedUrl.value.includes('youtu.be')
  )
})

const isSpotify = computed(() => {
  return embedUrl.value.includes('open.spotify.com')
})

const youtubeUrl = computed(() => {
  if (!isYouTube.value) return ''

  try {
    const matches = embedUrl.value.match(/[?&]v=([\w-]{11})/)

    const videoId = matches ? matches[1] : ''

    return `https://www.youtube.com/embed/${videoId}`
  }
  catch {
    return ''
  }
})

const spotifyUrl = computed(() => {
  if (!isSpotify.value) return ''

  try {
    const matches = embedUrl.value.match(/https?:\/\/open\.spotify\.com\/track\/([A-Za-z0-9]+)/)

    const trackId = matches ? matches[1] : ''

    return `https://open.spotify.com/embed/track/${trackId}`
  }
  catch {
    return ''
  }
})

const caption = computed(() => {
  if (props.embed.type === 'embed') return props.embed.embed.caption
  else return props.embed.video.caption
})
</script>

<template>
  <div class="notion-embed">
    <div
      v-if="isYouTube"
      class="youtube"
    >
      <iframe
        :src="youtubeUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
    <div
      v-else-if="isSpotify"
      class="spotify"
    >
      <iframe
        :src="spotifyUrl"
        frameBorder="0"
        allowfullscreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  </div>
</template>
