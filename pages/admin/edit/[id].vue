<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Edit Article</h2>
    
    <div v-if="loading" class="text-center py-8">Loading article...</div>
    
    <div v-else-if="!article" class="text-center py-8 text-red-600">Article not found.</div>
    
    <div v-else>
      <!-- Basic Article Fields -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">Article Content</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Title *</label>
            <input 
              v-model="title" 
              placeholder="Article title" 
              class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Author *</label>
            <input 
              v-model="author" 
              placeholder="Author name" 
              class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Content (Markdown) *</label>
            <textarea 
              v-model="content" 
              rows="12" 
              placeholder="Write your article in Markdown..." 
              class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- SEO Fields -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">SEO & Social Media</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Meta Description</label>
            <textarea 
              v-model="metaDescription" 
              rows="3" 
              placeholder="SEO-friendly description (150-160 characters recommended)" 
              class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <div class="text-xs text-gray-500 mt-1">{{ metaDescription.length }}/160 characters</div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Open Graph Image URL</label>
            <input 
              v-model="ogImage" 
              placeholder="https://example.com/image.jpg" 
              class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div class="text-xs text-gray-500 mt-1">Recommended: 1200x630px for social sharing</div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Tags</label>
            <input 
              v-model="tagsInput" 
              placeholder="tag1, tag2, tag3" 
              class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div class="text-xs text-gray-500 mt-1">Separate tags with commas</div>
          </div>
        </div>
      </div>

      <!-- Publishing Options -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">Publishing</h3>
        <div class="space-y-4">
          <div class="flex items-center">
            <input 
              v-model="published" 
              type="checkbox" 
              id="published" 
              class="mr-2"
            />
            <label for="published" class="text-sm font-medium">Published</label>
          </div>
          
          <div class="flex items-center">
            <input 
              v-model="previewOnly" 
              type="checkbox" 
              id="previewOnly" 
              class="mr-2"
            />
            <label for="previewOnly" class="text-sm font-medium">Preview only (not publicly visible)</label>
          </div>
        </div>
      </div>

      <!-- Save Buttons -->
      <div class="flex gap-4">
        <button 
          @click="saveChanges" 
          class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
        <NuxtLink 
          :to="`/article/${id}`" 
          class="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 text-center"
        >
          View Article
        </NuxtLink>
      </div>

      <!-- Messages -->
      <div v-if="message" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md">{{ message }}</div>
      <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '~/lib/firebase'
import { ref as dbRef, get, update } from 'firebase/database'

const route = useRoute()
const id = route.params.id

// Article content
const title = ref('')
const content = ref('')
const author = ref('')

// SEO fields
const metaDescription = ref('')
const ogImage = ref('')
const tagsInput = ref('')

// Publishing options
const published = ref(true)
const previewOnly = ref(false)

// UI state
const article = ref(null)
const loading = ref(true)
const message = ref('')
const error = ref('')

// Computed properties
const tags = computed(() => {
  if (!tagsInput.value) return []
  return tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
})

onMounted(async () => {
  try {
    const snap = await get(dbRef(db, `articles/${id}`))
    if (snap.exists()) {
      const data = snap.val()
      article.value = data
      
      // Populate form fields
      title.value = data.title || ''
      content.value = data.content || ''
      author.value = data.author || ''
      metaDescription.value = data.meta?.description || ''
      ogImage.value = data.meta?.ogImage || ''
      tagsInput.value = data.tags ? data.tags.join(', ') : ''
      published.value = data.published !== false
      previewOnly.value = data.previewOnly === true
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const saveChanges = async () => {
  message.value = ''
  error.value = ''
  
  if (!title.value || !content.value) {
    error.value = 'Title and content are required'
    return
  }
  
  if (!author.value) {
    error.value = 'Author is required'
    return
  }
  
  try {
    const articleData = {
      title: title.value,
      content: content.value,
      author: author.value,
      meta: {
        description: metaDescription.value,
        ogImage: ogImage.value
      },
      tags: tags.value,
      published: published.value && !previewOnly.value,
      previewOnly: previewOnly.value,
      updatedAt: Date.now()
    }
    
    await update(dbRef(db, `articles/${id}`), articleData)
    message.value = 'Changes saved!'
    
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.toolbar button {
  margin-right: 8px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  background: #f8f8f8;
  cursor: pointer;
}
.toolbar button.active {
  background: #dbeafe;
  border-color: #60a5fa;
}
</style> 