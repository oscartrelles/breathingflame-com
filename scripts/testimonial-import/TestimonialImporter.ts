import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { config } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../../.env.local') })

import { ImportedTestimonial, ImportConfig, ImportResult, FirestoreTestimonial } from './types'
import { ManualAdapter } from './adapters/ManualAdapter'
import { SenjaCSVAdapter } from './adapters/SenjaCSVAdapter'
import { ImageProcessor } from './processors/ImageProcessor'
import { ContentProcessorImpl } from './processors/ContentProcessor'
import { DuplicateDetectorImpl } from './processors/DuplicateDetector'

export class TestimonialImporter {
  private db: any
  private imageProcessor: ImageProcessor
  private contentProcessor: ContentProcessorImpl
  private duplicateDetector: DuplicateDetectorImpl
  private adapters: Map<string, any> = new Map()

  constructor() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID
    }

    const app = initializeApp(firebaseConfig)
    this.db = getFirestore(app)
    
    // Initialize processors
    this.imageProcessor = new ImageProcessor()
    this.contentProcessor = new ContentProcessorImpl()
    this.duplicateDetector = new DuplicateDetectorImpl()
    
    // Register adapters
    this.adapters.set('manual', new ManualAdapter())
    this.adapters.set('senja', new SenjaCSVAdapter())
    this.adapters.set('senja-csv', new SenjaCSVAdapter())
  }

  async importTestimonials(config: ImportConfig): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: 0,
      skipped: 0,
      errors: [],
      duplicates: [],
      newAvatars: [],
      summary: {
        totalProcessed: 0,
        newTestimonials: 0,
        updatedTestimonials: 0,
        failedImports: 0
      }
    }

    try {
      console.log(`🔄 Starting import from ${config.source}...`)
      
      // Get the appropriate adapter
      const adapter = this.adapters.get(config.source)
      if (!adapter) {
        throw new Error(`No adapter found for source: ${config.source}`)
      }

      // Validate credentials
      const credentialsValid = await adapter.validateCredentials(config.credentials)
      if (!credentialsValid) {
        throw new Error(`Invalid credentials for ${config.source}`)
      }

      // Import testimonials from source
      const rawTestimonials = await adapter.import(config)
      console.log(`📥 Imported ${rawTestimonials.length} raw testimonials`)

      // Process testimonials
      const processedTestimonials = await this.processTestimonials(rawTestimonials)
      console.log(`🔧 Processed ${processedTestimonials.length} testimonials`)

      // Detect and handle duplicates
      const { duplicates, unique } = await this.duplicateDetector.findDuplicates(processedTestimonials)
      console.log(`🔍 Found ${duplicates.length} duplicates, ${unique.length} unique testimonials`)

      // Download avatars
      const testimonialsWithAvatars = await this.downloadAvatars(unique)
      console.log(`🖼️ Downloaded avatars for ${testimonialsWithAvatars.length} testimonials`)

      // Save to Firestore
      const saveResult = await this.saveToFirestore(testimonialsWithAvatars)
      
      // Update result
      result.success = true
      result.imported = saveResult.newTestimonials
      result.skipped = saveResult.updatedTestimonials
      result.duplicates = duplicates.map(d => d.duplicate.id)
      result.newAvatars = saveResult.newAvatars
      result.summary = {
        totalProcessed: processedTestimonials.length,
        newTestimonials: saveResult.newTestimonials,
        updatedTestimonials: saveResult.updatedTestimonials,
        failedImports: saveResult.failedImports
      }

      console.log(`✅ Import complete: ${result.imported} new, ${result.skipped} updated, ${duplicates.length} duplicates`)
      
    } catch (error) {
      console.error('❌ Import failed:', error)
      result.errors.push({
        testimonialId: 'import',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      })
    }

    return result
  }

  private async processTestimonials(testimonials: ImportedTestimonial[]): Promise<ImportedTestimonial[]> {
    const processed: ImportedTestimonial[] = []
    
    for (const testimonial of testimonials) {
      try {
        const processedTestimonial = await this.contentProcessor.processTestimonial(testimonial)
        processed.push(processedTestimonial)
      } catch (error) {
        console.error(`Error processing testimonial ${testimonial.id}:`, error)
      }
    }
    
    return processed
  }

  private async downloadAvatars(testimonials: ImportedTestimonial[]): Promise<ImportedTestimonial[]> {
    const withAvatars: ImportedTestimonial[] = []
    
    for (const testimonial of testimonials) {
      try {
        const avatarPath = await this.imageProcessor.downloadAvatarForTestimonial(testimonial)
        if (avatarPath) {
          testimonial.author.avatar = avatarPath
        }
        withAvatars.push(testimonial)
      } catch (error) {
        console.error(`Error downloading avatar for ${testimonial.id}:`, error)
        withAvatars.push(testimonial) // Continue without avatar
      }
    }
    
    return withAvatars
  }

  private async saveToFirestore(testimonials: ImportedTestimonial[]): Promise<{
    newTestimonials: number
    updatedTestimonials: number
    failedImports: number
    newAvatars: string[]
  }> {
    let newTestimonials = 0
    let updatedTestimonials = 0
    let failedImports = 0
    const newAvatars: string[] = []

    for (const testimonial of testimonials) {
      try {
        // Check if testimonial already exists
        // 1) Prefer ID match to avoid collapsing multiple entries that share a generic source URL
        let existingSnapshot = await getDocs(
          query(collection(this.db, 'testimonials'), where('id', '==', testimonial.id))
        )

        // Do NOT fallback to sourceUrl: multiple LinkedIn rows share the same profile URL.
        
        const firestoreTestimonial: FirestoreTestimonial = {
          id: testimonial.id,
          text: testimonial.text,
          author: {
            name: testimonial.author.name,
            title: testimonial.author.title || '',
            company: testimonial.author.company || '',
            avatar: testimonial.author.avatar || ''
          },
          rating: testimonial.rating,
          verified: testimonial.verified,
          featured: testimonial.featured,
          tags: testimonial.tags,
          createdAt: {
            seconds: Math.floor(testimonial.createdAt.getTime() / 1000),
            nanoseconds: (testimonial.createdAt.getTime() % 1000) * 1000000
          },
          sourceUrl: testimonial.source.url || `imported-${testimonial.id}`
        }

        if (existingSnapshot.empty) {
          // New testimonial
          await setDoc(doc(this.db, 'testimonials', testimonial.id), firestoreTestimonial)
          newTestimonials++
          if (testimonial.author.avatar) {
            newAvatars.push(testimonial.author.avatar)
          }
        } else {
          // Update existing testimonial
          const existingDoc = existingSnapshot.docs[0]
          await setDoc(doc(this.db, 'testimonials', existingDoc.id), firestoreTestimonial, { merge: true })
          updatedTestimonials++
        }
      } catch (error) {
        console.error(`Error saving testimonial ${testimonial.id}:`, error)
        failedImports++
      }
    }

    return { newTestimonials, updatedTestimonials, failedImports, newAvatars }
  }

  async getExistingTestimonials(): Promise<FirestoreTestimonial[]> {
    try {
      const testimonialsRef = collection(this.db, 'testimonials')
      const q = query(testimonialsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirestoreTestimonial))
    } catch (error) {
      console.error('Error fetching existing testimonials:', error)
      return []
    }
  }

  async clearTestimonials(): Promise<void> {
    try {
      const testimonials = await this.getExistingTestimonials()
      const { writeBatch } = await import('firebase/firestore')
      const batch = writeBatch(this.db)
      
      for (const testimonial of testimonials) {
        const testimonialRef = doc(this.db, 'testimonials', testimonial.id)
        batch.delete(testimonialRef)
      }
      
      await batch.commit()
      console.log(`🗑️ Cleared ${testimonials.length} testimonials`)
    } catch (error) {
      console.error('Error clearing testimonials:', error)
      throw error
    }
  }
}
