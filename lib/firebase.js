// Client-side Firebase initialization without top-level await
let auth, db, dbFirestore, storage
let firebaseInitialized = false

// Initialize Firebase on client-side
async function initializeFirebaseIfNeeded() {
  if (typeof window === 'undefined' || firebaseInitialized) {
    return { auth, db, dbFirestore, storage }
  }

  try {
    const { initializeApp } = await import('firebase/app')
    const { getAuth } = await import('firebase/auth')
    const { getDatabase } = await import('firebase/database')
    const { getFirestore } = await import('firebase/firestore')
    const { getStorage } = await import('firebase/storage')

    const firebaseConfig = {
      apiKey: "AIzaSyBSvu6WuGyE26uow9sllrV_Rz6SAIJh5vQ",
      authDomain: "cinemapper-44cff.firebaseapp.com",
      databaseURL: "https://cinemapper-44cff-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "cinemapper-44cff",
      storageBucket: "cinemapper-44cff.appspot.com",
      messagingSenderId: "625450796704",
      appId: "1:625450796704:web:0ba52793fe12812811abc5",
      measurementId: "G-Y890CQLMW5"
    }

    const app = initializeApp(firebaseConfig)

    auth = getAuth(app)
    db = getDatabase(app)
    dbFirestore = getFirestore(app)
    storage = getStorage(app)
    
    firebaseInitialized = true
  } catch (error) {
    console.error('Failed to initialize Firebase:', error)
  }

  return { auth, db, dbFirestore, storage }
}

// Export function to get Firebase services
export async function getFirebaseServices() {
  return await initializeFirebaseIfNeeded()
}

// Legacy exports for compatibility (but these will be undefined until initialized)
export { auth, db, dbFirestore, storage } 