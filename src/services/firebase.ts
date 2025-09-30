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

// Debug: Log the Firebase config
console.log('🔧 Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'SET' : 'MISSING',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId,
})

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
    console.log('✅ Firebase initialized successfully')
  } else {
    console.log('❌ Firebase not initialized - invalid API key')
  }
} catch (error) {
  console.log('❌ Firebase initialization failed:', error)
}

export { db, storage, auth }

// Initialize Analytics only in production
export const analytics = typeof window !== 'undefined' && import.meta.env.PROD 
  ? getAnalytics(app) 
  : null

// Connect to emulators only when explicitly enabled
const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'
if (import.meta.env.DEV && useEmulators && typeof window !== 'undefined') {
  try {
    if (db) connectFirestoreEmulator(db, 'localhost', 8080)
    if (storage) connectStorageEmulator(storage, 'localhost', 9199)
    if (auth) connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  } catch (error) {
    console.log('Firebase emulators not connected:', error)
  }
}

export default app

