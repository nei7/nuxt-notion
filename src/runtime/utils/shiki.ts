import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Highlighter | null = null

export const useShiki = async () => {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['material-theme-lighter', 'material-theme-darker'],

      langs: ['javascript', 'typescript', 'vue', 'html', 'css', 'json', 'bash', 'python', 'sql'],
    })
  }

  return highlighter
}
