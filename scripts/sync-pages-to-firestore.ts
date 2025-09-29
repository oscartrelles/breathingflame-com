#!/usr/bin/env tsx

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { join } from 'path'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env.local') })

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function syncPagesToFirestore() {
  console.log('🔄 Syncing pages to Firestore...')
  
  try {
    // Read the static content
    const contentPath = join(process.cwd(), 'src/content/en.json')
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
    
    // Define page singletons
    const pageSingletons = [
      'pageHome', 'pageAbout', 'pageIndividuals', 'pageOrganizations', 
      'pagePrograms', 'pageResources', 'pageTestimonials', 'pageCommunity', 
      'pagePress', 'pageContact'
    ]
    
    console.log(`📄 Syncing ${pageSingletons.length} page singletons...`)
    for (const pageId of pageSingletons) {
      if (content[pageId]) {
        await setDoc(doc(db, 'singletons', pageId), {
          ...content[pageId],
          updatedAt: new Date().toISOString()
        })
        console.log(`✅ Synced ${pageId}`)
      } else {
        console.log(`⚠️  ${pageId} not found in content`)
      }
    }
    
    // Sync navigation and settings if they exist
    if (content.navigation) {
      await setDoc(doc(db, 'singletons', 'navigation'), {
        ...content.navigation,
        updatedAt: new Date().toISOString()
      })
      console.log('✅ Synced navigation')
    }
    
    if (content.settings) {
      await setDoc(doc(db, 'singletons', 'settings'), {
        ...content.settings,
        updatedAt: new Date().toISOString()
      })
      console.log('✅ Synced settings')
    }
    
    console.log('✅ Pages synced successfully!')
    
  } catch (error) {
    console.error('❌ Error syncing pages:', error)
  }
}

syncPagesToFirestore().catch(console.error)

