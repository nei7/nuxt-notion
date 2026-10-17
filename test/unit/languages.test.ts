import { describe, expect, it } from 'vitest'
import { notionLangToShiki } from '../../src/runtime/utils/languages'

describe('notionLangToShiki', () => {
  it.each([
    ['plain text', 'text'],
    ['c++', 'cpp'],
    ['c#', 'csharp'],
    ['shell', 'shellscript'],
    ['bash', 'shellscript'],
    ['typescript', 'typescript'],
    ['YAML', 'yaml'],
    ['notion formula', 'text'],
    [undefined, 'text'],
    ['', 'text'],
  ])('%j → %s', (input, expected) => {
    expect(notionLangToShiki(input)).toBe(expected)
  })

  it('falls back to text when the language is not loaded', () => {
    const loaded = ['typescript', 'ts', 'yaml']
    expect(notionLangToShiki('typescript', loaded)).toBe('typescript')
    expect(notionLangToShiki('python', loaded)).toBe('text')
    expect(notionLangToShiki('shell', loaded)).toBe('text')
  })

  it('always allows Shiki special languages', () => {
    expect(notionLangToShiki('plain text', [])).toBe('text')
    expect(notionLangToShiki('ansi', [])).toBe('ansi')
  })
})
