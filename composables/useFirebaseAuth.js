import { ref } from 'vue'

export function useFirebaseAuth() {
  // Use Nuxt Firebase module's built-in auth
  const { $fire } = useNuxtApp()
  const user = ref(null)

  // Server-side and client-side auth state management
  if (process.client) {
    // Client-side auth state listener
    $fire.auth.onAuthStateChanged((authUser) => {
      user.value = authUser
      console.log('Auth state changed:', authUser ? `Logged in as ${authUser.email}` : 'Logged out')
    })
  }

  const loginWithGoogle = async () => {
    try {
      console.log('Starting Google login...')
      const provider = new $fire.auth.GoogleAuthProvider()
      const result = await $fire.auth.signInWithPopup(provider)
      console.log('Google login successful:', result.user.email)
      return result.user
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await $fire.auth.signOut()
      console.log('Logout successful')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return { user, loginWithGoogle, logout }
} 