import { isFullBlock, type ListBlockChildrenParameters, type ListBlockChildrenResponse } from '@notionhq/client'
import type { NotionBlock } from '../types/collections'

export interface BlockTreeClient {
  blocks: {
    children: {
      list: (args: ListBlockChildrenParameters) => Promise<ListBlockChildrenResponse>
    }
  }
}

export interface FetchBlockTreeOptions {
  /** Parallel `children.list` calls while expanding a level. Defaults to 4. */
  concurrency?: number
  /** Maximum nesting depth to expand. Defaults to 10. */
  maxDepth?: number
}

/** Children of these blocks are separate documents and are never expanded. */
const NON_EXPANDABLE = new Set(['child_page', 'child_database'])

async function mapLimit<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let index = 0
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (index < items.length) {
      const item = items[index++]!
      await fn(item)
    }
  })
  await Promise.all(workers)
}

export async function listAllChildren(client: BlockTreeClient, blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined

  do {
    const res = await client.blocks.children.list({ block_id: blockId, page_size: 100, start_cursor: cursor })
    for (const block of res.results) {
      if (isFullBlock(block)) blocks.push(block)
    }
    cursor = res.has_more && res.next_cursor ? res.next_cursor : undefined
  } while (cursor)

  return blocks
}

/** Fetches a block's descendants recursively, attaching them as `children`. */
export async function fetchBlockTree(client: BlockTreeClient, rootId: string, options: FetchBlockTreeOptions = {}): Promise<NotionBlock[]> {
  const concurrency = options.concurrency ?? 4
  const maxDepth = options.maxDepth ?? 10

  const expand = async (blocks: NotionBlock[], depth: number) => {
    if (depth >= maxDepth) return
    const parents = blocks.filter(b => b.has_children && !NON_EXPANDABLE.has(b.type))
    await mapLimit(parents, concurrency, async (block) => {
      block.children = await listAllChildren(client, block.id)
      await expand(block.children, depth + 1)
    })
  }

  const root = await listAllChildren(client, rootId)
  await expand(root, 0)
  return root
}
