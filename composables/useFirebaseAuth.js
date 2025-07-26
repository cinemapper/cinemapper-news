import { ref } from 'vue'

export function useFirebaseAuth() {
  // Use a simple ref for SPA mode - no SSR issues
  const user = ref(null)

  // Only run on client-side
  if (process.client) {
    // Use the new Firebase initialization method
    import('~/lib/firebase').then(async ({ getFirebaseServices }) => {
      const { auth } = await getFirebaseServices()
      if (auth) {
        const { onAuthStateChanged } = await import('firebase/auth')
        onAuthStateChanged(auth, (u) => {
          console.log('Auth state changed:', u ? `Logged in as ${u.email}` : 'Logged out')
          user.value = u
        })
      }
    }).catch(error => {
      console.error('Failed to initialize Firebase auth:', error)
    })
  }

  const loginWithGoogle = async () => {
    if (!process.client) return null
    
    try {
      console.log('Starting Google login...')
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth')
      const { getFirebaseServices } = await import('~/lib/firebase')
      const { auth } = await getFirebaseServices()
      
      if (!auth) throw new Error('Firebase auth not initialized')
      
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('Google login successful:', result.user.email)
      return result.user
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    if (!process.client) return
    
    try {
      const { signOut } = await import('firebase/auth')
      const { getFirebaseServices } = await import('~/lib/firebase')
      const { auth } = await getFirebaseServices()
      
      if (!auth) throw new Error('Firebase auth not initialized')
      
      await signOut(auth)
      console.log('Logout successful')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return { user, loginWithGoogle, logout }
} 