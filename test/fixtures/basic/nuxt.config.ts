import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],

  nuxtNotion: {
    apiKey: 'test-key',
    webhookSecret: 'secret_test_token',
    collections: {
      posts: { dataSourceId: '855b82e0-9293-4034-909b-40c31660c9d2' },
    },
  },
})
