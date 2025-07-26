<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// Global SEO configuration
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'theme-color', content: '#dc2626' },
    { name: 'msapplication-TileColor', content: '#dc2626' },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
  ]
})
</script>
