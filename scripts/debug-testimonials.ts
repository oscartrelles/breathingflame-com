import 'dotenv/config'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore'

async function debugTestimonials() {
  console.log('🔍 Debugging testimonials in Firestore...')
  
  const app = initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  })
  
  const db = getFirestore(app)
  
  try {
    // Get all testimonials
    const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'))
    console.log(`📊 Found ${testimonialsSnapshot.docs.length} testimonials`)
    
    // Check first few testimonials
    const firstFew = testimonialsSnapshot.docs.slice(0, 5)
    for (const docSnapshot of firstFew) {
      console.log(`\n📝 Testimonial ID: ${docSnapshot.id}`)
      console.log(`   Data keys: ${Object.keys(docSnapshot.data()).join(', ')}`)
      
      // Try to read the document directly
      const directDoc = await getDoc(doc(db, 'testimonials', docSnapshot.id))
      console.log(`   Direct read success: ${directDoc.exists()}`)
    }
    
    // Check if we can write to a test document
    console.log('\n🧪 Testing write permissions...')
    const testDoc = doc(db, 'testimonials', 'test-write-permission')
    try {
      // This will fail if we don't have write permissions
      await testDoc.set({ test: true, timestamp: new Date() })
      console.log('✅ Write test successful - we have write permissions')
      
      // Clean up
      await testDoc.delete()
      console.log('✅ Cleanup successful')
    } catch (error) {
      console.log('❌ Write test failed:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

debugTestimonials()


