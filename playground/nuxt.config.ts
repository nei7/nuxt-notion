import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: false },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // Secrets come from playground/.env (see .env.example):
  //   NUXT_NUXT_NOTION_API_KEY, NUXT_NUXT_NOTION_COLLECTIONS_POSTS_DATA_SOURCE_ID
  nuxtNotion: {
    exposeRawApi: true,
    darkMode: 'media',
    collections: {
      posts: {
        dataSourceId: '',
        properties: {
          slug: ['slug', 'url'],
          date: ['date', 'published'],
          tags: ['tags', 'category'],
        },
      },
    },
  },

  shiki: {
    defaultTheme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    bundledThemes: ['vitesse-light', 'vitesse-dark'],
    bundledLangs: ['javascript', 'typescript', 'json', 'yaml', 'shellscript', 'python'],
  },
})
