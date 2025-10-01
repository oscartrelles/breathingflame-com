/**
 * Admin: Migrate testimonials to support multilingual structure
 * 
 * - Detects language of existing testimonials
 * - Translates Spanish testimonials to English
 * - Adds multilingual fields to Firestore documents
 * - Processes testimonials in batches to avoid timeouts
 */

import fs from 'fs'
import path from 'path'
import process from 'process'
import admin from 'firebase-admin'
import { initializeApp as initializeClientApp, getApps as getClientApps } from 'firebase/app'
import { getFirestore as getClientFirestore, collection as clientCollection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { Translate } from '@google-cloud/translate/build/src/v2'
import { franc } from 'franc'
import dotenv from 'dotenv'

type AnyRecord = Record<string, any>

interface ProcessingStatus {
  languageDetected: boolean
  translated: boolean
  lastProcessed: string
  processingVersion: string
  error?: string
}

interface TestimonialUpdate {
  language?: string
  translatedText?: string
  hasText: boolean
  processingStatus: ProcessingStatus
}

function getEnv(varName: string): string | null {
  const value = process.env[varName]
  return value && value.length > 0 ? value : null
}

function initFirebaseAdmin(): boolean {
  // Load env from .env.local if present
  try {
    dotenv.config({ path: path.join(process.cwd(), '.env.local') })
  } catch {
    // ignore
  }

  // Support GOOGLE_APPLICATION_CREDENTIALS (service account file path)
  const gacPath = getEnv('GOOGLE_APPLICATION_CREDENTIALS')
  if (gacPath && fs.existsSync(gacPath)) {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      })
    }
    return true
  }

  const projectId = getEnv('FIREBASE_PROJECT_ID')
  const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL')
  let privateKey = getEnv('FIREBASE_PRIVATE_KEY')
  const privateKeyB64 = getEnv('FIREBASE_PRIVATE_KEY_BASE64')
  if (!privateKey && privateKeyB64) {
    try {
      privateKey = Buffer.from(privateKeyB64, 'base64').toString('utf8')
    } catch {
      // ignore
    }
  }

  if (!projectId || !clientEmail || !privateKey) {
    return false
  }

  // Handle escaped newlines in env var
  privateKey = privateKey.replace(/\\n/g, '\n')

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  }
  return true
}

async function initFirebase() {
  const adminSuccess = initFirebaseAdmin()
  if (adminSuccess) {
    console.log('🔑 Using Firebase Admin SDK')
    return { db: admin.firestore(), isAdmin: true }
  }

  // For server-side execution, try to use service account from environment
  const serviceAccount = {
    projectId: getEnv('FIREBASE_PROJECT_ID') || getEnv('VITE_FIREBASE_PROJECT_ID'),
    clientEmail: getEnv('FIREBASE_CLIENT_EMAIL'),
    privateKey: getEnv('FIREBASE_PRIVATE_KEY') || getEnv('FIREBASE_PRIVATE_KEY_BASE64')
  }

  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    try {
      let privateKey = serviceAccount.privateKey
      if (getEnv('FIREBASE_PRIVATE_KEY_BASE64')) {
        privateKey = Buffer.from(serviceAccount.privateKey, 'base64').toString('utf8')
      }
      privateKey = privateKey.replace(/\\n/g, '\n')

      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: serviceAccount.projectId,
            clientEmail: serviceAccount.clientEmail,
            privateKey: privateKey,
          }),
        })
      }
      console.log('🔑 Using Firebase Admin SDK (from env vars)')
      return { db: admin.firestore(), isAdmin: true }
    } catch (error) {
      console.log('⚠️  Admin SDK init failed, falling back to client SDK')
    }
  }

  // Fallback to client SDK
  console.log('🔑 Using Firebase Client SDK (read-only)')
  const apiKey = getEnv('VITE_FIREBASE_API_KEY')
  const authDomain = getEnv('VITE_FIREBASE_AUTH_DOMAIN')
  const projectId = getEnv('VITE_FIREBASE_PROJECT_ID')
  const storageBucket = getEnv('VITE_FIREBASE_STORAGE_BUCKET')

  if (!apiKey || !authDomain || !projectId) {
    throw new Error('Missing Firebase credentials. Need either Admin SDK credentials or VITE_FIREBASE_* credentials.')
  }

  if (getClientApps().length === 0) {
    initializeClientApp({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
    })
  }

  return { db: getClientFirestore(), isAdmin: false }
}

function detectLanguage(text: string): string {
  if (!text || text.trim().length === 0) return 'unknown'
  
  // Clean text for better detection
  const cleanText = text.replace(/[^\p{L}\p{N}\s]/gu, ' ').trim()
  if (cleanText.length < 10) return 'unknown'
  
  const detected = franc(cleanText)
  return detected === 'und' ? 'unknown' : detected
}

function hasDisplayableText(text: string): boolean {
  return text && text.trim().length > 0
}

async function translateText(text: string, targetLanguage: string = 'en'): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_TRANSLATE_API_KEY not found in environment variables')
  }

  const translate = new Translate({ key: apiKey })
  
  try {
    const [translation] = await translate.translate(text, targetLanguage)
    return translation as string
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}

function createProcessingStatus(
  languageDetected: boolean,
  translated: boolean,
  error?: string
): ProcessingStatus {
  return {
    languageDetected,
    translated,
    lastProcessed: new Date().toISOString(),
    processingVersion: '1.0',
    ...(error && { error })
  }
}

async function processTestimonial(testimonial: AnyRecord): Promise<TestimonialUpdate> {
  const text = testimonial.text || ''
  const hasText = hasDisplayableText(text)
  
  if (!hasText) {
    return {
      hasText: false,
      processingStatus: createProcessingStatus(false, false)
    }
  }

  try {
    // Detect language
    const detectedLanguage = detectLanguage(text)
    console.log(`  📝 Detected language: ${detectedLanguage} for testimonial ${testimonial.id}`)
    
    let translatedText: string | undefined
    let translated = false

    // Translate if Spanish
    if (detectedLanguage === 'spa' || detectedLanguage === 'es') {
      try {
        translatedText = await translateText(text, 'en')
        translatedText += ' (Translated from Spanish)'
        translated = true
        console.log(`  🔄 Translated Spanish testimonial ${testimonial.id}`)
      } catch (error) {
        console.error(`  ❌ Translation failed for ${testimonial.id}:`, error)
        translatedText = text // Fallback to original
      }
    }

    return {
      language: detectedLanguage,
      translatedText,
      hasText: true,
      processingStatus: createProcessingStatus(true, translated)
    }
  } catch (error) {
    console.error(`  ❌ Processing failed for ${testimonial.id}:`, error)
    return {
      hasText: true,
      processingStatus: createProcessingStatus(false, false, error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

async function migrateTestimonials(dryRun: boolean = false) {
  console.log('🚀 Starting testimonial multilingual migration...')
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`)
  
  const { db, isAdmin } = await initFirebase()
  
  if (!isAdmin && !dryRun) {
    console.log('⚠️  Using Client SDK for updates (limited permissions)')
  }
  
  // Check for Google Translate API key
  if (!process.env.GOOGLE_TRANSLATE_API_KEY && !dryRun) {
    console.error('❌ GOOGLE_TRANSLATE_API_KEY not found in environment variables')
    console.log('💡 Add GOOGLE_TRANSLATE_API_KEY to your .env.local file')
    process.exit(1)
  }

  try {
    // Fetch all testimonials
    console.log('📖 Fetching testimonials from Firestore...')
    let testimonials: AnyRecord[]
    
    if (isAdmin) {
      const testimonialsSnapshot = await db.collection('testimonials').get()
      testimonials = testimonialsSnapshot.docs.map(doc => ({ 
        docId: doc.id,  // Use actual Firestore document ID
        id: doc.data().id || doc.id,  // Keep the custom id field as fallback
        ...doc.data() 
      }))
    } else {
      const testimonialsSnapshot = await getDocs(clientCollection(db, 'testimonials'))
      testimonials = testimonialsSnapshot.docs.map(doc => ({ 
        docId: doc.id,  // Use actual Firestore document ID
        id: doc.data().id || doc.id,  // Keep the custom id field as fallback
        ...doc.data() 
      }))
    }
    
    console.log(`📊 Found ${testimonials.length} testimonials to process`)

    // Process testimonials in batches
    const batchSize = 5 // Small batch size to avoid API rate limits
    let processed = 0
    let errors = 0

    for (let i = 0; i < testimonials.length; i += batchSize) {
      const batch = testimonials.slice(i, i + batchSize)
      console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(testimonials.length / batchSize)}`)
      
      const batchPromises = batch.map(async (testimonial) => {
        try {
          console.log(`  📝 Processing testimonial: ${testimonial.id}`)
          const update = await processTestimonial(testimonial)
          
          if (!dryRun && isAdmin) {
            // Filter out undefined values for Firestore
            const filteredUpdate = Object.fromEntries(
              Object.entries(update).filter(([_, value]) => value !== undefined)
            )
            await db.collection('testimonials').doc(testimonial.docId).update(filteredUpdate)
            console.log(`  ✅ Updated testimonial: ${testimonial.docId}`)
          } else if (!dryRun && !isAdmin) {
            // Filter out undefined values for Firestore
            const filteredUpdate = Object.fromEntries(
              Object.entries(update).filter(([_, value]) => value !== undefined)
            )
            // Use the same db instance for both reading and writing
            const testimonialRef = doc(db, 'testimonials', testimonial.docId)
            await updateDoc(testimonialRef, filteredUpdate)
            console.log(`  ✅ Updated testimonial: ${testimonial.docId}`)
          } else {
            console.log(`  🔍 Would update testimonial: ${testimonial.id}`)
            console.log(`    - Language: ${update.language || 'unknown'}`)
            console.log(`    - Has text: ${update.hasText}`)
            console.log(`    - Translated: ${update.translatedText ? 'Yes' : 'No'}`)
          }
          
          processed++
        } catch (error) {
          if (error instanceof Error && error.message.includes('NOT_FOUND')) {
            console.log(`  ⚠️  Testimonial ${testimonial.docId} not found in Firestore (may have been deleted)`)
          } else {
            console.error(`  ❌ Error processing ${testimonial.docId}:`, error)
          }
          errors++
        }
      })

      await Promise.all(batchPromises)
      
      // Small delay between batches to respect API rate limits
      if (i + batchSize < testimonials.length) {
        console.log('  ⏳ Waiting 2 seconds before next batch...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.log(`\n✅ Migration completed!`)
    console.log(`📊 Processed: ${processed}`)
    console.log(`❌ Errors: ${errors}`)
    
    if (dryRun) {
      console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.')
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

// Run migration
migrateTestimonials(dryRun).catch((error) => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})
