import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DEMO',
}

// Initialize Firebase only if we have valid config
let app: any = null
let db: any = null
let storage: any = null
let auth: any = null

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'demo-api-key') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    db = getFirestore(app)
    storage = getStorage(app)
    auth = getAuth(app)
  } else {
    console.log('Firebase not initialized - using mock data for development')
  }
} catch (error) {
  console.log('Firebase initialization failed - using mock data for development:', error)
}

export { db, storage, auth }

// Initialize Analytics only in production
export const analytics = typeof window !== 'undefined' && import.meta.env.PROD 
  ? getAnalytics(app) 
  : null

// Connect to emulators in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  try {
    // Only connect if not already connected
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', 8080)
      connectStorageEmulator(storage, 'localhost', 9199)
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    }
  } catch (error) {
    // Emulators already connected or not running
    console.log('Firebase emulators not connected:', error)
  }
}

export default app

