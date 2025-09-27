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
    programTestimonials: Record<string, any[]>
    experienceTestimonials: Record<string, any[]>
    featuredTestimonials: Record<string, any[]>
  }> {
    const testimonials = await this.importer.getExistingTestimonials()
    const mappings = await this.tagger.getMappings()

    const programTestimonials: Record<string, any[]> = {}
    const experienceTestimonials: Record<string, any[]> = {}
    const featuredTestimonials: Record<string, any[]> = {}

    // Group testimonials by mappings
    for (const mapping of mappings) {
      const testimonial = testimonials.find(t => t.id === mapping.testimonialId)
      if (!testimonial) continue

      // Add to program groups
      for (const programId of mapping.programs) {
        if (!programTestimonials[programId]) {
          programTestimonials[programId] = []
        }
        programTestimonials[programId].push({
          ...testimonial,
          priority: mapping.priority,
          tags: mapping.tags
        })
      }

      // Add to experience groups
      for (const experienceId of mapping.experiences) {
        if (!experienceTestimonials[experienceId]) {
          experienceTestimonials[experienceId] = []
        }
        experienceTestimonials[experienceId].push({
          ...testimonial,
          priority: mapping.priority,
          tags: mapping.tags
        })
      }

      // Add to featured groups
      for (const space of mapping.featuredSpaces) {
        if (!featuredTestimonials[space]) {
          featuredTestimonials[space] = []
        }
        featuredTestimonials[space].push({
          ...testimonial,
          priority: mapping.priority,
          tags: mapping.tags
        })
      }
    }

    // Sort by priority
    Object.keys(programTestimonials).forEach(key => {
      programTestimonials[key].sort((a, b) => (b.priority || 0) - (a.priority || 0))
    })
    Object.keys(experienceTestimonials).forEach(key => {
      experienceTestimonials[key].sort((a, b) => (b.priority || 0) - (a.priority || 0))
    })
    Object.keys(featuredTestimonials).forEach(key => {
      featuredTestimonials[key].sort((a, b) => (b.priority || 0) - (a.priority || 0))
    })

    return {
      testimonials,
      programTestimonials,
      experienceTestimonials,
      featuredTestimonials
    }
  }
}

