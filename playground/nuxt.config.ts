import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['../src/module', 'nuxt-shiki'],
  devtools: { enabled: false },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  nuxtNotion: {
    apiKey: process.env.API_TOKEN,
  },
  shiki: {
    defaultTheme: 'material-theme',
    bundledThemes: ['material-theme'],
    bundledLangs: ['js', 'yaml', 'yml', 'typescript', 'bash', 'python'],
  },
})
