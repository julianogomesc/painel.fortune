// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  app: {
    head: {
      // script: [
      //   { src: 'https://www.google.com/recaptcha/api.js?render=explicit', async: true, defer: true }
      // ],
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    }
  },
  modules: ['@nuxt/ui', '@nuxt/icon', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  css: [
    '~/assets/css/main.css'
  ],

  typescript: {
    nodeTsConfig: {
      compilerOptions: {
        types: ['node']
      }
    }
  },

  // colorMode: {
  //   preference: 'light', // força o modo light como padrão
  //   fallback: 'light',   // caso não consiga detectar, usa light
  //   storageKey: 'nuxt-color-mode'
  // },

  ui: {
    theme: {
      colors: ['redYoko', 'primary', 'secondary', 'success', 'error', 'warning', 'info', 'neutral', 'black', 'white']
    },
    colorMode: false // Isso diz ao Nuxt UI para não tentar gerenciar o modo escuro
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_HMLG || ''
      // apiBase: process.env.API_BASE
    }
  }
})