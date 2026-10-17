import { describe, expect, it } from 'vitest'
import type { ListBlockChildrenParameters, ListBlockChildrenResponse } from '@notionhq/client'
import { fetchBlockTree, type BlockTreeClient } from '../../src/runtime/utils/block-tree'

type Page = { results: unknown[], next_cursor: string | null }

/** In-memory Notion tree: parent id → pages of child blocks. */
function makeClient(tree: Record<string, Page[]>, options: { delay?: number } = {}) {
  let active = 0
  let maxActive = 0
  const calls: ListBlockChildrenParameters[] = []

  const client: BlockTreeClient = {
    blocks: {
      children: {
        list: async (args) => {
          calls.push(args)
          active += 1
          maxActive = Math.max(maxActive, active)
          if (options.delay) await new Promise(resolve => setTimeout(resolve, options.delay))
          active -= 1

          const pages = tree[args.block_id] ?? [{ results: [], next_cursor: null }]
          const index = args.start_cursor ? Number(args.start_cursor) : 0
          const page = pages[index]!
          return {
            object: 'list',
            type: 'block',
            block: {},
            results: page.results,
            has_more: page.next_cursor !== null,
            next_cursor: page.next_cursor,
          } as unknown as ListBlockChildrenResponse
        },
      },
    },
  }

  return { client, calls, maxActive: () => maxActive }
}

const b = (id: string, type = 'paragraph', has_children = false) => ({ object: 'block', id, type, has_children, [type]: {} })

describe('fetchBlockTree', () => {
  it('follows pagination cursors on every level', async () => {
    const { client, calls } = makeClient({
      root: [
        { results: [b('a'), b('b')], next_cursor: '1' },
        { results: [b('c')], next_cursor: null },
      ],
    })

    const blocks = await fetchBlockTree(client, 'root')

    expect(blocks.map(x => x.id)).toEqual(['a', 'b', 'c'])
    expect(calls.map(c => c.start_cursor)).toEqual([undefined, '1'])
  })

  it('attaches children recursively and skips child pages/databases', async () => {
    const { client } = makeClient({
      root: [{ results: [b('toggle', 'toggle', true), b('sub', 'child_page', true), b('db', 'child_database', true)], next_cursor: null }],
      toggle: [{ results: [b('inner', 'bulleted_list_item', true)], next_cursor: null }],
      inner: [{ results: [b('leaf')], next_cursor: null }],
      sub: [{ results: [b('hidden')], next_cursor: null }],
    })

    const blocks = await fetchBlockTree(client, 'root')

    expect(blocks[0]!.children?.[0]!.children?.[0]!.id).toBe('leaf')
    expect(blocks[1]!.children).toBeUndefined()
    expect(blocks[2]!.children).toBeUndefined()
  })

  it('drops partial blocks', async () => {
    const { client } = makeClient({
      root: [{ results: [{ object: 'block', id: 'partial' }, b('full')], next_cursor: null }],
    })

    const blocks = await fetchBlockTree(client, 'root')
    expect(blocks.map(x => x.id)).toEqual(['full'])
  })

  it('respects maxDepth', async () => {
    const { client } = makeClient({
      root: [{ results: [b('l1', 'toggle', true)], next_cursor: null }],
      l1: [{ results: [b('l2', 'toggle', true)], next_cursor: null }],
      l2: [{ results: [b('l3')], next_cursor: null }],
    })

    const blocks = await fetchBlockTree(client, 'root', { maxDepth: 1 })
    expect(blocks[0]!.children?.[0]!.id).toBe('l2')
    expect(blocks[0]!.children?.[0]!.children).toBeUndefined()
  })

  it('never exceeds the concurrency limit', async () => {
    const parents = Array.from({ length: 10 }, (_, i) => b(`p${i}`, 'toggle', true))
    const tree: Record<string, Page[]> = { root: [{ results: parents, next_cursor: null }] }
    for (const parent of parents) tree[parent.id] = [{ results: [b(`${parent.id}-child`)], next_cursor: null }]

    const { client, maxActive } = makeClient(tree, { delay: 5 })
    await fetchBlockTree(client, 'root', { concurrency: 3 })

    expect(maxActive()).toBeLessThanOrEqual(3)
    expect(maxActive()).toBeGreaterThan(1)
  })
})
