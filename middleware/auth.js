export default defineNuxtRouteMiddleware(async (to, from) => {
  // Simple client-side auth check for SPA mode
  if (process.client) {
    try {
      // Use dynamic import instead of require
      const { useFirebaseAuth } = await import('~/composables/useFirebaseAuth')
      const { user } = useFirebaseAuth()
      
      console.log('Auth middleware running for route:', to.path)
      console.log('Current user state:', user.value ? `Logged in as ${user.value.email}` : 'Not logged in')
      
      if (!user.value) {
        console.log('No user found, redirecting to login')
        return navigateTo('/admin/login')
      }
      
      console.log('User authenticated, allowing access')
    } catch (error) {
      console.error('Auth middleware error:', error)
      return navigateTo('/admin/login')
    }
  }
}) 