import { describe, expect, it } from 'vitest'
import { computeReadingTime, countBlockTreeWords } from '../../src/runtime/utils/reading-time'
import { block, heading, paragraph, richText } from './fixtures'

describe('countBlockTreeWords', () => {
  it('counts rich text in paragraphs, headings, lists, captions and nested children', () => {
    const blocks = [
      heading(1, 'One two'),
      paragraph('three four five', [paragraph('six')]),
      block('bulleted_list_item', { rich_text: richText('seven eight'), color: 'default' }),
      block('image', { type: 'external', external: { url: 'x' }, caption: richText('nine') }),
    ]

    expect(countBlockTreeWords(blocks)).toBe(9)
  })

  it('counts table cells', () => {
    const table = block('table', { has_column_header: false, has_row_header: false, table_width: 2 }, [
      block('table_row', { cells: [richText('a b'), richText('c')] }),
      block('table_row', { cells: [richText('d'), richText('')] }),
    ])

    expect(countBlockTreeWords([table])).toBe(4)
  })

  it('weights code by line instead of by word', () => {
    const code = block('code', {
      rich_text: richText('const a = 1\n\nconst b = 2\n'),
      caption: richText('snippet'),
      language: 'typescript',
    })

    // 2 non-empty lines * 4 + 1 caption word
    expect(countBlockTreeWords([code])).toBe(9)
  })
})

describe('computeReadingTime', () => {
  it('rounds to whole minutes with a minimum of one', () => {
    expect(computeReadingTime([paragraph('a few words')])).toEqual({ words: 3, minutes: 1 })

    const long = paragraph(Array.from({ length: 450 }, () => 'w').join(' '))
    expect(computeReadingTime([long], 200)).toEqual({ words: 450, minutes: 2 })
  })
})
