<script setup lang="ts">
const route = useRoute()
const tag = computed(() => (typeof route.query.tag === 'string' ? route.query.tag : undefined))

const { data, error } = await useNotionCollection('posts', () => ({ tag: tag.value }))
</script>

<template>
  <div class="prose dark:prose-invert">
    <h1>Posts</h1>

    <p v-if="error">
      {{ error.statusCode }}: {{ error.statusMessage || error.message }}
    </p>

    <template v-else-if="data">
      <p class="text-sm">
        <NuxtLink to="/">
          All ({{ data.total }})
        </NuxtLink>
        <template
          v-for="t in data.tags"
          :key="t.name"
        >
          ·
          <NuxtLink :to="{ query: { tag: t.name } }">
            {{ t.name }} ({{ t.count }})
          </NuxtLink>
        </template>
      </p>

      <ul>
        <li
          v-for="post in data.items"
          :key="post.id"
        >
          <NuxtLink :to="`/${post.slug}`">
            {{ post.title }}
          </NuxtLink>
          <small v-if="post.date"> — {{ new Date(post.date).toLocaleDateString('en-GB') }}</small>
        </li>
      </ul>
    </template>
  </div>
</template>
