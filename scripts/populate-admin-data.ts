#!/usr/bin/env tsx

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'
import { join } from 'path'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env.local') })

// Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function populateAdminData() {
  console.log('🔄 Populating Firestore with admin data...')
  
  try {
    // Read the static content
    const contentPath = join(process.cwd(), 'src/content/en.json')
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
    
    // Populate programs
    if (content.programs && Array.isArray(content.programs)) {
      console.log(`📚 Populating ${content.programs.length} programs...`)
      for (const program of content.programs) {
        await setDoc(doc(db, 'programs', program.slug || program.id), {
          ...program,
          updatedAt: new Date().toISOString()
        })
      }
    }
    
    // Populate experiences
    if (content.experiences && Array.isArray(content.experiences)) {
      console.log(`🌟 Populating ${content.experiences.length} experiences...`)
      for (const experience of content.experiences) {
        await setDoc(doc(db, 'experiences', experience.slug || experience.id), {
          ...experience,
          updatedAt: new Date().toISOString()
        })
      }
    }
    
    // Populate solutions
    if (content.solutions && Array.isArray(content.solutions)) {
      console.log(`🏢 Populating ${content.solutions.length} solutions...`)
      for (const solution of content.solutions) {
        await setDoc(doc(db, 'solutions', solution.slug || solution.id), {
          ...solution,
          updatedAt: new Date().toISOString()
        })
      }
    }
    
    // Populate page singletons
    const pageSingletons = [
      'pageHome', 'pageAbout', 'pageIndividuals', 'pageOrganizations', 
      'pagePrograms', 'pageResources', 'pageTestimonials', 'pageCommunity', 
      'pagePress', 'pageContact'
    ]
    
    console.log(`📄 Populating ${pageSingletons.length} page singletons...`)
    for (const pageId of pageSingletons) {
      if (content[pageId]) {
        await setDoc(doc(db, 'singletons', pageId), {
          ...content[pageId],
          updatedAt: new Date().toISOString()
        })
      }
    }
    
    // Populate testimonials
    if (content.testimonials && Array.isArray(content.testimonials)) {
      console.log(`💬 Populating ${content.testimonials.length} testimonials...`)
      for (const testimonial of content.testimonials) {
        await setDoc(doc(db, 'testimonials', testimonial.id || `testimonial-${Date.now()}`), {
          ...testimonial,
          updatedAt: new Date().toISOString()
        })
      }
    }
    
    console.log('✅ Admin data populated successfully!')
    
  } catch (error) {
    console.error('❌ Error populating admin data:', error)
  }
}

populateAdminData().catch(console.error)

