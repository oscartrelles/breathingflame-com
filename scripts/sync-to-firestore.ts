#!/usr/bin/env tsx

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Load content from en.json
const contentPath = path.join(process.cwd(), 'src/content/en.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

interface SyncOptions {
  clearExisting?: boolean;
  collections?: string[];
}

async function clearCollection(collectionName: string): Promise<void> {
  console.log(`🗑️  Clearing ${collectionName} collection...`);
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`✅ Cleared ${snapshot.docs.length} documents from ${collectionName}`);
}

async function syncToFirestore(options: SyncOptions = {}): Promise<void> {
  const { clearExisting = false, collections } = options;
  
  console.log('🚀 Starting content sync to Firestore...');
  console.log(`📁 Source: ${contentPath}`);
  
  try {
    // Define what to sync
    const syncMap = {
      // Singletons (single documents)
      settings: content.settings,
      navigation: content.navigation,
      home: content.home,
      about: content.about,
      
      // Page singletons
      pageIndividuals: content.pageIndividuals,
      pageOrganizations: content.pageOrganizations,
      pagePrograms: content.pagePrograms,
      pageEvents: content.pageEvents,
      pageResources: content.pageResources,
      pageTestimonials: content.pageTestimonials,
      pageContact: content.pageContact,
      pageCommunity: content.pageCommunity,
      pagePress: content.pagePress,
      
      // Collections (arrays of documents)
      programs: content.programs,
      experiences: content.experiences,
      solutions: content.solutions,
      posts: content.posts,
      testimonials: content.testimonials,
    };

    // Filter collections if specified
    const collectionsToSync = collections || Object.keys(syncMap);
    
    for (const [collectionName, data] of Object.entries(syncMap)) {
      if (!collectionsToSync.includes(collectionName)) {
        console.log(`⏭️  Skipping ${collectionName} (not in filter)`);
        continue;
      }

      if (!data) {
        console.log(`⚠️  No data found for ${collectionName}, skipping...`);
        continue;
      }

      // Clear existing data if requested
      if (clearExisting) {
        await clearCollection(collectionName);
      }

      console.log(`📝 Syncing ${collectionName}...`);

      if (Array.isArray(data)) {
        // Handle collections (arrays)
        for (const item of data) {
          if (item.id) {
            await setDoc(doc(db, collectionName, item.id), item);
          } else {
            console.warn(`⚠️  Item in ${collectionName} missing ID, skipping:`, item);
          }
        }
        console.log(`✅ Synced ${data.length} items to ${collectionName}`);
      } else {
        // Handle singletons (objects)
        await setDoc(doc(db, collectionName, 'main'), data);
        console.log(`✅ Synced ${collectionName} singleton`);
      }
    }

    console.log('🎉 Content sync completed successfully!');
    
    // Show summary
    const summary = collectionsToSync.map(name => {
      const data = syncMap[name as keyof typeof syncMap];
      if (Array.isArray(data)) {
        return `   - ${name}: ${data.length} items`;
      } else if (data) {
        return `   - ${name}: 1 singleton`;
      } else {
        return `   - ${name}: 0 items (no data)`;
      }
    }).join('\n');
    
    console.log('📊 Summary:');
    console.log(summary);

  } catch (error) {
    console.error('❌ Error syncing to Firestore:', error);
    process.exit(1);
  }
}

// CLI interface
const args = process.argv.slice(2);
const options: SyncOptions = {};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--clear') {
    options.clearExisting = true;
  } else if (arg === '--collections') {
    const collectionsArg = args[i + 1];
    if (collectionsArg) {
      options.collections = collectionsArg.split(',').map(c => c.trim());
      i++; // Skip next argument as it's the collections list
    }
  } else if (arg === '--help') {
    console.log(`
Usage: tsx scripts/sync-to-firestore.ts [options]

Options:
  --clear                    Clear existing data before syncing
  --collections <list>       Comma-separated list of collections to sync
  --help                     Show this help message

Examples:
  tsx scripts/sync-to-firestore.ts
  tsx scripts/sync-to-firestore.ts --clear
  tsx scripts/sync-to-firestore.ts --collections programs,experiences
  tsx scripts/sync-to-firestore.ts --clear --collections home,about
    `);
    process.exit(0);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncToFirestore(options);
}

export { syncToFirestore };
