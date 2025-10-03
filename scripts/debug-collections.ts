import 'dotenv/config'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore'

async function debugCollections() {
  console.log('🔍 Debugging Firestore collections...')
  
  const app = initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  })
  
  const db = getFirestore(app)
  
  try {
    // Test basic connection
    console.log('🔗 Testing Firebase connection...')
    
    // Try to read from a known collection (programs)
    const programsSnapshot = await getDocs(collection(db, 'programs'))
    console.log(`📊 Found ${programsSnapshot.docs.length} programs`)
    
    // Try to read from testimonials
    const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'))
    console.log(`📊 Found ${testimonialsSnapshot.docs.length} testimonials`)
    
    // List first few testimonials if any exist
    if (testimonialsSnapshot.docs.length > 0) {
      console.log('\n📝 First few testimonials:')
      testimonialsSnapshot.docs.slice(0, 3).forEach((doc, index) => {
        console.log(`   ${index + 1}. ID: ${doc.id}`)
        console.log(`      Data keys: ${Object.keys(doc.data()).join(', ')}`)
      })
    }
    
    // Test write permissions with correct method
    console.log('\n🧪 Testing write permissions...')
    const testDocRef = doc(db, 'testimonials', 'test-write-permission')
    try {
      await setDoc(testDocRef, { test: true, timestamp: new Date() })
      console.log('✅ Write test successful - we have write permissions')
      
      // Clean up
      await deleteDoc(testDocRef)
      console.log('✅ Cleanup successful')
    } catch (error) {
      console.log('❌ Write test failed:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

debugCollections()


