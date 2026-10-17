import { getShikiHighlighter } from '#imports'
import type { NotionBlock, NotionCodeBlock } from '../../types/collections'
import { notionLangToShiki } from '../../utils/languages'

function collectCodeBlocks(blocks: NotionBlock[], out: NotionCodeBlock[] = []): NotionCodeBlock[] {
  for (const block of blocks) {
    if (block.type === 'code') out.push(block as NotionCodeBlock)
    if (block.children?.length) collectCodeBlocks(block.children, out)
  }
  return out
}

/**
 * Renders every code block to HTML once, when the block tree is cached, so SSR
 * never pays for highlighting per request. Unknown languages fall back to plain text.
 */
export async function prehighlightCode(blocks: NotionBlock[]): Promise<void> {
  const codeBlocks = collectCodeBlocks(blocks)
  if (codeBlocks.length === 0) return

  const highlighter = await getShikiHighlighter()
  const loaded = highlighter.getLoadedLanguages()

  for (const block of codeBlocks) {
    const code = block.code.rich_text.map(t => t.plain_text).join('')
    const lang = notionLangToShiki(block.code.language, loaded)
    try {
      block.code.html = highlighter.highlight(code, { lang, unwrap: true })
    }
    catch {
      // leave `html` unset so the client-side <Shiki> fallback takes over
    }
  }
}
