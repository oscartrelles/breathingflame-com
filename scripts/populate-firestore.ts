#!/usr/bin/env tsx

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

// Import comprehensive mock data and create environment-aware versions
import {
  mockSettings as baseMockSettings,
  mockNavigation as baseMockNavigation,
  mockHome as baseMockHome,
  mockPrograms,
  mockExperiences,
  mockSolutions,
  mockPosts,
  mockTestimonials,
  mockPageIndividuals,
  mockPageOrganizations,
  mockPagePrograms,
  mockPageEvents as baseMockPageEvents,
  mockPageResources,
  mockPageTestimonials,
  mockPageContact,
  mockPageCommunity as baseMockPageCommunity,
  mockPagePress,
  mockAbout
} from '../src/services/mockData';

// Create environment-aware versions of data that uses import.meta.env
const mockSettings = {
  ...baseMockSettings,
  // Override any environment-dependent fields if needed
};

const mockNavigation = {
  ...baseMockNavigation,
  // Override any environment-dependent fields if needed
};

const mockHome = {
  ...baseMockHome,
  // Override any environment-dependent fields if needed
};

const mockPageEvents = {
  ...baseMockPageEvents,
  embed: {
    ...baseMockPageEvents.embed,
    url: process.env.VITE_LUMA_EMBED_URL || 'https://luma.com/embed/calendar/cal-V27tG2UMiGzbGHH/events'
  }
};

const mockPageCommunity = {
  ...baseMockPageCommunity,
  sections: baseMockPageCommunity.sections.map(section => ({
    ...section,
    cards: section.cards.map(card => ({
      ...card,
      url: card.url?.replace('process.env.VITE_WHATSAPP_COMMUNITY_LINK', process.env.VITE_WHATSAPP_COMMUNITY_LINK || 'https://wa.me/34611006408')
        ?.replace('process.env.VITE_MEETUP_URL_1', process.env.VITE_MEETUP_URL_1 || 'https://meetup.com/breathing-flame')
        ?.replace('process.env.VITE_MEETUP_URL_2', process.env.VITE_MEETUP_URL_2 || 'https://meetup.com/breathing-flame-madrid')
        ?.replace('process.env.VITE_MEETUP_URL_3', process.env.VITE_MEETUP_URL_3 || 'https://meetup.com/breathing-flame-barcelona')
        ?.replace('process.env.VITE_MEDIUM_URL', process.env.VITE_MEDIUM_URL || 'https://medium.com/@breathingflame')
        ?.replace('process.env.VITE_SUBSTACK_URL', process.env.VITE_SUBSTACK_URL || 'https://breathingflame.substack.com')
    }))
  }))
};

async function populateFirestore(): Promise<void> {
  console.log('🚀 Starting Firestore population...');
  
  try {
    // Settings (singleton)
    console.log('📝 Adding settings...');
    await setDoc(doc(db, 'settings', 'main'), mockSettings);

    // Navigation (singleton)
    console.log('📝 Adding navigation...');
    await setDoc(doc(db, 'navigation', 'main'), mockNavigation);

    // Home (singleton)
    console.log('📝 Adding home...');
    await setDoc(doc(db, 'home', 'main'), mockHome);

    // Programs (collection)
    console.log('📝 Adding programs...');
    for (const program of mockPrograms) {
      await setDoc(doc(db, 'programs', program.id), program);
    }

    // Experiences (collection)
    console.log('📝 Adding experiences...');
    for (const experience of mockExperiences) {
      await setDoc(doc(db, 'experiences', experience.id), experience);
    }

    // Solutions (collection)
    console.log('📝 Adding solutions...');
    for (const solution of mockSolutions) {
      await setDoc(doc(db, 'solutions', solution.id), solution);
    }

    // Posts (collection)
    console.log('📝 Adding posts...');
    for (const post of mockPosts) {
      await setDoc(doc(db, 'posts', post.id), post);
    }

    // Testimonials (collection)
    console.log('📝 Adding testimonials...');
    for (const testimonial of mockTestimonials) {
      await setDoc(doc(db, 'testimonials', testimonial.id), testimonial);
    }

    // Page singletons (skip null values)
    console.log('📝 Adding page singletons...');
    if (mockPageIndividuals) await setDoc(doc(db, 'pageIndividuals', 'main'), mockPageIndividuals);
    if (mockPageOrganizations) await setDoc(doc(db, 'pageOrganizations', 'main'), mockPageOrganizations);
    if (mockPagePrograms) await setDoc(doc(db, 'pagePrograms', 'main'), mockPagePrograms);
    if (mockPageEvents) await setDoc(doc(db, 'pageEvents', 'main'), mockPageEvents);
    if (mockPageResources) await setDoc(doc(db, 'pageResources', 'main'), mockPageResources);
    if (mockPageTestimonials) await setDoc(doc(db, 'pageTestimonials', 'main'), mockPageTestimonials);
    if (mockPageContact) await setDoc(doc(db, 'pageContact', 'main'), mockPageContact);
    if (mockPageCommunity) await setDoc(doc(db, 'pageCommunity', 'main'), mockPageCommunity);
    if (mockPagePress) await setDoc(doc(db, 'pagePress', 'main'), mockPagePress);
    if (mockAbout) await setDoc(doc(db, 'about', 'main'), mockAbout);

    console.log('✅ Firestore populated successfully!');
    console.log(`📊 Added:`);
    console.log(`   - ${mockPrograms.length} programs`);
    console.log(`   - ${mockExperiences.length} experiences`);
    console.log(`   - ${mockSolutions.length} solutions`);
    console.log(`   - ${mockPosts.length} posts`);
    console.log(`   - ${mockTestimonials.length} testimonials`);
    console.log(`   - 11 page singletons`);

  } catch (error) {
    console.error('❌ Error populating Firestore:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateFirestore();
}