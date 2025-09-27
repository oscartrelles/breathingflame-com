#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ContentData, ValidationReport, Program, Experience, Solution, SEO, Hero, FAQ, CTA } from './types'

// Environment variables for placeholder replacements
const ENV_FALLBACKS = {
  WHATSAPP_COMMUNITY_LINK: process.env.VITE_WHATSAPP_COMMUNITY_LINK || '#',
  MEETUP_URL_1: process.env.VITE_MEETUP_URL_1 || '#',
  MEETUP_URL_2: process.env.VITE_MEETUP_URL_2 || '#',
  MEETUP_URL_3: process.env.VITE_MEETUP_URL_3 || '#',
  MEDIUM_URL: process.env.VITE_MEDIUM_URL || '#',
  SUBSTACK_URL: process.env.VITE_SUBSTACK_URL || '#'
}

class ContentValidator {
  private data: ContentData
  private report: ValidationReport
  private isDryRun: boolean

  constructor(data: ContentData, isDryRun: boolean = true) {
    this.data = data
    this.isDryRun = isDryRun
    this.report = {
      duplicates: [],
      missingSEO: [],
      brokenTestimonialRefs: [],
      updatedLinks: [],
      placeholdersRemaining: [],
      removedLegacyFields: [],
      schemaMismatches: [],
      jsonLdReadiness: {
        programs: 0,
        experiences: 0,
        solutions: 0,
        posts: 0,
        pages: 0
      },
      summary: {
        totalPrograms: 0,
        totalExperiences: 0,
        totalSolutions: 0,
        totalPosts: 0,
        totalTestimonials: 0,
        duplicatesRemoved: 0,
        seoAdded: 0,
        linksFixed: 0
      }
    }
  }

  async validateAndMigrate(): Promise<{ data: ContentData; report: ValidationReport }> {
    console.log('🔍 Starting content validation and migration...')
    
    // Step 1: Deduplicate and normalize programs
    console.log('📚 Processing programs...')
    this.data.programs = this.deduplicateAndNormalizePrograms(this.data.programs)
    
    // Step 2: Deduplicate and normalize experiences
    console.log('🎯 Processing experiences...')
    this.data.experiences = this.deduplicateAndNormalizeExperiences(this.data.experiences)
    
    // Step 3: Normalize solutions
    console.log('🏢 Processing solutions...')
    this.data.solutions = this.normalizeSolutions(this.data.solutions)
    
    // Step 4: Ensure SEO on all offerings
    console.log('🔍 Ensuring SEO...')
    this.ensureSEO()
    
    // Step 5: Fix broken testimonial references
    console.log('💬 Fixing testimonial references...')
    this.fixTestimonialRefs()
    
    // Step 6: Replace placeholder links
    console.log('🔗 Replacing placeholder links...')
    this.replacePlaceholderLinks()
    
    // Step 7: Strip legacy fields
    console.log('🧹 Stripping legacy fields...')
    this.stripLegacyFields()
    
    // Step 8: Generate summary
    this.generateSummary()
    
    console.log('✅ Validation and migration complete!')
    return { data: this.data, report: this.report }
  }

  private deduplicateAndNormalizePrograms(programs: any[]): Program[] {
    const slugMap = new Map<string, any>()
    const normalized: Program[] = []

    for (const program of programs) {
      const slug = program.slug || program.id
      if (!slug) continue

      if (slugMap.has(slug)) {
        // Merge with existing
        const existing = slugMap.get(slug)
        const merged = this.mergePrograms(existing, program)
        slugMap.set(slug, merged)
        this.report.duplicates.push({
          collection: 'programs',
          slug,
          keptId: existing.id,
          mergedIds: [program.id]
        })
      } else {
        slugMap.set(slug, program)
      }
    }

    // Convert to normalized format
    for (const program of slugMap.values()) {
      const normalizedProgram = this.normalizeProgram(program)
      normalized.push(normalizedProgram)
    }

    return normalized.sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  private deduplicateAndNormalizeExperiences(experiences: any[]): Experience[] {
    const slugMap = new Map<string, any>()
    const normalized: Experience[] = []

    for (const experience of experiences) {
      const slug = experience.slug || experience.id
      if (!slug) continue

      if (slugMap.has(slug)) {
        // Merge with existing
        const existing = slugMap.get(slug)
        const merged = this.mergeExperiences(existing, experience)
        slugMap.set(slug, merged)
        this.report.duplicates.push({
          collection: 'experiences',
          slug,
          keptId: existing.id,
          mergedIds: [experience.id]
        })
      } else {
        slugMap.set(slug, experience)
      }
    }

    // Convert to normalized format
    for (const experience of slugMap.values()) {
      const normalizedExperience = this.normalizeExperience(experience)
      normalized.push(normalizedExperience)
    }

    return normalized.sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  private normalizeSolutions(solutions: any[]): Solution[] {
    return solutions.map(solution => this.normalizeSolution(solution))
  }

  private mergePrograms(existing: any, incoming: any): any {
    return {
      ...existing,
      ...incoming,
      // Prefer non-empty values
      title: incoming.title || existing.title,
      summary: incoming.summary || existing.summary,
      description: incoming.description || existing.description,
      // Merge arrays and deduplicate
      outcomes: [...new Set([...(existing.outcomes || []), ...(incoming.outcomes || [])])],
      modules: [...new Set([...(existing.modules || []), ...(incoming.modules || [])])],
      includes: [...new Set([...(existing.includes || []), ...(incoming.includes || [])])],
      tags: [...new Set([...(existing.tags || []), ...(incoming.tags || [])])],
      // Prefer incoming for complex objects
      hero: incoming.hero || existing.hero,
      format: incoming.format || existing.format,
      price: incoming.price || existing.price,
      ctas: incoming.ctas || existing.ctas,
      seo: incoming.seo || existing.seo
    }
  }

  private mergeExperiences(existing: any, incoming: any): any {
    return this.mergePrograms(existing, incoming) // Same logic
  }

  private normalizeProgram(program: any): Program {
    const hero: Hero = {
      headline: program.hero?.headline || program.title,
      subtext: program.hero?.subtext || program.summary || '',
      image: program.hero?.image || program.image,
      background: program.hero?.background
    }

    // Convert howItWorks to modules
    const modules = program.modules || (Array.isArray(program.howItWorks) ? program.howItWorks.map((item: any) => 
      typeof item === 'string' ? item : `${item.step}. ${item.title}: ${item.description}`
    ) : [])

    // Convert faqs to faq
    const faq: FAQ[] = program.faq || (Array.isArray(program.faqs) ? program.faqs.map((item: any) => ({
      q: item.question || item.q,
      a: item.answer || item.a
    })) : [])

    // Normalize format
    const format = program.format || (program.format_legacy ? {
      duration: program.duration,
      delivery: program.format_legacy,
      location: program.location
    } : undefined)

    // Normalize price
    const price = program.price ? {
      individual: typeof program.price.individual === 'string' ? 
        parseFloat(program.price.individual) : program.price.individual,
      organization: typeof program.price.organization === 'string' ? 
        parseFloat(program.price.organization) : program.price.organization
    } : undefined

    // Normalize CTAs
    const ctas: CTA[] = Array.isArray(program.ctas) ? program.ctas.map((cta: any) => ({
      label: cta.label,
      url: cta.url || cta.pathOrUrl,
      external: cta.external || false
    })) : []

    return {
      id: program.slug || program.id,
      type: 'program',
      title: program.title,
      slug: program.slug || program.id,
      hero,
      summary: program.summary || program.description,
      outcomes: program.outcomes || [],
      modules,
      includes: program.includes || [],
      format,
      price,
      ctas,
      testimonials: program.testimonials || [],
      faq,
      seo: program.seo || this.getDefaultSEO(program.title),
      order: program.order || 0,
      tags: program.tags || [],
      published: program.published !== false
    }
  }

  private normalizeExperience(experience: any): Experience {
    const normalized = this.normalizeProgram(experience) as any
    return {
      ...normalized,
      type: 'experience',
      audience: experience.audience,
      highlights: experience.highlights || [],
      duration: experience.duration
    }
  }

  private normalizeSolution(solution: any): Solution {
    const hero: Hero = {
      headline: solution.hero?.headline || solution.title,
      subtext: solution.hero?.subtext || solution.summary || '',
      image: solution.hero?.image || solution.image
    }

    const ctas: CTA[] = Array.isArray(solution.ctas) ? solution.ctas.map((cta: any) => ({
      label: cta.label,
      url: cta.url || cta.pathOrUrl,
      external: cta.external || false
    })) : []

    const faq: FAQ[] = solution.faq || (Array.isArray(solution.faqs) ? solution.faqs.map((item: any) => ({
      q: item.question || item.q,
      a: item.answer || item.a
    })) : [])

    return {
      id: solution.slug || solution.id,
      type: 'solution',
      title: solution.title,
      slug: solution.slug || solution.id,
      hero,
      summary: solution.summary,
      outcomes: solution.outcomes || [],
      modules: solution.modules || [],
      includes: solution.includes || [],
      formats: solution.formats || [],
      audience: solution.audience,
      ctas,
      testimonials: solution.testimonials || [],
      faq,
      seo: solution.seo || this.getDefaultSEO(solution.title),
      order: solution.order || 0,
      tags: solution.tags || []
    }
  }

  private getDefaultSEO(title: string): SEO {
    return {
      title: `${title} – Breathing Flame`,
      description: this.data.settings.seoDefaults.metaDescription,
      ogImage: this.data.settings.seoDefaults.ogImage
    }
  }

  private ensureSEO(): void {
    // Check programs
    this.data.programs.forEach((program, index) => {
      if (!program.seo) {
        program.seo = this.getDefaultSEO(program.title)
        this.report.missingSEO.push(`programs[${index}]`)
        this.report.summary.seoAdded++
      }
    })

    // Check experiences
    this.data.experiences.forEach((experience, index) => {
      if (!experience.seo) {
        experience.seo = this.getDefaultSEO(experience.title)
        this.report.missingSEO.push(`experiences[${index}]`)
        this.report.summary.seoAdded++
      }
    })

    // Check solutions
    this.data.solutions.forEach((solution, index) => {
      if (!solution.seo) {
        solution.seo = this.getDefaultSEO(solution.title)
        this.report.missingSEO.push(`solutions[${index}]`)
        this.report.summary.seoAdded++
      }
    })

    // Check posts
    this.data.posts.forEach((post, index) => {
      if (!post.seo) {
        post.seo = this.getDefaultSEO(post.title)
        this.report.missingSEO.push(`posts[${index}]`)
        this.report.summary.seoAdded++
      }
    })
  }

  private fixTestimonialRefs(): void {
    const testimonialIds = new Set(this.data.testimonials.map(t => t.id))
    
    // Check programs
    this.data.programs.forEach(program => {
      if (program.testimonials) {
        const validRefs = program.testimonials.filter(id => testimonialIds.has(id))
        const removed = program.testimonials.filter(id => !testimonialIds.has(id))
        if (removed.length > 0) {
          program.testimonials = validRefs
          this.report.brokenTestimonialRefs.push({
            path: `programs.${program.slug}.testimonials`,
            removed
          })
        }
      }
    })

    // Check experiences
    this.data.experiences.forEach(experience => {
      if (experience.testimonials) {
        const validRefs = experience.testimonials.filter(id => testimonialIds.has(id))
        const removed = experience.testimonials.filter(id => !testimonialIds.has(id))
        if (removed.length > 0) {
          experience.testimonials = validRefs
          this.report.brokenTestimonialRefs.push({
            path: `experiences.${experience.slug}.testimonials`,
            removed
          })
        }
      }
    })

    // Check solutions
    this.data.solutions.forEach(solution => {
      if (solution.testimonials) {
        const validRefs = solution.testimonials.filter(id => testimonialIds.has(id))
        const removed = solution.testimonials.filter(id => !testimonialIds.has(id))
        if (removed.length > 0) {
          solution.testimonials = validRefs
          this.report.brokenTestimonialRefs.push({
            path: `solutions.${solution.slug}.testimonials`,
            removed
          })
        }
      }
    })
  }

  private replacePlaceholderLinks(): void {
    // Check community page
    if (this.data.pageCommunity?.sections) {
      this.data.pageCommunity.sections.forEach((section: any, sectionIndex: number) => {
        if (section.cards) {
          section.cards.forEach((card: any, cardIndex: number) => {
            if (card.url === '#') {
              const path = `pageCommunity.sections[${sectionIndex}].cards[${cardIndex}].url`
              
              if (card.label?.includes('WhatsApp')) {
                card.url = ENV_FALLBACKS.WHATSAPP_COMMUNITY_LINK
                this.report.updatedLinks.push({ from: '#', to: card.url })
                this.report.summary.linksFixed++
              } else if (card.label?.includes('Meetup')) {
                const meetupNum = cardIndex - 1 // Assuming first card is WhatsApp
                const envKey = `MEETUP_URL_${meetupNum}` as keyof typeof ENV_FALLBACKS
                card.url = ENV_FALLBACKS[envKey] || '#'
                this.report.updatedLinks.push({ from: '#', to: card.url })
                this.report.summary.linksFixed++
              } else if (card.label?.includes('Medium')) {
                card.url = ENV_FALLBACKS.MEDIUM_URL
                this.report.updatedLinks.push({ from: '#', to: card.url })
                this.report.summary.linksFixed++
              } else if (card.label?.includes('Substack')) {
                card.url = ENV_FALLBACKS.SUBSTACK_URL
                this.report.updatedLinks.push({ from: '#', to: card.url })
                this.report.summary.linksFixed++
              } else {
                this.report.placeholdersRemaining.push({ path, url: '#' })
              }
            }
          })
        }
      })
    }
  }

  private stripLegacyFields(): void {
    // Remove format_legacy from programs and experiences
    this.data.programs.forEach(program => {
      if ('format_legacy' in program) {
        delete program.format_legacy
        this.report.removedLegacyFields.push({
          path: `programs.${program.slug}`,
          fields: ['format_legacy']
        })
      }
    })

    this.data.experiences.forEach(experience => {
      if ('format_legacy' in experience) {
        delete experience.format_legacy
        this.report.removedLegacyFields.push({
          path: `experiences.${experience.slug}`,
          fields: ['format_legacy']
        })
      }
    })
  }

  private generateSummary(): void {
    this.report.summary.totalPrograms = this.data.programs.length
    this.report.summary.totalExperiences = this.data.experiences.length
    this.report.summary.totalSolutions = this.data.solutions.length
    this.report.summary.totalPosts = this.data.posts.length
    this.report.summary.totalTestimonials = this.data.testimonials.length
    this.report.summary.duplicatesRemoved = this.report.duplicates.length

    // JSON-LD readiness check
    this.report.jsonLdReadiness.programs = this.data.programs.length
    this.report.jsonLdReadiness.experiences = this.data.experiences.length
    this.report.jsonLdReadiness.solutions = this.data.solutions.length
    this.report.jsonLdReadiness.posts = this.data.posts.length
    this.report.jsonLdReadiness.pages = 8 // Main pages
  }
}

async function main() {
  const isDryRun = !process.argv.includes('--apply')
  const inputPath = join(process.cwd(), 'src/content/en.json')
  const outputPath = join(process.cwd(), 'src/content/en.migrated.json')
  const reportPath = join(process.cwd(), 'src/content/en.report.json')

  try {
    console.log(`📖 Reading content from ${inputPath}`)
    const rawData = readFileSync(inputPath, 'utf8')
    const data: ContentData = JSON.parse(rawData)

    const validator = new ContentValidator(data, isDryRun)
    const { data: migratedData, report } = await validator.validateAndMigrate()

    // Write migrated content
    console.log(`💾 Writing migrated content to ${outputPath}`)
    writeFileSync(outputPath, JSON.stringify(migratedData, null, 2))

    // Write report
    console.log(`📊 Writing report to ${reportPath}`)
    writeFileSync(reportPath, JSON.stringify(report, null, 2))

    // Apply changes if requested
    if (!isDryRun) {
      console.log(`🔄 Applying changes to ${inputPath}`)
      writeFileSync(inputPath, JSON.stringify(migratedData, null, 2))
      console.log('✅ Changes applied successfully!')
    } else {
      console.log('🔍 Dry run complete. Use --apply to apply changes.')
    }

    // Print summary
    console.log('\n📈 Migration Summary:')
    console.log(`  Programs: ${report.summary.totalPrograms}`)
    console.log(`  Experiences: ${report.summary.totalExperiences}`)
    console.log(`  Solutions: ${report.summary.totalSolutions}`)
    console.log(`  Posts: ${report.summary.totalPosts}`)
    console.log(`  Duplicates removed: ${report.summary.duplicatesRemoved}`)
    console.log(`  SEO added: ${report.summary.seoAdded}`)
    console.log(`  Links fixed: ${report.summary.linksFixed}`)

  } catch (error) {
    console.error('❌ Error during validation:', error)
    process.exit(1)
  }
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { ContentValidator }
