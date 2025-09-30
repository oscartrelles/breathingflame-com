#!/usr/bin/env tsx

import dotenv from 'dotenv'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp as initializeClientApp } from 'firebase/app'
import { getFirestore as getClientFirestore, collection, getDocs } from 'firebase/firestore'
import fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config({ path: '.env.local' })

interface DatabaseStructure {
  collections: {
    [collectionName: string]: {
      documentCount: number
      documentIds: string[]
      sampleDocument?: any
    }
  }
  summary: {
    totalCollections: number
    totalDocuments: number
    timestamp: string
  }
  expectedCollections: string[]
  foundCollections: string[]
  missingCollections: string[]
  extraCollections: string[]
}

async function initializeFirebase() {
  // Try Firebase Admin SDK first
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    console.log('🔧 Using Firebase Admin SDK...')
    
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }

    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
    }
    
    return getFirestore()
  }

  // Fallback to Firebase Client SDK (read-only)
  if (process.env.VITE_FIREBASE_API_KEY) {
    console.log('🔧 Using Firebase Client SDK (read-only)...')
    
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
    }

    const app = initializeClientApp(firebaseConfig)
    return getClientFirestore(app)
  }

  throw new Error('No Firebase credentials found. Please set FIREBASE_* or VITE_FIREBASE_* environment variables.')
}

async function documentDatabaseStructure() {
  try {
    console.log('🚀 Documenting Final Database Structure...\n')

    const db = await initializeFirebase()

    const structure: DatabaseStructure = {
      collections: {},
      summary: {
        totalCollections: 0,
        totalDocuments: 0,
        timestamp: new Date().toISOString()
      },
      expectedCollections: [],
      foundCollections: [],
      missingCollections: [],
      extraCollections: []
    }

    // Get all collections by trying to list documents from known collection names
    const knownCollections = [
      'pages',
      'programs', 
      'experiences',
      'solutions',
      'posts',
      'testimonials',
      'navigation',
      'settings',
      'testimonialMappings',
      'testimonialTags'
    ]
    structure.expectedCollections = [...knownCollections]

    console.log('📊 Scanning collections...')

    for (const collectionName of knownCollections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName))
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }))

        structure.collections[collectionName] = {
          documentCount: documents.length,
          documentIds: documents.map(doc => doc.id),
          sampleDocument: documents.length > 0 ? documents[0].data : undefined
        }

        console.log(`  ✓ ${collectionName}: ${documents.length} documents`)
        
        if (documents.length > 0) {
          console.log(`    - Document IDs: ${documents.map(doc => doc.id).join(', ')}`)
        }

      } catch (error) {
        console.log(`  ⚠️ ${collectionName}: Error accessing (${error})`)
        structure.collections[collectionName] = {
          documentCount: 0,
          documentIds: [],
          sampleDocument: undefined
        }
      }
    }

    // Calculate summary
    structure.summary.totalCollections = Object.keys(structure.collections).length
    structure.summary.totalDocuments = Object.values(structure.collections)
      .reduce((sum, collection) => sum + collection.documentCount, 0)

    // Compute found/missing/extra
    structure.foundCollections = Object.keys(structure.collections).filter(name => structure.collections[name].documentCount > 0)
    structure.missingCollections = structure.expectedCollections.filter(name => !structure.foundCollections.includes(name))
    structure.extraCollections = structure.foundCollections.filter(name => !structure.expectedCollections.includes(name))

    // Write structure report
    const publicDir = path.join(process.cwd(), 'public', 'data')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    const reportPath = path.join(publicDir, 'database-structure.json')
    fs.writeFileSync(reportPath, JSON.stringify(structure, null, 2))

    // Generate markdown summary
    const markdownPath = path.join(publicDir, 'database-structure.md')
    const markdown = generateMarkdownReport(structure)
    fs.writeFileSync(markdownPath, markdown)

    console.log(`\n✅ Database structure documented successfully!`)
    console.log(`📊 Summary:`)
    console.log(`   - Collections: ${structure.summary.totalCollections}`)
    console.log(`   - Total Documents: ${structure.summary.totalDocuments}`)
    console.log(`\n📁 Files created:`)
    console.log(`   - ${reportPath}`)
    console.log(`   - ${markdownPath}`)

    return structure

  } catch (error) {
    console.error('❌ Error documenting database structure:', error)
    throw error
  }
}

function generateMarkdownReport(structure: DatabaseStructure): string {
  let markdown = `# Database Structure Report\n\n`
  markdown += `Generated: ${structure.summary.timestamp}\n\n`

  markdown += `## Summary\n\n`
  markdown += `- **Total Collections:** ${structure.summary.totalCollections}\n`
  markdown += `- **Total Documents:** ${structure.summary.totalDocuments}\n\n`

  markdown += `## Collections\n\n`

  Object.entries(structure.collections).forEach(([name, collection]) => {
    markdown += `### ${name}\n`
    markdown += `- **Document Count:** ${collection.documentCount}\n`
    
    if (collection.documentIds.length > 0) {
      markdown += `- **Document IDs:** ${collection.documentIds.join(', ')}\n`
    }
    
    if (collection.sampleDocument) {
      markdown += `- **Sample Document Keys:** ${Object.keys(collection.sampleDocument).join(', ')}\n`
    }
    
    markdown += `\n`
  })

  markdown += `## Expected Structure\n\n`
  markdown += `Expected collections (machine-readable): ${JSON.stringify(structure.expectedCollections)}\n\n`

  markdown += `## Cleanup Status\n\n`
  if (structure.missingCollections.length === 0 && structure.extraCollections.length === 0) {
    markdown += `✅ **Perfect!** All expected collections are present with no extra collections.\n\n`
  } else {
    if (structure.missingCollections.length > 0) {
      markdown += `❌ **Missing Collections:** ${structure.missingCollections.join(', ')}\n\n`
    }
    if (structure.extraCollections.length > 0) {
      markdown += `⚠️ **Extra Collections:** ${structure.extraCollections.join(', ')}\n\n`
    }
  }

  return markdown
}

async function main() {
  try {
    await documentDatabaseStructure()
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

main()
