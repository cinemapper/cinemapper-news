// Firebase Auth service worker for Nuxt Firebase SSR
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-auth-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyBSvu6WuGyE26uow9sllrV_Rz6SAIJh5vQ",
  authDomain: "cinemapper-44cff.firebaseapp.com",
  databaseURL: "https://cinemapper-44cff-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cinemapper-44cff",
  storageBucket: "cinemapper-44cff.appspot.com",
  messagingSenderId: "625450796704",
  appId: "1:625450796704:web:0ba52793fe12812811abc5",
  measurementId: "G-Y890CQLMW5"
})

// Handle background auth state changes
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in
    console.log('Service Worker: User signed in', user.uid)
  } else {
    // User is signed out
    console.log('Service Worker: User signed out')
  }
}) 