#!/usr/bin/env tsx

import { config } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../../.env.local') })

import { TestimonialManager } from './TestimonialManager'
import { ImportConfig } from './types'

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  const manager = new TestimonialManager()

  switch (command) {
    case 'import':
      await handleImport(manager, args)
      break
    case 'tag':
      await handleTag(manager, args)
      break
    case 'report':
      await handleReport(manager)
      break
    case 'export':
      await handleExport(manager)
      break
    case 'init':
      await handleInit(manager)
      break
    default:
      printHelp()
  }
}

async function handleImport(manager: TestimonialManager, args: string[]) {
  const source = args[1] as 'senja-csv' | 'manual'
  
  if (!source) {
    console.error('❌ Please specify a source: senja-csv or manual')
    process.exit(1)
  }

  // Load configuration from environment or config file
  const config = loadImportConfig(source)
  
  console.log(`🔄 Importing testimonials from ${source}...`)
  const result = await manager.importAndTag(config)
  
  if (result.success) {
    console.log('✅ Import successful!')
    console.log(`  - New testimonials: ${result.imported}`)
    console.log(`  - Updated testimonials: ${result.skipped}`)
    console.log(`  - Duplicates found: ${result.duplicates.length}`)
    console.log(`  - New avatars: ${result.newAvatars.length}`)
    console.log(`  - Mappings created: ${result.mappings.length}`)
  } else {
    console.error('❌ Import failed!')
    result.errors.forEach(error => {
      console.error(`  - ${error.testimonialId}: ${error.error}`)
    })
    process.exit(1)
  }
}

async function handleTag(manager: TestimonialManager, args: string[]) {
  const action = args[1]
  
  switch (action) {
    case 'init':
      console.log('🏷️ Initializing default tags...')
      await manager.tagger.initializeDefaultTags()
      console.log('✅ Default tags initialized!')
      break
      
    case 'list':
      console.log('📋 Available tags:')
      const tags = await manager.getAllTags()
      tags.forEach(tag => {
        console.log(`  - ${tag.name} (${tag.type}) - ${tag.active ? 'active' : 'inactive'}`)
      })
      break
      
    case 'mappings':
      console.log('🔗 Testimonial mappings:')
      const mappings = await manager.getAllMappings()
      mappings.forEach(mapping => {
        console.log(`  - ${mapping.testimonialId}:`)
        console.log(`    Programs: ${mapping.programs.join(', ') || 'none'}`)
        console.log(`    Experiences: ${mapping.experiences.join(', ') || 'none'}`)
        console.log(`    Featured: ${mapping.featuredSpaces.join(', ') || 'none'}`)
        console.log(`    Priority: ${mapping.priority}`)
      })
      break
      
    default:
      console.error('❌ Unknown tag action. Use: init, list, or mappings')
      process.exit(1)
  }
}

async function handleReport(manager: TestimonialManager) {
  console.log('📊 Generating testimonial report...')
  const report = await manager.generateTestimonialReport()
  
  console.log('\n📈 Testimonial Report:')
  console.log(`  Total testimonials: ${report.totalTestimonials}`)
  console.log(`  Total tags: ${report.totalTags}`)
  console.log(`  Total mappings: ${report.totalMappings}`)
  
  console.log('\n🏷️ Program mappings:')
  Object.entries(report.programMappings).forEach(([program, count]) => {
    console.log(`  - ${program}: ${count} testimonials`)
  })
  
  console.log('\n🎯 Experience mappings:')
  Object.entries(report.experienceMappings).forEach(([experience, count]) => {
    console.log(`  - ${experience}: ${count} testimonials`)
  })
  
  console.log('\n⭐ Featured mappings:')
  Object.entries(report.featuredMappings).forEach(([space, count]) => {
    console.log(`  - ${space}: ${count} testimonials`)
  })
  
  console.log('\n📊 Quality distribution:')
  Object.entries(report.qualityDistribution).forEach(([rating, count]) => {
    console.log(`  - ${rating} stars: ${count} testimonials`)
  })
  
  console.log('\n🌐 Source distribution:')
  Object.entries(report.sourceDistribution).forEach(([source, count]) => {
    console.log(`  - ${source}: ${count} testimonials`)
  })
}

async function handleExport(manager: TestimonialManager) {
  console.log('📤 Exporting testimonials for static site...')
  const exportData = await manager.exportTestimonialsForStaticSite()
  
  // Write to file
  const fs = await import('fs/promises')
  const path = await import('path')
  
  const outputPath = path.join(process.cwd(), 'src/content/testimonials.json')
  await fs.writeFile(outputPath, JSON.stringify(exportData, null, 2))
  
  console.log(`✅ Testimonials exported to ${outputPath}`)
  console.log(`  - Total testimonials: ${exportData.testimonials.length}`)
  console.log(`  - Playlists: ${Object.keys(exportData.playlists).length}`)
}

async function handleInit(manager: TestimonialManager) {
  console.log('🚀 Initializing testimonial system...')
  
  // Initialize default tags
  await manager.tagger.initializeDefaultTags()
  
  // Generate initial report
  const report = await manager.generateTestimonialReport()
  
  console.log('✅ Testimonial system initialized!')
  console.log(`  - Default tags created: ${report.totalTags}`)
  console.log('  - Ready for testimonial imports')
}

function loadImportConfig(source: string): ImportConfig {
  // Load configuration from environment variables
  const configs: Record<string, ImportConfig> = {
    'senja-csv': {
      source: 'senja',
      credentials: {},
      settings: {
        csvFilePath: 'src/content/reviews.csv',
        maxReviews: parseInt(process.env.SENJA_MAX_REVIEWS || '1000'),
        minRating: parseInt(process.env.SENJA_MIN_RATING || '1'),
        includeImages: process.env.SENJA_INCLUDE_IMAGES === 'true',
        autoTag: true,
        autoFeatured: true
      }
    },
    manual: {
      source: 'manual',
      credentials: {},
      settings: {
        maxReviews: 100,
        minRating: 1,
        includeImages: false,
        autoTag: true,
        autoFeatured: true
      }
    },
    trustpilot: {
      source: 'trustpilot',
      credentials: {
        apiKey: process.env.TRUSTPILOT_API_KEY
      },
      settings: {
        businessId: process.env.TRUSTPILOT_BUSINESS_ID,
        maxReviews: parseInt(process.env.TRUSTPILOT_MAX_REVIEWS || '100'),
        minRating: parseInt(process.env.TRUSTPILOT_MIN_RATING || '4'),
        includeImages: process.env.TRUSTPILOT_INCLUDE_IMAGES === 'true',
        autoTag: true,
        autoFeatured: true
      }
    }
  }

  const config = configs[source]
  if (!config) {
    throw new Error(`No configuration found for source: ${source}`)
  }

  return config
}

function printHelp() {
  console.log(`
🏷️ Testimonial Import & Management System

Usage: tsx scripts/testimonial-import/run-import.ts <command> [options]

Commands:
  import <source>     Import testimonials from source (senja-csv, manual)
  tag init           Initialize default tags
  tag list           List all available tags
  tag mappings       Show testimonial mappings
  report             Generate testimonial report
  export             Export testimonials for static site
  init               Initialize the testimonial system

Examples:
  tsx scripts/testimonial-import/run-import.ts import senja-csv
  tsx scripts/testimonial-import/run-import.ts tag init
  tsx scripts/testimonial-import/run-import.ts report
  tsx scripts/testimonial-import/run-import.ts export

Environment Variables:
  VITE_FIREBASE_* (Firebase configuration)
  SENJA_MAX_REVIEWS (default: 1000)
  SENJA_MIN_RATING (default: 1)
  SENJA_INCLUDE_IMAGES (default: true)
  `)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
