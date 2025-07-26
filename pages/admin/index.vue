<template>
  <div>
    <h2>Admin Dashboard Home</h2>
    <div v-if="user">
      <p>Signed in as: {{ user.email }}</p>
      <button @click="logout">Logout</button>
    </div>
    <NuxtLink to="/admin/create" class="block my-4 p-2 bg-blue-600 text-white w-max">Create New Article</NuxtLink>
    <NuxtLink to="/admin/create" class="block my-2 p-2 bg-red-600 text-white w-max">Test Create Link</NuxtLink>
    <div v-if="loading">Loading articles...</div>
    <div v-else>
      <h3>Articles</h3>
      <ul>
        <li v-for="(article, id) in articles" :key="id" class="mb-2">
          <strong>{{ article.title }}</strong>
          <span class="text-gray-500 text-xs">
            by {{ article.author || 'Unknown' }}
            ({{ new Date(article.createdAt).toLocaleString() }})
          </span>
          <NuxtLink :to="`/admin/edit/${id}`" class="ml-2 text-blue-600 underline">Edit</NuxtLink>
        </li>
      </ul>
      <div v-if="!Object.keys(articles).length">No articles found.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'
import { db } from '~/lib/firebase'
import { ref as dbRef, get } from 'firebase/database'

// Explicitly define middleware for this page
definePageMeta({
  middleware: 'auth'
})

const { user, logout } = useFirebaseAuth()
const articles = ref({})
const loading = ref(true)

onMounted(async () => {
  try {
    const snap = await get(dbRef(db, 'articles'))
    if (snap.exists()) {
      articles.value = snap.val()
    }
  } finally {
    loading.value = false
  }
})
</script> 