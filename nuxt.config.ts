// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-26',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // SPA mode to avoid all SSR/prerendering issues with Firebase
  ssr: false,

  devServer: {
    port: 3001
  }
})