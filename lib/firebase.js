// Client-side only Firebase initialization
let auth, db, dbFirestore, storage

if (process.client) {
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
}

export { auth, db, dbFirestore, storage } 