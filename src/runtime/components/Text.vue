<script setup lang="ts">
import { computed } from 'vue'
import type { RichTextItemResponse } from '@notionhq/client'
import { NuxtLink } from '#components'
import { notionAnnotationsToCss } from '../utils'
import { isExternalHref, notionPageUrl, useNotionRenderer } from '../utils/renderer-context'
import MathFormula from './MathFormula.vue'

const props = defineProps<{
  text: RichTextItemResponse
}>()

const context = useNotionRenderer()

const classes = computed(() => notionAnnotationsToCss(props.text.annotations))

/** Resolves page/database mentions through the link resolver; other mentions keep Notion's href. */
const link = computed<{ href: string, label: string } | null>(() => {
  const text = props.text
  if (text.type === 'mention') {
    const mention = text.mention
    if (mention.type === 'page' || mention.type === 'database') {
      const id = mention.type === 'page' ? mention.page.id : mention.database.id
      const resolved = context.linkResolver?.(id, mention.type)
      return { href: resolved?.href ?? notionPageUrl(id), label: resolved?.title || text.plain_text }
    }
    if (mention.type === 'link_preview') return { href: mention.link_preview.url, label: text.plain_text }
    if (mention.type === 'link_mention') return { href: mention.link_mention.href, label: mention.link_mention.title || text.plain_text }
    return text.href ? { href: text.href, label: text.plain_text } : null
  }
  return text.href ? { href: text.href, label: text.plain_text } : null
})

const external = computed(() => !!link.value && isExternalHref(link.value.href))
</script>

<template>
  <MathFormula
    v-if="text.type === 'equation'"
    :expression="text.equation.expression"
  />
  <NuxtLink
    v-else-if="link"
    :href="link.href"
    :target="external ? '_blank' : undefined"
    :class="classes"
  >
    <code v-if="text.annotations.code">{{ link.label }}</code>
    <template v-else>{{ link.label }}</template>
  </NuxtLink>
  <code
    v-else-if="text.annotations.code"
    :class="classes"
  >{{ text.plain_text }}</code>
  <span
    v-else
    :class="classes"
  >{{ text.plain_text }}</span>
</template>
