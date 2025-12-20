<script setup lang="ts">
import type { ImageBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

defineProps<{ image: ImageBlockObjectResponse }>()
</script>

<template>
  <div class="">
    <!-- <NuxtImg
      v-if="image.image.type === 'external'"
      class="max-w-full h-auto"
      :src="image.image.external.url"
    />
    <NuxtImg
      v-if="image.image.type === 'file'"
      class="max-w-full h-auto"
      :src="image.image.file.url"
    /> -->
  </div>
</template>
