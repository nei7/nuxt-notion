<script setup lang="ts">
import type { CodeBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { useShiki } from '../utils/shiki'
import type { BundledLanguage } from 'shiki'

const props = defineProps<{ block: CodeBlockObjectResponse }>()

const codeContent = props.block.code.rich_text[0]?.plain_text || ''

const highlighter = await useShiki()

let highlightedCode = ''
const isAllowedLanguage = (language: string) => !['arduino', 'agda'].includes(language)

const language: string | undefined = isAllowedLanguage(props.block.code.language) ? props.block.code.language : 'text'

try {
  highlightedCode = highlighter.codeToHtml(codeContent, {
    lang: language as BundledLanguage,
    themes: {
      light: 'material-theme-lighter',
      dark: 'material-theme-darker',

    },
  })
}
catch (err) {
  console.error(err)
}
</script>

<template>
  <div
    class="rounded-notion overflow-x-auto"
    v-html="highlightedCode"
  />
</template>

<style>
pre.shiki {
  padding: 0.75rem;
}
</style>
