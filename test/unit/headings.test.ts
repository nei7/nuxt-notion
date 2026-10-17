import { describe, expect, it } from 'vitest'
import { extractHeadings } from '../../src/runtime/utils/headings'
import { dedupeIds, slugifyHeading } from '../../src/runtime/utils/slug'
import { block, heading, paragraph, richText } from './fixtures'

describe('slugifyHeading', () => {
  it.each([
    ['Hello World', 'hello-world'],
    ['Zażółć gęślą jaźń', 'zazolc-gesla-jazn'],
    ['  What is k3s?!  ', 'what-is-k3s'],
    ['C++ & Rust: a comparison', 'c-rust-a-comparison'],
    ['', 'section'],
    ['!!!', 'section'],
  ])('%j → %s', (input, expected) => {
    expect(slugifyHeading(input)).toBe(expected)
  })

  it('caps the length at 80 characters', () => {
    expect(slugifyHeading('a'.repeat(200)).length).toBeLessThanOrEqual(80)
  })
})

describe('dedupeIds', () => {
  it('appends -2, -3 to repeated ids in order', () => {
    expect(dedupeIds(['intro', 'setup', 'intro', 'intro', 'setup'])).toEqual(['intro', 'setup', 'intro-2', 'intro-3', 'setup-2'])
  })
})

describe('extractHeadings', () => {
  it('collects headings in document order with deduplicated ids', () => {
    const blocks = [
      heading(1, 'Intro'),
      paragraph('text'),
      heading(2, 'Setup'),
      heading(2, 'Setup'),
      heading(3, 'Details'),
    ]

    expect(extractHeadings(blocks)).toEqual([
      expect.objectContaining({ id: 'intro', level: 1, text: 'Intro' }),
      expect.objectContaining({ id: 'setup', level: 2 }),
      expect.objectContaining({ id: 'setup-2', level: 2 }),
      expect.objectContaining({ id: 'details', level: 3 }),
    ])
  })

  it('descends into toggles, columns and callouts', () => {
    const blocks = [
      block('toggle', { rich_text: richText('More'), color: 'default' }, [heading(2, 'Inside toggle')]),
      block('column_list', {}, [block('column', {}, [heading(3, 'In column')])]),
      block('callout', { rich_text: richText('Note'), color: 'default', icon: null }, [heading(4, 'In callout')]),
      heading(1, 'Toggle heading', [heading(2, 'Nested under heading')]),
    ]

    expect(extractHeadings(blocks).map(h => h.text)).toEqual(['Inside toggle', 'In column', 'In callout', 'Toggle heading', 'Nested under heading'])
  })

  it('skips child pages and child databases', () => {
    const blocks = [
      block('child_page', { title: 'Sub page' }, [heading(1, 'Hidden')]),
      block('child_database', { title: 'Sub db' }, [heading(1, 'Hidden too')]),
      heading(2, 'Visible'),
    ]

    expect(extractHeadings(blocks).map(h => h.text)).toEqual(['Visible'])
  })

  it('keeps the block id so renderers can look ids up', () => {
    const h = heading(2, 'Anchor')
    expect(extractHeadings([h])[0]!.blockId).toBe(h.id)
  })
})
