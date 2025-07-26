// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-26',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // Enable SSR for proper SEO meta tags
  ssr: true,

  devServer: {
    port: 3001
  }
})