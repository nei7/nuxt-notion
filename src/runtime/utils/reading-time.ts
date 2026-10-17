import type { RichTextItemResponse } from '@notionhq/client'
import type { NotionBlock, NotionReadingTime } from '../types/collections'

/** Pseudo-words counted per line of code (code is skimmed, not read). */
const WORDS_PER_CODE_LINE = 4

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length

const richTextWords = (text: RichTextItemResponse[] | undefined) =>
  text ? countWords(text.map(t => t.plain_text).join(' ')) : 0

function blockWords(block: NotionBlock): number {
  // Every content block keeps its payload under a key equal to its type.
  const content = (block as unknown as Record<string, unknown>)[block.type] as Record<string, unknown> | undefined
  if (!content || typeof content !== 'object') return 0

  if (block.type === 'code') {
    const code = (content.rich_text as RichTextItemResponse[]).map(t => t.plain_text).join('')
    const lines = code.split('\n').filter(line => line.trim()).length
    return lines * WORDS_PER_CODE_LINE + richTextWords(content.caption as RichTextItemResponse[] | undefined)
  }

  if (block.type === 'table_row') {
    return (content.cells as RichTextItemResponse[][]).reduce((sum, cell) => sum + richTextWords(cell), 0)
  }

  let words = 0
  if (Array.isArray(content.rich_text)) words += richTextWords(content.rich_text as RichTextItemResponse[])
  if (Array.isArray(content.caption)) words += richTextWords(content.caption as RichTextItemResponse[])
  return words
}

export function countBlockTreeWords(blocks: NotionBlock[]): number {
  let words = 0
  for (const block of blocks) {
    words += blockWords(block)
    if (block.children?.length) words += countBlockTreeWords(block.children)
  }
  return words
}

export function computeReadingTime(blocks: NotionBlock[], wordsPerMinute = 200): NotionReadingTime {
  const words = countBlockTreeWords(blocks)
  return {
    words,
    minutes: Math.max(1, Math.round(words / wordsPerMinute)),
  }
}
