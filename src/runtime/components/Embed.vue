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

  const matches = embedUrl.value.match(
    /(?:[?&]v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/,
  )
  if (!matches) return ''

  return `https://www.youtube.com/embed/${matches[1]}`
})

const spotifyUrl = computed(() => {
  if (!isSpotify.value) return ''

  const matches = embedUrl.value.match(
    /open\.spotify\.com\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/,
  )
  if (!matches) return ''

  return `https://open.spotify.com/embed/${matches[1]}/${matches[2]}`
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
        frameborder="0"
        allowfullscreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
    <a
      v-else
      :href="embedUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ embedUrl }}
    </a>
    <div v-if="caption.length > 0">
      <TextRenderer :text="caption" />
    </div>
  </div>
</template>
