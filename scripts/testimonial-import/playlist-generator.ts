import { FirestoreTestimonial } from './types'

export interface PlaylistConfig {
  programId: string
  programName: string
  tags: string[]
  maxTestimonials: number
}

export interface GeneratedPlaylists {
  home: string[]
  testimonials: string[]
  programs: Record<string, string[]>
  experiences: Record<string, string[]>
  solutions: Record<string, string[]>
}

export class PlaylistGenerator {
  private testimonials: FirestoreTestimonial[] = []
  
  // Program/Experience configurations
  private programConfigs: PlaylistConfig[] = [
    {
      programId: 'reverse-aging-challenge',
      programName: 'Reverse Aging Challenge',
      tags: ['longevity', 'healthspan', 'breathwork', 'movement', 'fasting', 'resilience', 'energy', 'sleep'],
      maxTestimonials: 3
    },
    {
      programId: 'unblocked-in-ten-weeks',
      programName: 'Unblocked in Ten Weeks',
      tags: ['clarity', 'coaching', 'performance', 'decision-making', 'momentum', 'overwhelm'],
      maxTestimonials: 3
    },
    {
      programId: 'unstoppable',
      programName: 'Unstoppable',
      tags: ['performance', 'mastery', 'sustainability', 'capacity', 'breakthrough', 'consistency'],
      maxTestimonials: 3
    },
    {
      programId: 'wim-hof-method',
      programName: 'Wim Hof Method Workshop',
      tags: ['breathwork', 'cold-exposure', 'resilience', 'energy', 'workshop', 'in-person'],
      maxTestimonials: 3
    },
    {
      programId: '9d-breathwork',
      programName: '9D Breathwork Journey',
      tags: ['breathwork', 'transformation', 'release', 'stress', 'journey', 'in-person'],
      maxTestimonials: 3
    }
  ]

  private experienceConfigs: PlaylistConfig[] = [
    {
      programId: 'wim-hof-method',
      programName: 'Wim Hof Method Workshop',
      tags: ['breathwork', 'cold-exposure', 'resilience', 'energy', 'workshop', 'in-person'],
      maxTestimonials: 3
    },
    {
      programId: '9d-breathwork',
      programName: '9D Breathwork Journey',
      tags: ['breathwork', 'transformation', 'release', 'stress', 'journey', 'in-person'],
      maxTestimonials: 3
    }
  ]

  private solutionConfigs: PlaylistConfig[] = [
    {
      programId: 'stress-management-masterclass',
      programName: 'Stress Management Masterclass',
      tags: ['stress', 'teams', 'pressure', 'focus', 'calm', 'organizations'],
      maxTestimonials: 3
    },
    {
      programId: 'breathwork-for-teams',
      programName: 'Breathwork for Teams',
      tags: ['breathwork', 'teams', 'energy', 'cohesion', 'organizations', 'reset'],
      maxTestimonials: 3
    },
    {
      programId: 'wim-hof-method-corporate',
      programName: 'Wim Hof Method Corporate Workshops',
      tags: ['breathwork', 'cold-exposure', 'resilience', 'leadership', 'corporate', 'organizations'],
      maxTestimonials: 3
    },
    {
      programId: 'business-constellations',
      programName: 'Business Constellations',
      tags: ['constellations', 'systemic', 'alignment', 'decisions', 'leadership', 'organizations'],
      maxTestimonials: 3
    },
    {
      programId: 'executive-leadership-coaching',
      programName: 'Executive & Leadership Coaching',
      tags: ['coaching', 'leadership', 'executive', 'clarity', 'performance', 'organizations'],
      maxTestimonials: 3
    }
  ]

  setTestimonials(testimonials: FirestoreTestimonial[]) {
    this.testimonials = testimonials
  }

  private calculateRelevanceScore(testimonial: FirestoreTestimonial, targetTags: string[]): number {
    let score = 0
    
    // Base score from rating (1-5 stars)
    score += testimonial.rating * 2
    
    // Bonus for featured testimonials
    if (testimonial.featured) {
      score += 5
    }
    
    // Tag matching bonus
    const matchingTags = testimonial.tags.filter(tag => 
      targetTags.some(targetTag => 
        tag.toLowerCase().includes(targetTag.toLowerCase()) ||
        targetTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
    score += matchingTags.length * 3
    
    // Text quality bonus (longer, more detailed testimonials)
    if (testimonial.text && testimonial.text.length > 100) {
      score += 2
    }
    if (testimonial.text && testimonial.text.length > 200) {
      score += 3
    }
    
    // Verified bonus
    if (testimonial.verified) {
      score += 1
    }
    
    return score
  }

  private selectBestTestimonials(targetTags: string[], maxCount: number): string[] {
    const scored = this.testimonials.map(testimonial => ({
      id: testimonial.id,
      score: this.calculateRelevanceScore(testimonial, targetTags)
    }))
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxCount)
      .map(item => item.id)
  }

  generatePlaylists(): GeneratedPlaylists {
    const playlists: GeneratedPlaylists = {
      home: [],
      testimonials: [],
      programs: {},
      experiences: {},
      solutions: {}
    }

    // Home page: top 10 highest-scoring testimonials
    const homeScored = this.testimonials.map(testimonial => ({
      id: testimonial.id,
      score: this.calculateRelevanceScore(testimonial, ['excellent', 'amazing', 'transformative', 'life-changing', 'incredible'])
    }))
    
    playlists.home = homeScored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.id)

    // Testimonials page: all testimonials (organized by tags)
    playlists.testimonials = this.testimonials.map(t => t.id)

    // Program playlists
    for (const config of this.programConfigs) {
      playlists.programs[config.programId] = this.selectBestTestimonials(config.tags, config.maxTestimonials)
    }

    // Experience playlists
    for (const config of this.experienceConfigs) {
      playlists.experiences[config.programId] = this.selectBestTestimonials(config.tags, config.maxTestimonials)
    }

    // Solution playlists
    for (const config of this.solutionConfigs) {
      playlists.solutions[config.programId] = this.selectBestTestimonials(config.tags, config.maxTestimonials)
    }

    return playlists
  }

  generateReport(playlists: GeneratedPlaylists): string {
    let report = '🎵 Playlist Generation Report\n\n'
    
    report += `📊 Total Testimonials: ${this.testimonials.length}\n`
    report += `🏠 Home Page: ${playlists.home.length} testimonials\n`
    report += `📝 Testimonials Page: ${playlists.testimonials.length} testimonials\n\n`
    
    report += '📚 Program Playlists:\n'
    for (const [programId, testimonialIds] of Object.entries(playlists.programs)) {
      const config = this.programConfigs.find(c => c.programId === programId)
      report += `  • ${config?.programName || programId}: ${testimonialIds.length} testimonials\n`
    }
    
    report += '\n🎯 Experience Playlists:\n'
    for (const [experienceId, testimonialIds] of Object.entries(playlists.experiences)) {
      const config = this.experienceConfigs.find(c => c.programId === experienceId)
      report += `  • ${config?.programName || experienceId}: ${testimonialIds.length} testimonials\n`
    }
    
    report += '\n🏢 Solution Playlists:\n'
    for (const [solutionId, testimonialIds] of Object.entries(playlists.solutions)) {
      const config = this.solutionConfigs.find(c => c.programId === solutionId)
      report += `  • ${config?.programName || solutionId}: ${testimonialIds.length} testimonials\n`
    }
    
    return report
  }
}

