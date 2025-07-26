export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client-side to avoid SSR issues
  if (process.client) {
    // Use the composable which now handles Firebase initialization properly
    const { useFirebaseAuth } = require('~/composables/useFirebaseAuth')
    const { user } = useFirebaseAuth()
    
    console.log('Auth middleware running for route:', to.path)
    console.log('Current user state:', user.value ? `Logged in as ${user.value.email}` : 'Not logged in')
    
    if (!user.value) {
      console.log('No user found, redirecting to login')
      return navigateTo('/admin/login')
    }
    
    console.log('User authenticated, allowing access')
  }
}) 