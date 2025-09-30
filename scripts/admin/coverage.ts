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

interface CoverageReport {
  usedIdsOnSite: {
    programs: string[]
    experiences: string[]
    solutions: string[]
    posts: string[]
    testimonials: string[]
    pages: string[]
    navigation: string[]
    settings: string[]
  }
  orphanedInFirestore: {
    programs: string[]
    experiences: string[]
    solutions: string[]
    posts: string[]
    testimonials: string[]
    pages: string[]
    navigation: string[]
    settings: string[]
  }
  orphanedInJson: {
    programs: string[]
    experiences: string[]
    solutions: string[]
    posts: string[]
    testimonials: string[]
    pages: string[]
    navigation: string[]
    settings: string[]
  }
  danglingLinks: Array<{
    page: string
    link: string
    type: 'program' | 'experience' | 'solution' | 'post' | 'page'
    target: string
  }>
  summary: {
    totalUsed: number
    totalOrphaned: number
    totalDangling: number
    coveragePercentage: number
  }
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

async function loadEnJson() {
  const enJsonPath = path.join(process.cwd(), 'src', 'content', 'en.json')
  
  if (!fs.existsSync(enJsonPath)) {
    throw new Error(`en.json not found at ${enJsonPath}`)
  }

  const content = fs.readFileSync(enJsonPath, 'utf-8')
  return JSON.parse(content)
}

async function fetchFirestoreData(db: any) {
  console.log('📊 Fetching Firestore data...')
  
  const collections = ['pages', 'programs', 'experiences', 'solutions', 'posts', 'testimonials', 'navigation', 'settings', 'testimonialMappings', 'testimonialTags']
  const data: any = {}

  for (const collectionName of collections) {
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      data[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log(`  ✓ ${collectionName}: ${data[collectionName].length} documents`)
    } catch (error) {
      console.log(`  ⚠️ ${collectionName}: Error fetching (${error})`)
      data[collectionName] = []
    }
  }

  return data
}

function extractUsedIds(enJson: any): CoverageReport['usedIdsOnSite'] {
  console.log('🔍 Extracting used IDs from en.json...')
  
  const usedIds = {
    programs: new Set<string>(),
    experiences: new Set<string>(),
    solutions: new Set<string>(),
    posts: new Set<string>(),
    testimonials: new Set<string>(),
    pages: new Set<string>(),
    navigation: new Set<string>(),
    settings: new Set<string>(),
  }

  // Helper function to recursively search for IDs in objects
  function searchForIds(obj: any, path: string = '') {
    if (typeof obj === 'string') {
      // Look for program/experience/solution slugs in strings
      if (path.includes('program') || path.includes('slug')) {
        usedIds.programs.add(obj)
      }
      if (path.includes('experience') || path.includes('slug')) {
        usedIds.experiences.add(obj)
      }
      if (path.includes('solution') || path.includes('slug')) {
        usedIds.solutions.add(obj)
      }
      return
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => searchForIds(item, `${path}[${index}]`))
      return
    }

    if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        searchForIds(value, path ? `${path}.${key}` : key)
      })
    }
  }

  // Search through all content
  searchForIds(enJson)

  // Add explicit references from navigation and page content
  if (enJson.navigation?.main?.menu) {
    enJson.navigation.main.menu.forEach((item: any) => {
      if (item.href) {
        const href = item.href.replace(/^\//, '')
        if (href.startsWith('programs/')) {
          usedIds.programs.add(href.replace('programs/', ''))
        } else if (href.startsWith('experiences/')) {
          usedIds.experiences.add(href.replace('experiences/', ''))
        } else if (href.startsWith('solutions/')) {
          usedIds.solutions.add(href.replace('solutions/', ''))
        }
      }
    })
  }

  // Add featured programs/experiences from home page
  if (enJson.home?.sections?.featured?.featuredPrograms) {
    enJson.home.sections.featured.featuredPrograms.forEach((id: string) => {
      usedIds.programs.add(id)
    })
  }

  if (enJson.home?.sections?.featured?.featuredExperiences) {
    enJson.home.sections.featured.featuredExperiences.forEach((id: string) => {
      usedIds.experiences.add(id)
    })
  }

  // Add testimonials referenced in content
  if (enJson.testimonials) {
    Object.keys(enJson.testimonials).forEach(id => {
      usedIds.testimonials.add(id)
    })
  }

  // Add pages referenced in navigation
  if (enJson.pages) {
    Object.keys(enJson.pages).forEach(id => {
      usedIds.pages.add(id)
    })
  }

  return {
    programs: Array.from(usedIds.programs),
    experiences: Array.from(usedIds.experiences),
    solutions: Array.from(usedIds.solutions),
    posts: Array.from(usedIds.posts),
    testimonials: Array.from(usedIds.testimonials),
    pages: Array.from(usedIds.pages),
    navigation: Array.from(usedIds.navigation),
    settings: Array.from(usedIds.settings),
  }
}

function findOrphans(firestoreData: any, usedIds: CoverageReport['usedIdsOnSite']) {
  console.log('🔍 Finding orphaned records...')
  
  const orphaned = {
    programs: [] as string[],
    experiences: [] as string[],
    solutions: [] as string[],
    posts: [] as string[],
    testimonials: [] as string[],
    pages: [] as string[],
    navigation: [] as string[],
    settings: [] as string[],
  }

  Object.entries(firestoreData).forEach(([collectionName, docs]: [string, any]) => {
    if (Array.isArray(docs)) {
      docs.forEach((doc: any) => {
        if (!usedIds[collectionName as keyof typeof usedIds]?.includes(doc.id)) {
          orphaned[collectionName as keyof typeof orphaned].push(doc.id)
        }
      })
    }
  })

  return orphaned
}

function findDanglingLinks(enJson: any, firestoreData: any): CoverageReport['danglingLinks'] {
  console.log('🔍 Finding dangling links...')
  
  const danglingLinks: CoverageReport['danglingLinks'] = []
  
  // Check program links
  if (enJson.home?.sections?.featured?.featuredPrograms) {
    enJson.home.sections.featured.featuredPrograms.forEach((programId: string) => {
      const exists = firestoreData.programs?.some((p: any) => p.id === programId || p.slug === programId)
      if (!exists) {
        danglingLinks.push({
          page: 'home',
          link: `featuredPrograms[${programId}]`,
          type: 'program',
          target: programId
        })
      }
    })
  }

  // Check experience links
  if (enJson.home?.sections?.featured?.featuredExperiences) {
    enJson.home.sections.featured.featuredExperiences.forEach((experienceId: string) => {
      const exists = firestoreData.experiences?.some((e: any) => e.id === experienceId || e.slug === experienceId)
      if (!exists) {
        danglingLinks.push({
          page: 'home',
          link: `featuredExperiences[${experienceId}]`,
          type: 'experience',
          target: experienceId
        })
      }
    })
  }

  // Check navigation links
  if (enJson.navigation?.main?.menu) {
    enJson.navigation.main.menu.forEach((item: any, index: number) => {
      if (item.href) {
        const href = item.href.replace(/^\//, '')
        if (href.startsWith('programs/')) {
          const slug = href.replace('programs/', '')
          const exists = firestoreData.programs?.some((p: any) => p.slug === slug)
          if (!exists) {
            danglingLinks.push({
              page: 'navigation',
              link: `menu[${index}].href`,
              type: 'program',
              target: slug
            })
          }
        }
      }
    })
  }

  return danglingLinks
}

function generateSummary(usedIds: CoverageReport['usedIdsOnSite'], orphaned: any, danglingLinks: CoverageReport['danglingLinks']) {
  const totalUsed = Object.values(usedIds).reduce((sum, arr) => sum + arr.length, 0)
  const totalOrphaned = Object.values(orphaned).reduce((sum, arr) => sum + arr.length, 0)
  const totalDangling = danglingLinks.length
  const totalRecords = totalUsed + totalOrphaned
  const coveragePercentage = totalRecords > 0 ? Math.round((totalUsed / totalRecords) * 100) : 100

  return {
    totalUsed,
    totalOrphaned,
    totalDangling,
    coveragePercentage
  }
}

function generateMarkdownReport(report: CoverageReport): string {
  const { usedIdsOnSite, orphanedInFirestore, orphanedInJson, danglingLinks, summary } = report

  let markdown = `# Coverage & Orphans Report\n\n`
  markdown += `Generated: ${new Date().toISOString()}\n\n`

  markdown += `## Summary\n\n`
  markdown += `- **Total Used Records:** ${summary.totalUsed}\n`
  markdown += `- **Total Orphaned Records:** ${summary.totalOrphaned}\n`
  markdown += `- **Total Dangling Links:** ${summary.totalDangling}\n`
  markdown += `- **Coverage Percentage:** ${summary.coveragePercentage}%\n\n`

  markdown += `## Used Records on Site\n\n`
  Object.entries(usedIdsOnSite).forEach(([type, ids]) => {
    if (ids.length > 0) {
      markdown += `### ${type.charAt(0).toUpperCase() + type.slice(1)}\n`
      markdown += `- ${ids.length} records: ${ids.join(', ')}\n\n`
    }
  })

  markdown += `## Orphaned Records in Firestore\n\n`
  Object.entries(orphanedInFirestore).forEach(([type, ids]) => {
    if (ids.length > 0) {
      markdown += `### ${type.charAt(0).toUpperCase() + type.slice(1)}\n`
      markdown += `- ${ids.length} orphaned: ${ids.join(', ')}\n\n`
    }
  })

  if (danglingLinks.length > 0) {
    markdown += `## Dangling Links\n\n`
    markdown += `| Page | Link | Type | Target |\n`
    markdown += `|------|------|------|--------|\n`
    danglingLinks.forEach(link => {
      markdown += `| ${link.page} | ${link.link} | ${link.type} | ${link.target} |\n`
    })
    markdown += `\n`
  }

  markdown += `## Recommendations\n\n`
  if (summary.totalOrphaned > 0) {
    markdown += `- Review ${summary.totalOrphaned} orphaned records and either link them or remove them\n`
  }
  if (summary.totalDangling > 0) {
    markdown += `- Fix ${summary.totalDangling} dangling links to prevent 404 errors\n`
  }
  if (summary.coveragePercentage < 90) {
    markdown += `- Consider improving content coverage (currently ${summary.coveragePercentage}%)\n`
  }
  if (summary.totalOrphaned === 0 && summary.totalDangling === 0) {
    markdown += `- ✅ Excellent! No orphaned records or dangling links found\n`
  }

  return markdown
}

async function main() {
  try {
    console.log('🚀 Starting Coverage & Orphans Report...\n')

    // Initialize Firebase
    const db = await initializeFirebase()

    // Load en.json
    console.log('📄 Loading en.json...')
    const enJson = await loadEnJson()

    // Fetch Firestore data
    const firestoreData = await fetchFirestoreData(db)

    // Extract used IDs
    const usedIds = extractUsedIds(enJson)

    // Find orphans
    const orphanedInFirestore = findOrphans(firestoreData, usedIds)

    // Find dangling links
    const danglingLinks = findDanglingLinks(enJson, firestoreData)

    // Generate summary
    const summary = generateSummary(usedIds, orphanedInFirestore, danglingLinks)

    // Create report
    const report: CoverageReport = {
      usedIdsOnSite: usedIds,
      orphanedInFirestore,
      orphanedInJson: {
        programs: [],
        experiences: [],
        solutions: [],
        posts: [],
        testimonials: [],
        pages: [],
        navigation: [],
        settings: [],
      },
      danglingLinks,
      summary
    }

    // Write reports
    const publicDir = path.join(process.cwd(), 'public', 'data')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    const reportPath = path.join(publicDir, 'coverage.report.json')
    const summaryPath = path.join(publicDir, 'coverage.summary.md')

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    fs.writeFileSync(summaryPath, generateMarkdownReport(report))

    console.log(`\n✅ Coverage report generated successfully!`)
    console.log(`📊 Summary:`)
    console.log(`   - Used Records: ${summary.totalUsed}`)
    console.log(`   - Orphaned Records: ${summary.totalOrphaned}`)
    console.log(`   - Dangling Links: ${summary.totalDangling}`)
    console.log(`   - Coverage: ${summary.coveragePercentage}%`)
    console.log(`\n📁 Files created:`)
    console.log(`   - ${reportPath}`)
    console.log(`   - ${summaryPath}`)

  } catch (error) {
    console.error('❌ Error generating coverage report:', error)
    process.exit(1)
  }
}

main()
