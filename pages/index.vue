<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">CineMapper News</h1>
          </div>
          <nav class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">Home</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">Latest</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">Categories</a>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="pending" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-flex items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span class="ml-3 text-gray-600 font-medium">Loading stories...</span>
          </div>
        </div>
      </div>

      <div v-else-if="!Object.keys(articles).length" class="text-center py-20">
        <div class="text-gray-500">
          <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-900 mb-2">No stories found</h3>
          <p class="text-gray-500">Check back soon for the latest updates.</p>
        </div>
      </div>

      <!-- Featured Story (Hero) -->
      <div v-else-if="latestArticle" class="mb-12">
        <NuxtLink :to="`/article/${latestArticleId}`" class="group">
          <article class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div class="grid lg:grid-cols-2 gap-0">
              <!-- Featured Image -->
              <div class="relative lg:order-2">
                <div class="aspect-w-16 aspect-h-10 lg:aspect-h-12">
                  <img 
                    :src="latestArticle.meta?.ogImage || '/img/default-og-image.jpg'" 
                    :alt="latestArticle.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div class="absolute top-4 left-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white uppercase tracking-wider">
                    Featured
                  </span>
                </div>
              </div>
              
              <!-- Featured Content -->
              <div class="p-8 lg:p-12 flex flex-col justify-center lg:order-1">
                <div class="space-y-4">
                  <div class="flex items-center space-x-3 text-sm text-gray-500">
                    <span class="font-medium text-red-600 uppercase tracking-wider">{{ getCategory(latestArticle.tags) }}</span>
                    <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <time class="font-medium">{{ formatDate(latestArticle.createdAt) }}</time>
                  </div>
                  
                  <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                    {{ latestArticle.title }}
                  </h2>
                  
                  <p class="text-lg text-gray-600 leading-relaxed">
                    {{ getExcerpt(latestArticle.content, 200) }}
                  </p>
                  
                  <div class="flex items-center justify-between pt-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <span class="text-sm font-medium text-gray-900">{{ latestArticle.author }}</span>
                    </div>
                    <span class="text-sm text-gray-500 font-medium">8 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </NuxtLink>
      </div>

      <!-- Articles Grid -->
      <div v-if="Object.keys(displayArticles).length > 0">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink 
            v-for="(article, id) in displayArticles" 
            :key="id" 
            :to="`/article/${id}`"
            class="group"
          >
            <article class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full">
              <!-- Article Image -->
              <div class="aspect-w-16 aspect-h-10 overflow-hidden">
                <img 
                  :src="article.meta?.ogImage || '/img/default-og-image.jpg'" 
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <!-- Article Content -->
              <div class="p-6 flex flex-col h-full">
                <div class="flex-1 space-y-3">
                  <!-- Category and Date -->
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-red-600 uppercase tracking-wider">
                      {{ getCategory(article.tags) }}
                    </span>
                    <time class="text-xs text-gray-500 font-medium">{{ formatDate(article.createdAt) }}</time>
                  </div>
                  
                  <!-- Title -->
                  <h3 class="text-xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                    {{ article.title }}
                  </h3>
                  
                  <!-- Excerpt -->
                  <p class="text-gray-600 leading-relaxed text-sm line-clamp-3">
                    {{ getExcerpt(article.content, 120) }}
                  </p>
                </div>
                
                <!-- Author and Read More -->
                <div class="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span class="text-xs font-medium text-gray-700">{{ article.author }}</span>
                  </div>
                  <div class="flex items-center text-red-600 text-xs font-medium group-hover:text-red-700">
                    <span>Read More</span>
                    <svg class="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <p class="text-sm text-gray-500">© 2025 CineMapper News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Server-side data fetching for SEO
const { data: articles, pending, error } = await useFetch('/api/articles', {
  server: true,
  client: true,
  default: () => ({}),
  transform: (data) => data || {}
})

// Computed properties for display
const latestArticleId = computed(() => {
  if (!articles.value || Object.keys(articles.value).length === 0) return null

  const sortedIds = Object.keys(articles.value).sort((a, b) => {
    return articles.value[b].createdAt - articles.value[a].createdAt
  })

  return sortedIds[0]
})

const latestArticle = computed(() => {
  if (!latestArticleId.value) return null
  return articles.value[latestArticleId.value]
})

const displayArticles = computed(() => {
  if (!articles.value) return {}

  const displayArticles = { ...articles.value }
  if (latestArticleId.value) {
    delete displayArticles[latestArticleId.value]
  }

  return displayArticles
})

// Utility functions
function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getCategory(tags) {
  if (!tags || tags.length === 0) return 'News'
  return tags[0].charAt(0).toUpperCase() + tags[0].slice(1)
}

function getExcerpt(content, length = 120) {
  if (!content) return ''
  const text = content.replace(/[#*`]/g, '').replace(/\n/g, ' ')
  return text.slice(0, length) + (text.length > length ? '...' : '')
}

// SEO Meta Tags
useHead({
  title: 'CineMapper News | Latest Updates and Stories',
  meta: [
    { name: 'description', content: 'Stay updated with the latest news, updates, and stories from CineMapper. Discover what\'s happening in our community.' },
    { name: 'keywords', content: 'cinemapper, news, updates, stories, community, latest' },
    { property: 'og:title', content: 'CineMapper News | Latest Updates and Stories' },
    { property: 'og:description', content: 'Stay updated with the latest news, updates, and stories from CineMapper. Discover what\'s happening in our community.' },
    { property: 'og:image', content: '/img/default-og-image.jpg' },
    { property: 'og:url', content: 'https://news.cinemapper.com' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'CineMapper News | Latest Updates and Stories' },
    { name: 'twitter:description', content: 'Stay updated with the latest news, updates, and stories from CineMapper.' },
    { name: 'twitter:image', content: '/img/default-og-image.jpg' }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>