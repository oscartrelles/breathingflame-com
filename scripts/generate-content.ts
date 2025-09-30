#!/usr/bin/env tsx

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

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

interface ContentData {
  home: any;
  programs: any[];
  experiences: any[];
  solutions: any[];
  posts: any[];
  testimonials: any[];
  settings: any;
  navigation: any;
  pageIndividuals: any;
  pageOrganizations: any;
  pagePrograms: any;
  pageEvents: any;
  pageResources: any;
  pageTestimonials: any;
  pageContact: any;
  pageCommunity: any;
  pagePress: any;
  about: any;
  lastUpdated: string;
}

async function generateContent(): Promise<void> {
  console.log('🚀 Starting content generation...');
  
  try {
    // Check if Firestore is available
    let useFirestore = true;
    try {
      await getDoc(doc(db, 'settings', 'main'));
    } catch (error) {
      console.warn('⚠️  Firestore not available, using fallback content');
      useFirestore = false;
    }

    let content: ContentData;

    if (useFirestore) {
      // Fetch all collections in parallel
      const [
        programsSnapshot,
        experiencesSnapshot,
        solutionsSnapshot,
        postsSnapshot,
        testimonialsSnapshot,
        pagesSnapshot,
        settingsDoc,
        navigationDoc
      ] = await Promise.all([
        getDocs(collection(db, 'programs')),
        getDocs(collection(db, 'experiences')),
        getDocs(collection(db, 'solutions')),
        getDocs(collection(db, 'posts')),
        getDocs(collection(db, 'testimonials')),
        getDocs(collection(db, 'pages')),
        getDoc(doc(db, 'settings', 'main')),
        getDoc(doc(db, 'navigation', 'main'))
      ]);

      // Process pages collection - normalize hero.media and strip legacy media fields
      const pagesData: any = {}
      pagesSnapshot.docs.forEach(pageDoc => {
        const pageId = pageDoc.id
        const raw = { id: pageId, ...pageDoc.data() } as any
        const hero = raw.hero || {}
        const media = hero.media || {
          imageUrl: hero.imageUrl || '',
          videoEmbed: hero.videoEmbed || '',
          videoId: hero.videoId || ''
        }
        const normalizedHero = {
          ...hero,
          media,
        }
        // Remove legacy fields
        delete (normalizedHero as any).imageUrl
        delete (normalizedHero as any).videoEmbed
        delete (normalizedHero as any).videoId
        const normalized = { ...raw, hero: normalizedHero }

        // For pages that conflict with collection names, use different keys in en.json
        const outputKey = pageId === 'programs' ? 'pagePrograms' : 
                         pageId === 'testimonials' ? 'pageTestimonials' :
                         pageId
        pagesData[outputKey] = normalized
      })

      // Process data
      content = {
        ...pagesData, // Spread all pages (home, about, individuals, etc.)
        programs: programsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        experiences: experiencesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        solutions: solutionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        posts: postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        testimonials: testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        settings: settingsDoc.exists() ? settingsDoc.data() : null,
        navigation: navigationDoc.exists() ? navigationDoc.data() : null,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Use fallback content from existing en.json
      console.log('📄 Using fallback content from en.json');
      const fallbackContent = await import('../src/content/en.json');
      content = fallbackContent.default;
      content.lastUpdated = new Date().toISOString();
    }

    // Create content directory if it doesn't exist
    const contentDir = join(process.cwd(), 'src', 'content');
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true });
    }

    // Write content files
    const enContentPath = join(contentDir, 'en.json');
    writeFileSync(enContentPath, JSON.stringify(content, null, 2));
    
    console.log(`✅ Content generated successfully!`);
    console.log(`📁 Written to: ${enContentPath}`);
    console.log(`📊 Generated ${content.programs.length} programs, ${content.experiences.length} experiences, ${content.solutions.length} solutions, ${content.posts.length} posts`);
    console.log(`🕒 Last updated: ${content.lastUpdated}`);

  } catch (error) {
    console.error('❌ Error generating content:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateContent();
}

export { generateContent };
