<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in with your Google account to access the admin dashboard
        </p>
      </div>
      
      <div class="mt-8 space-y-6">
        <button 
          @click="handleGoogleLogin"
          :disabled="loading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Signing in...' : 'Sign in with Google' }}
        </button>
        
        <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>
        
        <div v-if="success" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ success }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

const error = ref('')
const success = ref('')
const loading = ref(false)
const { loginWithGoogle } = useFirebaseAuth()

const handleGoogleLogin = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  
  try {
    console.log('Login button clicked')
    const user = await loginWithGoogle()
    console.log('Login completed, user:', user.email)
    
    success.value = `Successfully signed in as ${user.email}. Redirecting...`
    
    // Wait a moment to show success message, then navigate
    setTimeout(() => {
      navigateTo('/admin')
    }, 1000)
    
  } catch (e) {
    console.error('Login error:', e)
    error.value = e.message || 'Authentication failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script> 