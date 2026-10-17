<script setup lang="ts">
const route = useRoute()

const { data, error } = await useNotionCollectionItem('posts', () => String(route.params.slug))

if (error.value) {
  throw createError({ statusCode: error.value.statusCode ?? 500, statusMessage: error.value.statusMessage, fatal: true })
}
</script>

<template>
  <article
    v-if="data"
    class="prose dark:prose-invert"
  >
    <h1>{{ data.item.title }}</h1>
    <p class="text-sm opacity-70">
      {{ data.item.date }} · {{ data.readingTime.minutes }} min read · {{ data.item.tags.join(', ') }}
    </p>

    <details v-if="data.headings.length">
      <summary>Table of contents</summary>
      <ul>
        <li
          v-for="heading in data.headings"
          :key="heading.id"
          :style="{ marginLeft: `${(heading.level - 1) * 1}rem` }"
        >
          <a :href="`#${heading.id}`">{{ heading.text }}</a>
        </li>
      </ul>
    </details>

    <NotionRenderer
      :blocks="data.blocks"
      :heading-offset="1"
    >
      <template #fallback="{ block }">
        <p class="text-xs opacity-50">
          [unsupported block: {{ block.type }}]
        </p>
      </template>
    </NotionRenderer>

    <hr>
    <p class="flex justify-between text-sm">
      <NuxtLink
        v-if="data.prev"
        :to="`/${data.prev.slug}`"
      >
        ← {{ data.prev.title }}
      </NuxtLink>
      <span v-else />
      <NuxtLink
        v-if="data.next"
        :to="`/${data.next.slug}`"
      >
        {{ data.next.title }} →
      </NuxtLink>
    </p>
  </article>
</template>
