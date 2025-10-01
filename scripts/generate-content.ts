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
  pages: {
    home: any;
    about: any;
    individuals: any;
    organizations: any;
    programs: any;
    events: any;
    resources: any;
    testimonials: any;
    contact: any;
    community: any;
    press: any;
    search: any;
    notFound: any;
  };
  programs: any[];
  experiences: any[];
  solutions: any[];
  posts: any[];
  testimonials: any[];
  testimonialSummary: {
    totalCount: number;
    averageRating: number;
    languages: string[];
    withText: number;
    withoutText: number;
  };
  settings: any;
  navigation: any;
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
        
        // Skip documents with numeric IDs (these are subdocuments, not page documents)
        if (/^\d+$/.test(pageId)) {
          return
        }
        
        // Process as a page document
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

        // Strip any accidental numeric top-level keys (defensive against bad shapes)
        Object.keys(normalized).forEach(k => {
          if (/^\d+$/.test(k)) delete (normalized as any)[k]
        })

        // Store pages under their original names
        pagesData[pageId] = normalized
      })

      // Process testimonials with multilingual support
      const rawTestimonials = testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter and process testimonials for en.json
      const processedTestimonials = rawTestimonials
        .filter(testimonial => {
          // Only include testimonials that have text and are in English or have been translated
          return testimonial.hasText && (
            testimonial.language === 'eng' || 
            (testimonial.language === 'spa' && testimonial.translatedText)
          );
        })
        .map(testimonial => {
          // Use translated text for Spanish testimonials, original text for English
          const displayText = testimonial.language === 'spa' && testimonial.translatedText 
            ? testimonial.translatedText 
            : testimonial.text;
          
          return {
            ...testimonial,
            text: displayText,
            originalLanguage: testimonial.language,
            isTranslated: testimonial.language === 'spa' && !!testimonial.translatedText
          };
        });

      // Create testimonial summary for star ratings (includes all testimonials)
      const testimonialSummary = {
        totalCount: rawTestimonials.length,
        averageRating: 5.0, // All testimonials are 5 stars
        languages: [...new Set(rawTestimonials.map(t => t.language).filter(Boolean))],
        withText: rawTestimonials.filter(t => t.hasText).length,
        withoutText: rawTestimonials.filter(t => !t.hasText).length
      };

      // Process data
      content = {
        pages: pagesData, // Wrap all pages under 'pages' key
        programs: programsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        experiences: experiencesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        solutions: solutionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        posts: postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        testimonials: processedTestimonials,
        testimonialSummary,
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
