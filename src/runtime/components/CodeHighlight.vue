<script setup lang="ts">
import { getShikiHighlighter } from '#imports'
import { notionLangToShiki } from '../utils/languages'

/**
 * Client/SSR highlighting for code blocks that were not pre-rendered on the
 * server. Async on purpose (so is nuxt-shiki's `<Shiki>`): it needs the
 * highlighter's loaded languages to avoid asking Shiki for an unknown grammar.
 */
const props = defineProps<{
  code: string
  language: string
}>()

const highlighter = await getShikiHighlighter()
const lang = notionLangToShiki(props.language, highlighter.getLoadedLanguages())
</script>

<template>
  <Shiki
    :lang="(lang as any)"
    :code="code"
    unwrap
  />
</template>
