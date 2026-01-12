import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/module',
    {
      input: 'src/utils',
      name: 'utils',
    },
  ],

  declaration: true,
  externals: ['@notionhq/client'],
})
