/** Languages Shiki always understands without loading a grammar. */
export const SHIKI_SPECIAL_LANGS = ['text', 'plaintext', 'txt', 'plain', 'ansi']

/** Notion language names that differ from Shiki ids (everything else maps to itself). */
export const NOTION_TO_SHIKI: Record<string, string> = {
  'plain text': 'text',
  'c++': 'cpp',
  'c#': 'csharp',
  'f#': 'fsharp',
  'shell': 'shellscript',
  'bash': 'shellscript',
  'docker': 'docker',
  'java/c/c++/c#': 'java',
  'markup': 'html',
  'visual basic': 'vb',
  'vb.net': 'vb',
  'webassembly': 'wasm',
  'mathematica': 'wolfram',
  'notion formula': 'text',
  'ascii art': 'text',
  'assembly': 'asm',
  'fortran': 'fortran-free-form',
  'makefile': 'make',
  'coffeescript': 'coffee',
  'protobuf': 'proto',
  'arduino': 'cpp',
  'flow': 'javascript',
  'basic': 'vb',
  'llvm ir': 'llvm',
  'reason': 'text',
  'livescript': 'text',
  'idris': 'text',
  'agda': 'text',
  'dhall': 'text',
  'bnf': 'text',
  'ebnf': 'text',
  'abc': 'text',
}

/**
 * Maps a Notion code-block language to a Shiki language id. When `loaded` (the
 * highlighter's loaded languages, aliases included) is given, anything not loaded
 * degrades to `text` so highlighting never throws.
 */
export function notionLangToShiki(lang: string | undefined | null, loaded?: readonly string[]): string {
  const normalized = (lang ?? '').trim().toLowerCase()
  const candidate = NOTION_TO_SHIKI[normalized] ?? normalized ?? 'text'
  if (!candidate) return 'text'
  if (!loaded || SHIKI_SPECIAL_LANGS.includes(candidate)) return candidate
  return loaded.includes(candidate) ? candidate : 'text'
}
