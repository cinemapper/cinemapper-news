// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-26',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', 
    '@pinia/nuxt',
    '@nuxtjs/pwa',
    '@nuxtjs/firebase'
  ],

  // Enable SSR for proper SEO meta tags
  ssr: true,

  // Firebase configuration
  firebase: {
    config: {
      apiKey: "AIzaSyBSvu6WuGyE26uow9sllrV_Rz6SAIJh5vQ",
      authDomain: "cinemapper-44cff.firebaseapp.com",
      databaseURL: "https://cinemapper-44cff-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "cinemapper-44cff",
      storageBucket: "cinemapper-44cff.appspot.com",
      messagingSenderId: "625450796704",
      appId: "1:625450796704:web:0ba52793fe12812811abc5",
      measurementId: "G-Y890CQLMW5"
    },
    services: {
      auth: {
        ssr: true // Enable server-side auth
      },
      firestore: true,
      database: true,
      storage: true
    }
  },

  // PWA configuration for service worker
  pwa: {
    meta: false,
    icon: false,
    workbox: {
      importScripts: [
        '/firebase-auth-sw.js'
      ],
      dev: false
    }
  },

  devServer: {
    port: 3001
  }
})