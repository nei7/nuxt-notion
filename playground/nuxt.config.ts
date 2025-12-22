import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: false },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  nuxtNotion: {
    notionApiKey: process.env.API_TOKEN,
  },
})
