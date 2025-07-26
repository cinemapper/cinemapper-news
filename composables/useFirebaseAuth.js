import { useState } from '#app'

export function useFirebaseAuth() {
  const user = useState('fbUser', () => null)

  // Client-side only Firebase operations
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