<template>
  <div class="min-h-screen bg-white">
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-flex items-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          <span class="ml-4 text-gray-600 text-lg">Loading story...</span>
        </div>
      </div>
    </div>
    
    <div v-else-if="!article" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <svg class="mx-auto h-20 w-20 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Story not found</h3>
        <p class="text-lg text-gray-500 mb-8">The story you're looking for doesn't exist or is not published.</p>
        <NuxtLink to="/" class="inline-flex items-center text-red-600 hover:text-red-700 font-bold text-lg">
          ← Back to Stories
        </NuxtLink>
      </div>
    </div>
    
    <article v-else class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Article Header -->
      <header class="mb-20">
        <!-- Breadcrumb -->
        <nav class="mb-10">
          <NuxtLink to="/" class="text-red-600 hover:text-red-700 font-bold text-lg">
            ← Back to Stories
          </NuxtLink>
        </nav>
        
        <!-- Category -->
        <div class="mb-8">
          <span class="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-red-600 text-white uppercase tracking-widest">
            {{ getCategory(article.tags) }}
          </span>
        </div>
        
        <!-- Article Title -->
        <h1 class="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-10">
          {{ article.title }}
        </h1>
        
        <!-- Article Meta -->
        <div class="flex items-center space-x-8 text-sm text-gray-500 mb-10">
          <span class="font-bold text-gray-900">{{ article.author }}</span>
          <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
          <time :datetime="new Date(article.createdAt).toISOString()" class="font-medium">
            {{ formatDate(article.createdAt) }}
          </time>
          <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span class="font-medium">8 min read</span>
          <span v-if="article.updatedAt && article.updatedAt !== article.createdAt" class="text-gray-400">
            • Updated {{ formatDate(article.updatedAt) }}
          </span>
        </div>
        
        <!-- Article Description -->
        <p v-if="article.meta?.description" class="text-2xl text-gray-600 leading-relaxed max-w-4xl font-light">
          {{ article.meta.description }}
        </p>
      </header>
      
      <!-- Featured Image -->
      <div v-if="article.meta?.ogImage" class="mb-20">
        <img 
          :src="article.meta.ogImage" 
          :alt="article.title"
          class="w-full h-96 md:h-[500px] object-cover rounded-2xl shadow-2xl"
          loading="lazy"
        />
      </div>
      
      <!-- Article Content -->
      <div class="article-content">
        <div v-html="renderedContent"></div>
      </div>
      
      <!-- Article Footer -->
      <footer class="mt-20 pt-12 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            <span class="font-bold text-gray-900">Written by {{ article.author }}</span>
          </div>
          <div class="flex space-x-6">
            <button 
              @click="shareArticle"
              class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              Share Story
            </button>
            <NuxtLink 
              to="/"
              class="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Back to Stories
            </NuxtLink>
          </div>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const route = useRoute()
const id = route.params.id

// Server-side data fetching using the REST API
const { data: article, pending, error } = await useFetch(`/api/articles/${id}`, {
  server: true,
  client: true,
  default: () => null,
  transform: (data) => data || null
})

// Convert Markdown to HTML
const renderedContent = ref('')

// Function to render markdown content
const renderMarkdown = async (content) => {
  if (!content || !process.client) {
    renderedContent.value = content || ''
    return
  }
  
  try {
    const { marked } = await import('marked')
    renderedContent.value = marked(content)
  } catch (error) {
    console.error('Failed to load marked:', error)
    renderedContent.value = content
  }
}

// Watch for article content changes and render markdown
watch(() => article.value?.content, (newContent) => {
  if (newContent) {
    renderMarkdown(newContent)
  }
}, { immediate: true })

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

function shareArticle() {
  if (navigator.share) {
    navigator.share({
      title: article.value.title,
      text: article.value.meta?.description || article.value.title,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }
}

// SEO Meta Tags - These will be rendered server-side
const seoTitle = computed(() => {
  if (!article.value) return 'CineMapper News'
  return `${article.value.title} | CineMapper News`
})

const seoDescription = computed(() => {
  if (!article.value?.meta?.description) {
    // Fallback to first 160 characters of content
    if (article.value?.content) {
      const text = article.value.content.replace(/[#*`]/g, '').replace(/\n/g, ' ')
      return text.slice(0, 160) + (text.length > 160 ? '...' : '')
    }
    return 'Read the latest news and updates from CineMapper'
  }
  return article.value.meta.description
})

const ogImage = computed(() => {
  return article.value?.meta?.ogImage || '/img/default-og-image.jpg'
})

const canonicalUrl = computed(() => {
  return `https://news.cinemapper.com/article/${id}`
})

// Set page meta tags - These will be available for crawlers
useHead({
  title: seoTitle,
  meta: [
    // Basic SEO
    { name: 'description', content: seoDescription },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: computed(() => article.value?.author || 'CineMapper') },
    { name: 'keywords', content: computed(() => article.value?.tags ? article.value.tags.join(', ') : 'cinemapper, news, updates') },

    // Open Graph (Facebook, LinkedIn, etc.)
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: seoTitle },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: 'CineMapper News' },
    { property: 'og:locale', content: 'en_US' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@cinemapper' },
    { name: 'twitter:creator', content: computed(() => article.value?.author ? `@${article.value.author}` : '@cinemapper') },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: ogImage },

    // Article-specific meta
    { property: 'article:published_time', content: computed(() => article.value ? new Date(article.value.createdAt).toISOString() : '') },
    { property: 'article:modified_time', content: computed(() => article.value ? new Date(article.value.updatedAt || article.value.createdAt).toISOString() : '') },
    { property: 'article:author', content: computed(() => article.value?.author || 'CineMapper') },
    { property: 'article:section', content: computed(() => getCategory(article.value?.tags)) },
    { property: 'article:tag', content: computed(() => article.value?.tags ? article.value.tags.join(', ') : '') },

    // Additional SEO
    { name: 'theme-color', content: '#dc2626' },
    { name: 'msapplication-TileColor', content: '#dc2626' },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
  ]
})
</script>

<style>
/* Modern, visually striking article content styling */
.article-content {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.125rem;
  line-height: 1.8;
  color: #1f2937;
}

/* Stunning header hierarchy */
.article-content h1 {
  font-size: 3rem;
  font-weight: 800;
  color: #111827;
  margin-top: 4rem;
  margin-bottom: 2rem;
  line-height: 1.1;
  letter-spacing: -0.025em;
  position: relative;
  padding-bottom: 1.5rem;
}

.article-content h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #dc2626, #ef4444);
  border-radius: 2px;
}

.article-content h2 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  position: relative;
  padding-bottom: 1rem;
}

.article-content h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #dc2626, #f87171);
  border-radius: 2px;
}

.article-content h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #dc2626;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  line-height: 1.3;
}

.article-content h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.article-content h5 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4b5563;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.article-content h6 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #6b7280;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Beautiful paragraphs */
.article-content p {
  margin-bottom: 1.75rem;
  line-height: 1.8;
  color: #374151;
  font-size: 1.125rem;
}

.article-content p:first-of-type {
  font-size: 1.25rem;
  font-weight: 400;
  color: #1f2937;
  line-height: 1.7;
  margin-bottom: 2rem;
}

/* Stunning lists */
.article-content ul {
  margin: 2rem 0;
  padding-left: 0;
  list-style: none;
}

.article-content ol {
  margin: 2rem 0;
  padding-left: 0;
  list-style: none;
  counter-reset: list-counter;
}

.article-content ul li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  line-height: 1.7;
  color: #374151;
}

.article-content ul li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75rem;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
}

.article-content ol li {
  position: relative;
  padding-left: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  line-height: 1.7;
  color: #374151;
  counter-increment: list-counter;
}

.article-content ol li::before {
  content: counter(list-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.3);
}

/* Nested lists */
.article-content ul ul,
.article-content ol ol {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.article-content ul ul li::before {
  width: 6px;
  height: 6px;
  background: #9ca3af;
}

/* Stunning blockquotes */
.article-content blockquote {
  margin: 3rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #fef2f2, #fdf2f8);
  border-left: 5px solid #dc2626;
  border-radius: 0 12px 12px 0;
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.7;
  color: #374151;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.article-content blockquote::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 15px;
  font-size: 4rem;
  color: #dc2626;
  opacity: 0.3;
  font-family: Georgia, serif;
}

.article-content blockquote p {
  margin-bottom: 0;
  font-size: inherit;
}

/* Beautiful code styling */
.article-content code {
  background: linear-gradient(135deg, #fef2f2, #fdf2f8);
  color: #dc2626;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 0.9em;
  font-weight: 500;
  border: 1px solid #fecaca;
  box-shadow: 0 1px 3px rgba(220, 38, 38, 0.1);
}

.article-content pre {
  margin: 2.5rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #111827, #1f2937);
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
  border: 1px solid #374151;
}

.article-content pre code {
  background: transparent;
  color: #f9fafb;
  padding: 0;
  border: none;
  font-size: 0.95rem;
  box-shadow: none;
}

/* Stunning links */
.article-content a {
  color: #dc2626;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
}

.article-content a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #dc2626, #ef4444);
  transition: width 0.3s ease;
}

.article-content a:hover::after {
  width: 100%;
}

.article-content a:hover {
  color: #b91c1c;
}

/* Beautiful images */
.article-content img {
  margin: 3rem auto;
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  display: block;
}

/* Stunning tables */
.article-content table {
  width: 100%;
  margin: 3rem 0;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.article-content th {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  text-align: left;
  letter-spacing: 0.025em;
}

.article-content td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  font-size: 1rem;
}

.article-content tr:nth-child(even) {
  background: #f9fafb;
}

.article-content tr:hover {
  background: #fef2f2;
}

/* Beautiful horizontal rules */
.article-content hr {
  margin: 4rem 0;
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
  position: relative;
}

.article-content hr::after {
  content: '❖';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #dc2626;
  padding: 0 1rem;
  font-size: 1rem;
}

/* Strong and emphasis */
.article-content strong {
  font-weight: 700;
  color: #111827;
}

.article-content em {
  font-style: italic;
  color: #6b7280;
}

/* Responsive design */
@media (max-width: 768px) {
  .article-content {
    font-size: 1rem;
  }
  
  .article-content h1 {
    font-size: 2.25rem;
    margin-top: 2rem;
  }
  
  .article-content h2 {
    font-size: 1.875rem;
    margin-top: 2rem;
  }
  
  .article-content h3 {
    font-size: 1.5rem;
  }
  
  .article-content p,
  .article-content ul li,
  .article-content ol li {
    font-size: 1rem;
  }
  
  .article-content blockquote {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
  
  .article-content pre {
    padding: 1.5rem;
  }
}
</style> 