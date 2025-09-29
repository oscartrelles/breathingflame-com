import { config } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../../.env.local') })

import { TestimonialImporter } from './TestimonialImporter'
import { TestimonialTagger } from './TestimonialTagger'
import { ImportConfig, ImportResult, TestimonialMapping, TestimonialTag } from './types'

export class TestimonialManager {
  private importer: TestimonialImporter
  private tagger: TestimonialTagger

  constructor() {
    this.importer = new TestimonialImporter()
    this.tagger = new TestimonialTagger()
  }

  async importAndTag(config: ImportConfig): Promise<ImportResult & { mappings: TestimonialMapping[] }> {
    console.log('🚀 Starting testimonial import and tagging process...')
    
    // Step 1: Import testimonials
    const importResult = await this.importer.importTestimonials(config)
    
    if (!importResult.success) {
      return { ...importResult, mappings: [] }
    }

    // Step 2: Initialize default tags if needed
    await this.tagger.initializeDefaultTags()
    
    // Step 3: Get all testimonials for tagging
    const allTestimonials = await this.importer.getExistingTestimonials()
    
    // Step 4: Auto-tag testimonials
    const mappings = await this.tagger.autoTagTestimonials(allTestimonials as any[])
    
    // Step 5: Save mappings
    await this.tagger.saveMappings(mappings)
    
    console.log(`✅ Import and tagging complete: ${importResult.imported} new testimonials, ${mappings.length} tagged`)
    
    return {
      ...importResult,
      mappings
    }
  }

  async getTestimonialsForProgram(programId: string): Promise<any[]> {
    return await this.tagger.getTestimonialsForProgram(programId)
  }

  async getTestimonialsForExperience(experienceId: string): Promise<any[]> {
    return await this.tagger.getTestimonialsForExperience(experienceId)
  }

  async getFeaturedTestimonials(space: string, limit: number = 3): Promise<any[]> {
    return await this.tagger.getFeaturedTestimonials(space, limit)
  }

  async getAllTags(): Promise<TestimonialTag[]> {
    return await this.tagger.getTags()
  }

  async getAllMappings(): Promise<TestimonialMapping[]> {
    return await this.tagger.getMappings()
  }

  async updateTestimonialMapping(testimonialId: string, updates: Partial<TestimonialMapping>): Promise<void> {
    return await this.tagger.updateTestimonialMapping(testimonialId, updates)
  }

  async createCustomTag(tag: Omit<TestimonialTag, 'id'>): Promise<void> {
    const newTag: TestimonialTag = {
      ...tag,
      id: tag.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    }
    return await this.tagger.createTag(newTag)
  }

  async generateTestimonialReport(): Promise<{
    totalTestimonials: number
    totalTags: number
    totalMappings: number
    programMappings: Record<string, number>
    experienceMappings: Record<string, number>
    featuredMappings: Record<string, number>
    qualityDistribution: Record<string, number>
    sourceDistribution: Record<string, number>
  }> {
    const testimonials = await this.importer.getExistingTestimonials()
    const tags = await this.tagger.getTags()
    const mappings = await this.tagger.getMappings()

    const report = {
      totalTestimonials: testimonials.length,
      totalTags: tags.length,
      totalMappings: mappings.length,
      programMappings: {} as Record<string, number>,
      experienceMappings: {} as Record<string, number>,
      featuredMappings: {} as Record<string, number>,
      qualityDistribution: {} as Record<string, number>,
      sourceDistribution: {} as Record<string, number>
    }

    // Analyze program mappings
    for (const mapping of mappings) {
      for (const programId of mapping.programs) {
        report.programMappings[programId] = (report.programMappings[programId] || 0) + 1
      }
      for (const experienceId of mapping.experiences) {
        report.experienceMappings[experienceId] = (report.experienceMappings[experienceId] || 0) + 1
      }
      for (const space of mapping.featuredSpaces) {
        report.featuredMappings[space] = (report.featuredMappings[space] || 0) + 1
      }
    }

    // Analyze quality distribution
    for (const testimonial of testimonials) {
      const rating = testimonial.rating.toString()
      report.qualityDistribution[rating] = (report.qualityDistribution[rating] || 0) + 1
    }

    // Analyze source distribution
    for (const testimonial of testimonials) {
      const source = testimonial.sourceUrl?.includes('google') ? 'google' : 
                   testimonial.sourceUrl?.includes('trustpilot') ? 'trustpilot' : 'other'
      report.sourceDistribution[source] = (report.sourceDistribution[source] || 0) + 1
    }

    return report
  }

  async exportTestimonialsForStaticSite(): Promise<{
    testimonials: any[]
    playlists: any
  }> {
    const testimonials = await this.importer.getExistingTestimonials()
    
    // Generate intelligent playlists
    const { PlaylistGenerator } = await import('./playlist-generator')
    const generator = new PlaylistGenerator()
    generator.setTestimonials(testimonials)
    
    const playlists = generator.generatePlaylists()
    const report = generator.generateReport(playlists)
    
    console.log(report)
    
    return {
      testimonials,
      playlists
    }
  }

  // Maintenance helpers
  async clearAllTestimonialData(): Promise<void> {
    console.log('🗑️ Clearing testimonials, mappings, playlists, and avatars...')
    await this.importer.clearTestimonials()
    if (typeof (this.tagger as any).clearMappings === 'function') {
      await (this.tagger as any).clearMappings()
    }
    // Clear generated playlist docs if they exist
    try {
      const { getFirestore, collection, getDocs, doc } = await import('firebase/firestore')
      const { initializeApp } = await import('firebase/app')
      const app = initializeApp({
        apiKey: process.env.VITE_FIREBASE_API_KEY,
        authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      })
      const db = getFirestore(app)
      for (const colName of ['testimonialPlaylists', 'playlists']) {
        try {
          const snap = await getDocs(collection(db, colName))
          // @ts-ignore batch on db
          const batch = (db as any).batch()
          snap.docs.forEach(d => batch.delete(doc(db, colName, d.id)))
          await batch.commit()
          console.log(`🗑️ Cleared ${snap.size} docs from ${colName}`)
        } catch {}
      }
    } catch (e) {
      console.warn('Skipping playlist cleanup:', e)
    }

    await this.deleteAvatars()
    console.log('✅ Clear complete')
  }

  private async deleteAvatars(): Promise<void> {
    const fs = await import('fs/promises')
    const path = await import('path')
    const dir = path.join(process.cwd(), 'public/images/reviews/avatars')
    try {
      const entries = await fs.readdir(dir)
      const files = entries.filter(f => f !== 'default.svg')
      await Promise.all(files.map(f => fs.rm(path.join(dir, f), { force: true })))
      console.log(`🗑️ Deleted ${files.length} avatar files`)
    } catch (e) {
      console.error('Error deleting avatars:', e)
    }
  }
}

