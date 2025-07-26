import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
// import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

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

export const auth = getAuth(app)
export const db = getDatabase(app)
// export const analytics = getAnalytics(app)
export const dbFirestore = getFirestore(app)
export const storage = getStorage(app)