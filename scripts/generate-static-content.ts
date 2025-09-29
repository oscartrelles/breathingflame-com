#!/usr/bin/env tsx

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { writeFileSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

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

interface StaticContent {
  [key: string]: any
}

async function generateStaticContent() {
  console.log('🔄 Generating static content from Firestore...')
  
  const staticContent: StaticContent = {}
  
  try {
    // Collections to export
    const collections = ['programs', 'experiences', 'solutions', 'posts', 'testimonials']
    
    // Export collections
    for (const collectionName of collections) {
      console.log(`📦 Exporting ${collectionName}...`)
      const collectionRef = collection(db, collectionName)
      const snapshot = await getDocs(collectionRef)
      
      const items: any[] = []
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      staticContent[collectionName] = items
      console.log(`✅ Exported ${items.length} ${collectionName}`)
    }
    
    // Export singletons (page data)
    const singletons = [
      'pageHome',
      'pageAbout', 
      'pageIndividuals',
      'pageOrganizations',
      'pagePrograms',
      'pageEvents',
      'pageResources',
      'pageTestimonials',
      'pageContact',
      'pageCommunity',
      'pagePress',
      'navigation',
      'settings'
    ]
    
    for (const singletonName of singletons) {
      console.log(`📄 Exporting ${singletonName}...`)
      const docRef = doc(db, 'singletons', singletonName)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        staticContent[singletonName] = {
          id: docSnap.id,
          ...docSnap.data()
        }
        console.log(`✅ Exported ${singletonName}`)
      } else {
        console.log(`⚠️  ${singletonName} not found in Firestore`)
      }
    }
    
    // Write to static file
    const outputPath = join(process.cwd(), 'src', 'content', 'en.json')
    writeFileSync(outputPath, JSON.stringify(staticContent, null, 2))
    
    console.log(`✅ Static content generated successfully at ${outputPath}`)
    console.log(`📊 Total collections: ${collections.length}`)
    console.log(`📊 Total singletons: ${singletons.length}`)
    
  } catch (error) {
    console.error('❌ Error generating static content:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticContent()
}

export { generateStaticContent }
