// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  
  // Static generation to avoid Firebase SDK issues during SSR
  nitro: {
    preset: 'static'
  },
  
  devServer: {
    port: 3001
  }
})