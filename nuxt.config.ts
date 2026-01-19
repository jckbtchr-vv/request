// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-19',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'VV Request',
      meta: [
        { name: 'description', content: 'Submit visual requests in VV style' }
      ]
    }
  }
})
