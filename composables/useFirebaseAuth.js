import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { useState } from '#app'
import { auth } from '~/lib/firebase'

export function useFirebaseAuth() {
  const user = useState('fbUser', () => null)

  // Always listen for auth state changes on client side
  if (process.client) {
    onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed:', u ? `Logged in as ${u.email}` : 'Logged out')
      user.value = u
    })
  }

  const loginWithGoogle = async () => {
    try {
      console.log('Starting Google login...')
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
    try {
      await signOut(auth)
      console.log('Logout successful')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return { user, loginWithGoogle, logout }
} 