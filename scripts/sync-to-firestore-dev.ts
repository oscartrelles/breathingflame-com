#!/usr/bin/env tsx

/**
 * Development Sync Script: en.json → Firestore
 * 
 * This script syncs content from en.json back to Firestore during development.
 * It's designed to be independent of deployment routines and used only for dev sync.
 * 
 * Usage:
 *   npm run sync:dev                    # Sync all collections
 *   npm run sync:dev -- --programs     # Sync only programs
 *   npm run sync:dev -- --pages        # Sync only pages
 *   npm run sync:dev -- --clear        # Clear collections before sync
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

interface SyncOptions {
  collections: string[]
  clear: boolean
  dryRun: boolean
}

async function syncToFirestore(options: SyncOptions) {
  console.log('🔄 Starting development sync: en.json → Firestore')
  console.log(`📋 Collections: ${options.collections.join(', ')}`)
  console.log(`🗑️  Clear first: ${options.clear}`)
  console.log(`🧪 Dry run: ${options.dryRun}\n`)

  // Load en.json
  const enJsonPath = join(process.cwd(), 'src/content/en.json')
  const enJson = JSON.parse(readFileSync(enJsonPath, 'utf8'))

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

  for (const collectionName of options.collections) {
    console.log(`\n📊 Syncing ${collectionName}...`)

    if (options.clear) {
      console.log(`  🗑️  Clearing existing ${collectionName} documents...`)
      if (!options.dryRun) {
        const snapshot = await getDocs(collection(db, collectionName))
        const batch = writeBatch(db)
        snapshot.docs.forEach(doc => batch.delete(doc.ref))
        await batch.commit()
        console.log(`  ✅ Cleared ${snapshot.docs.length} documents`)
      } else {
        console.log(`  🧪 [DRY RUN] Would clear existing documents`)
      }
    }

    // Handle different collection types
    if (collectionName === 'pages') {
      await syncPages(db, enJson, options.dryRun)
    } else if (['programs', 'experiences', 'solutions', 'posts', 'testimonials'].includes(collectionName)) {
      await syncCollection(db, collectionName, enJson[collectionName] || [], options.dryRun)
    } else {
      console.log(`  ⚠️  Unknown collection: ${collectionName}`)
    }
  }

  console.log('\n✅ Development sync completed!')
}

async function syncPages(db: any, enJson: any, dryRun: boolean) {
  // Pages are now under the 'pages' object in en.json
  const pageKeys = ['home', 'about', 'individuals', 'organizations', 'programs', 'testimonials', 
                   'search', 'notFound', 'resources', 'events', 'press', 'community', 'contact', 
                   'igniteYourFlame', 'peakEnergyProfiler']
  
  const pages = pageKeys
    .filter(key => enJson.pages && enJson.pages[key])
    .map(key => ({ id: key, ...enJson.pages[key] }))

  console.log(`  📄 Found ${pages.length} pages to sync`)

  for (const page of pages) {
    console.log(`  📝 Syncing page: ${page.id}`)
    
    if (!dryRun) {
      await setDoc(doc(db, 'pages', page.id), page)
      console.log(`    ✅ Updated ${page.id}`)
    } else {
      console.log(`    🧪 [DRY RUN] Would update ${page.id}`)
    }
  }
}

async function syncCollection(db: any, collectionName: string, items: any[], dryRun: boolean) {
  console.log(`  📦 Found ${items.length} ${collectionName} to sync`)

  for (const item of items) {
    if (!item.id) {
      console.log(`    ⚠️  Skipping item without ID:`, item)
      continue
    }

    console.log(`  📝 Syncing ${collectionName}: ${item.id}`)
    
    if (!dryRun) {
      await setDoc(doc(db, collectionName, item.id), item)
      console.log(`    ✅ Updated ${item.id}`)
    } else {
      console.log(`    🧪 [DRY RUN] Would update ${item.id}`)
    }
  }
}

// Parse command line arguments
function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)
  
  const collections = []
  let clear = false
  let dryRun = false

  for (const arg of args) {
    if (arg === '--clear') {
      clear = true
    } else if (arg === '--dry-run') {
      dryRun = true
    } else if (arg.startsWith('--')) {
      const collection = arg.substring(2)
      if (['programs', 'experiences', 'solutions', 'posts', 'testimonials', 'pages'].includes(collection)) {
        collections.push(collection)
      }
    }
  }

  // Default to all collections if none specified
  if (collections.length === 0) {
    collections.push('programs', 'experiences', 'solutions', 'posts', 'testimonials', 'pages')
  }

  return { collections, clear, dryRun }
}

// Main execution
async function main() {
  try {
    const options = parseArgs()
    await syncToFirestore(options)
  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
