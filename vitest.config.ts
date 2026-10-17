import { defineConfig, defaultExclude } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    exclude: [...defaultExclude, '**/.direnv/**'],
  },
})
