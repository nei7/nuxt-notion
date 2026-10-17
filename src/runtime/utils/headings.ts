import type { RichTextItemResponse } from '@notionhq/client'
import type { NotionBlock, NotionHeading } from '../types/collections'
import { dedupeIds, slugifyHeading } from './slug'

const HEADING_TYPES = ['heading_1', 'heading_2', 'heading_3', 'heading_4'] as const
type HeadingType = typeof HEADING_TYPES[number]

/** Block types whose subtree belongs to another document. */
const SKIPPED_SUBTREES = new Set(['child_page', 'child_database'])

export const richTextToPlain = (text: RichTextItemResponse[] | undefined) =>
  (text ?? []).map(t => t.plain_text).join('')

const isHeading = (block: NotionBlock): block is NotionBlock & { type: HeadingType } =>
  (HEADING_TYPES as readonly string[]).includes(block.type)

/**
 * Collects every heading in document order (depth-first, including headings nested
 * in toggles, columns and callouts) and assigns deduplicated anchor ids.
 */
export function extractHeadings(blocks: NotionBlock[]): NotionHeading[] {
  const found: Omit<NotionHeading, 'id'>[] = []

  const walk = (list: NotionBlock[]) => {
    for (const block of list) {
      if (SKIPPED_SUBTREES.has(block.type)) continue

      if (isHeading(block)) {
        const content = (block as unknown as Record<HeadingType, { rich_text: RichTextItemResponse[] }>)[block.type]
        found.push({
          text: richTextToPlain(content.rich_text),
          level: Number(block.type.slice(-1)) as NotionHeading['level'],
          blockId: block.id,
        })
      }

      if (block.children?.length) walk(block.children)
    }
  }

  walk(blocks)

  const ids = dedupeIds(found.map(h => slugifyHeading(h.text)))
  return found.map((h, i) => ({ id: ids[i]!, ...h }))
}
