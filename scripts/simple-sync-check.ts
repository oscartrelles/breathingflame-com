#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function checkSync() {
  console.log('🔍 Checking Firestore ↔ en.json sync...\n')

  // Load en.json
  const enJsonPath = path.join(process.cwd(), 'src/content/en.json')
  const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'))

  // Connect to Firestore
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  // Check key collections
  const collections = ['programs', 'experiences', 'solutions', 'posts', 'testimonials']
  let allGood = true

  for (const collectionName of collections) {
    console.log(`📊 Checking ${collectionName}...`)
    
    const snapshot = await getDocs(collection(db, collectionName))
    const firestoreCount = snapshot.docs.length
    const jsonCount = Array.isArray(enJson[collectionName]) ? enJson[collectionName].length : 0

    if (firestoreCount === jsonCount) {
      console.log(`  ✅ ${collectionName}: ${firestoreCount} items (sync)`)
    } else {
      console.log(`  ❌ ${collectionName}: Firestore=${firestoreCount}, JSON=${jsonCount} (MISMATCH)`)
      allGood = false
    }
  }

  // Check pages (they're spread at top level in en.json)
  console.log(`📊 Checking pages...`)
  const pagesSnapshot = await getDocs(collection(db, 'pages'))
  const firestorePagesCount = pagesSnapshot.docs.length
  
  // Count pages in en.json (look for page keys like home, about, individuals, etc.)
  const pageKeys = ['home', 'about', 'individuals', 'organizations', 'programs', 'testimonials', 'search', 'notFound', 'resources', 'events', 'press', 'community', 'contact', 'igniteYourFlame', 'peakEnergyProfiler']
  const jsonPagesCount = pageKeys.filter(key => enJson[key]).length

  if (firestorePagesCount === jsonPagesCount) {
    console.log(`  ✅ pages: ${firestorePagesCount} items (sync)`)
  } else {
    console.log(`  ❌ pages: Firestore=${firestorePagesCount}, JSON=${jsonPagesCount} (MISMATCH)`)
    allGood = false
  }

  console.log(`\n${allGood ? '✅ All collections in sync!' : '❌ Sync issues detected - run npm run content:export'}`)
}

checkSync().catch(console.error)
