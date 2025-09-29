import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { ImportedTestimonial, FirestoreTestimonial } from './types'

export interface TestimonialTag {
  id: string
  name: string
  type: 'program' | 'experience' | 'solution' | 'featured' | 'custom'
  targetId?: string // ID of the program/experience/solution
  description?: string
  color?: string
  order?: number
  active: boolean
}

export interface TestimonialMapping {
  testimonialId: string
  tags: string[] // Tag IDs
  programs: string[] // Program IDs
  experiences: string[] // Experience IDs
  solutions: string[] // Solution IDs
  featuredSpaces: string[] // Where to feature: 'home', 'individuals', 'organizations', 'programs', 'about'
  priority: number // 1-10, higher = more important
  autoTagged: boolean // Whether tags were applied automatically
  lastUpdated: Date
}

export class TestimonialTagger {
  private db: any
  private tags: Map<string, TestimonialTag> = new Map()
  private mappings: Map<string, TestimonialMapping> = new Map()

  constructor() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID
    }

    const app = initializeApp(firebaseConfig)
    this.db = getFirestore(app)
  }

  async initializeDefaultTags(): Promise<void> {
    const defaultTags: TestimonialTag[] = [
      // Program tags
      { id: 'rac', name: 'Reverse Aging Challenge', type: 'program', targetId: 'rac', color: '#FF6B6B', order: 1, active: true },
      { id: 'unblocked', name: 'Unblocked in Ten Weeks', type: 'program', targetId: 'unblocked', color: '#4ECDC4', order: 2, active: true },
      { id: 'unstoppable', name: 'Unstoppable', type: 'program', targetId: 'unstoppable', color: '#45B7D1', order: 3, active: true },
      
      // Experience tags
      { id: 'whm', name: 'Wim Hof Method', type: 'experience', targetId: 'whm', color: '#96CEB4', order: 4, active: true },
      { id: '9d-breathwork', name: '9D Breathwork', type: 'experience', targetId: '9d-breathwork', color: '#FFEAA7', order: 5, active: true },
      
      // Featured space tags
      { id: 'home-featured', name: 'Home Page Featured', type: 'featured', color: '#DDA0DD', order: 10, active: true },
      { id: 'individuals-featured', name: 'Individuals Page Featured', type: 'featured', color: '#98D8C8', order: 11, active: true },
      { id: 'organizations-featured', name: 'Organizations Page Featured', type: 'featured', color: '#F7DC6F', order: 12, active: true },
      { id: 'programs-featured', name: 'Programs Page Featured', type: 'featured', color: '#BB8FCE', order: 13, active: true },
      { id: 'about-featured', name: 'About Page Featured', type: 'featured', color: '#85C1E9', order: 14, active: true },
      
      // Content-based tags
      { id: 'energy', name: 'Energy & Vitality', type: 'custom', color: '#FF9F43', order: 20, active: true },
      { id: 'stress-relief', name: 'Stress Relief', type: 'custom', color: '#6C5CE7', order: 21, active: true },
      { id: 'breathwork', name: 'Breathwork', type: 'custom', color: '#00B894', order: 22, active: true },
      { id: 'transformation', name: 'Transformation', type: 'custom', color: '#E17055', order: 23, active: true },
      { id: 'focus', name: 'Focus & Clarity', type: 'custom', color: '#74B9FF', order: 24, active: true },
      { id: 'sleep', name: 'Sleep & Recovery', type: 'custom', color: '#A29BFE', order: 25, active: true },
      { id: 'anxiety', name: 'Anxiety Relief', type: 'custom', color: '#FD79A8', order: 26, active: true },
      { id: 'pain-relief', name: 'Pain Relief', type: 'custom', color: '#FDCB6E', order: 27, active: true },
      { id: 'immune-system', name: 'Immune System', type: 'custom', color: '#55A3FF', order: 28, active: true },
      { id: 'fitness', name: 'Fitness & Performance', type: 'custom', color: '#00CEC9', order: 29, active: true },
      
      // Quality tags
      { id: 'excellent', name: 'Excellent Reviews', type: 'custom', color: '#00B894', order: 30, active: true },
      { id: 'detailed', name: 'Detailed Reviews', type: 'custom', color: '#6C5CE7', order: 31, active: true },
      { id: 'video', name: 'Video Testimonials', type: 'custom', color: '#E17055', order: 32, active: true },
      { id: 'verified', name: 'Verified Reviews', type: 'custom', color: '#00CEC9', order: 33, active: true }
    ]

    for (const tag of defaultTags) {
      await this.createTag(tag)
    }

    console.log(`✅ Initialized ${defaultTags.length} default tags`)
  }

  async createTag(tag: TestimonialTag): Promise<void> {
    try {
      await setDoc(doc(this.db, 'testimonialTags', tag.id), tag)
      this.tags.set(tag.id, tag)
    } catch (error) {
      console.error(`Error creating tag ${tag.id}:`, error)
      throw error
    }
  }

  async getTags(): Promise<TestimonialTag[]> {
    try {
      const tagsRef = collection(this.db, 'testimonialTags')
      const q = query(tagsRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(q)
      
      const tags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TestimonialTag))
      
      // Update local cache
      this.tags.clear()
      tags.forEach(tag => this.tags.set(tag.id, tag))
      
      return tags
    } catch (error) {
      console.error('Error fetching tags:', error)
      return []
    }
  }

  async autoTagTestimonials(testimonials: ImportedTestimonial[]): Promise<TestimonialMapping[]> {
    const mappings: TestimonialMapping[] = []
    
    for (const testimonial of testimonials) {
      const mapping: TestimonialMapping = {
        testimonialId: testimonial.id,
        tags: [],
        programs: [],
        experiences: [],
        solutions: [],
        featuredSpaces: [],
        priority: this.calculatePriority(testimonial),
        autoTagged: true,
        lastUpdated: new Date()
      }

      // Auto-tag based on content analysis
      await this.autoTagByContent(testimonial, mapping)
      
      // Auto-tag based on source platform
      this.autoTagBySource(testimonial, mapping)
      
      // Auto-tag for featured spaces based on quality
      this.autoTagForFeaturedSpaces(testimonial, mapping)
      
      mappings.push(mapping)
    }

    return mappings
  }

  private async autoTagByContent(testimonial: ImportedTestimonial, mapping: TestimonialMapping): Promise<void> {
    const text = testimonial.text.toLowerCase()
    const tags = testimonial.tags || []
    
    // Map content tags to program/experience tags
    const contentMappings = {
      'energy': ['rac', 'whm'],
      'vitality': ['rac', 'whm'],
      'stress': ['rac', 'whm', '9d-breathwork'],
      'breathwork': ['whm', '9d-breathwork'],
      'wim hof': ['whm'],
      'cold': ['whm'],
      'ice': ['whm'],
      'transformation': ['rac', 'unblocked', 'unstoppable'],
      'clarity': ['unblocked'],
      'focus': ['unblocked', 'whm'],
      'coaching': ['unblocked'],
      'block': ['unblocked'],
      'momentum': ['unblocked'],
      'breakthrough': ['unstoppable'],
      'sustained': ['unstoppable'],
      'long-term': ['unstoppable']
    }

    // Check for program/experience mentions
    for (const [keyword, targetIds] of Object.entries(contentMappings)) {
      if (text.includes(keyword) || tags.includes(keyword.replace(' ', '-'))) {
        for (const targetId of targetIds) {
          if (this.tags.has(targetId)) {
            const tag = this.tags.get(targetId)!
            if (tag.type === 'program') {
              mapping.programs.push(targetId)
            } else if (tag.type === 'experience') {
              mapping.experiences.push(targetId)
            }
            mapping.tags.push(targetId)
          }
        }
      }
    }

    // Add custom content tags
    const customTags = ['energy', 'stress-relief', 'breathwork', 'transformation', 'focus', 'sleep', 'anxiety', 'pain-relief', 'immune-system', 'fitness']
    for (const tagId of customTags) {
      if (tags.includes(tagId.replace('-', ' ')) || text.includes(tagId.replace('-', ' '))) {
        mapping.tags.push(tagId)
      }
    }

    // Add quality tags
    if (testimonial.rating >= 5) {
      mapping.tags.push('excellent')
    }
    if (testimonial.text.length > 200) {
      mapping.tags.push('detailed')
    }
    if (testimonial.verified) {
      mapping.tags.push('verified')
    }
  }

  private autoTagBySource(testimonial: ImportedTestimonial, mapping: TestimonialMapping): void {
    // Google reviews are generally more trustworthy
    if (testimonial.source?.platform === 'google') {
      mapping.priority = Math.min(10, mapping.priority + 2)
    }
    
    // Trustpilot reviews are also verified
    if (testimonial.source?.platform === 'trustpilot') {
      mapping.priority = Math.min(10, mapping.priority + 1)
    }
  }

  private autoTagForFeaturedSpaces(testimonial: ImportedTestimonial, mapping: TestimonialMapping): void {
    // High-quality testimonials get featured
    if (testimonial.rating >= 5 && testimonial.text.length > 100) {
      mapping.featuredSpaces.push('home-featured')
    }
    
    // Program-specific testimonials get featured on their pages
    if (mapping.programs.length > 0) {
      mapping.featuredSpaces.push('programs-featured')
    }
    
    // Experience-specific testimonials get featured on individuals page
    if (mapping.experiences.length > 0) {
      mapping.featuredSpaces.push('individuals-featured')
    }
    
    // High-priority testimonials get featured on about page
    if (mapping.priority >= 8) {
      mapping.featuredSpaces.push('about-featured')
    }
  }

  private calculatePriority(testimonial: ImportedTestimonial): number {
    let priority = 5 // Base priority
    
    // Rating boost
    priority += testimonial.rating - 3
    
    // Length boost
    if (testimonial.text.length > 200) priority += 1
    if (testimonial.text.length > 500) priority += 1
    
    // Verification boost
    if (testimonial.verified) priority += 1
    
    // Sentiment boost
    if (testimonial.sentiment === 'positive') priority += 1
    
    // Source boost
    if (testimonial.source?.platform === 'google') priority += 1
    
    return Math.max(1, Math.min(10, priority))
  }

  async saveMappings(mappings: TestimonialMapping[]): Promise<void> {
    for (const mapping of mappings) {
      try {
        await setDoc(doc(this.db, 'testimonialMappings', mapping.testimonialId), mapping)
        this.mappings.set(mapping.testimonialId, mapping)
      } catch (error) {
        console.error(`Error saving mapping for ${mapping.testimonialId}:`, error)
      }
    }
  }

  async clearMappings(): Promise<void> {
    try {
      const { writeBatch } = await import('firebase/firestore')
      const mappingsRef = collection(this.db, 'testimonialMappings')
      const snapshot = await getDocs(mappingsRef)
      const batch = writeBatch(this.db)
      snapshot.docs.forEach(d => batch.delete(doc(this.db, 'testimonialMappings', d.id)))
      await batch.commit()
      console.log(`🗑️ Cleared ${snapshot.size} testimonial mappings`)
    } catch (error) {
      console.error('Error clearing testimonial mappings:', error)
      throw error
    }
  }

  async getMappings(): Promise<TestimonialMapping[]> {
    try {
      const mappingsRef = collection(this.db, 'testimonialMappings')
      const q = query(mappingsRef, orderBy('priority', 'desc'))
      const snapshot = await getDocs(q)
      
      const mappings = snapshot.docs.map(doc => ({
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      } as TestimonialMapping))
      
      // Update local cache
      this.mappings.clear()
      mappings.forEach(mapping => this.mappings.set(mapping.testimonialId, mapping))
      
      return mappings
    } catch (error) {
      console.error('Error fetching mappings:', error)
      return []
    }
  }

  async getTestimonialsForProgram(programId: string): Promise<FirestoreTestimonial[]> {
    const mappings = await this.getMappings()
    const programMappings = mappings.filter(m => m.programs.includes(programId))
    
    const testimonials: FirestoreTestimonial[] = []
    for (const mapping of programMappings) {
      try {
        const testimonial = await this.getTestimonialById(mapping.testimonialId)
        if (testimonial) {
          testimonials.push(testimonial)
        }
      } catch (error) {
        console.error(`Error fetching testimonial ${mapping.testimonialId}:`, error)
      }
    }
    
    return testimonials.sort((a, b) => {
      const aMapping = this.mappings.get(a.id)
      const bMapping = this.mappings.get(b.id)
      return (bMapping?.priority || 0) - (aMapping?.priority || 0)
    })
  }

  async getTestimonialsForExperience(experienceId: string): Promise<FirestoreTestimonial[]> {
    const mappings = await this.getMappings()
    const experienceMappings = mappings.filter(m => m.experiences.includes(experienceId))
    
    const testimonials: FirestoreTestimonial[] = []
    for (const mapping of experienceMappings) {
      try {
        const testimonial = await this.getTestimonialById(mapping.testimonialId)
        if (testimonial) {
          testimonials.push(testimonial)
        }
      } catch (error) {
        console.error(`Error fetching testimonial ${mapping.testimonialId}:`, error)
      }
    }
    
    return testimonials.sort((a, b) => {
      const aMapping = this.mappings.get(a.id)
      const bMapping = this.mappings.get(b.id)
      return (bMapping?.priority || 0) - (aMapping?.priority || 0)
    })
  }

  async getFeaturedTestimonials(space: string, limit: number = 3): Promise<FirestoreTestimonial[]> {
    const mappings = await this.getMappings()
    const featuredMappings = mappings.filter(m => m.featuredSpaces.includes(space))
    
    const testimonials: FirestoreTestimonial[] = []
    for (const mapping of featuredMappings.slice(0, limit)) {
      try {
        const testimonial = await this.getTestimonialById(mapping.testimonialId)
        if (testimonial) {
          testimonials.push(testimonial)
        }
      } catch (error) {
        console.error(`Error fetching testimonial ${mapping.testimonialId}:`, error)
      }
    }
    
    return testimonials.sort((a, b) => {
      const aMapping = this.mappings.get(a.id)
      const bMapping = this.mappings.get(b.id)
      return (bMapping?.priority || 0) - (aMapping?.priority || 0)
    })
  }

  private async getTestimonialById(id: string): Promise<FirestoreTestimonial | null> {
    try {
      const testimonialRef = doc(this.db, 'testimonials', id)
      const testimonialDoc = await getDocs(query(collection(this.db, 'testimonials'), where('__name__', '==', id)))
      
      if (testimonialDoc.empty) return null
      
      return {
        id: testimonialDoc.docs[0].id,
        ...testimonialDoc.docs[0].data()
      } as FirestoreTestimonial
    } catch (error) {
      console.error(`Error fetching testimonial ${id}:`, error)
      return null
    }
  }

  async updateTestimonialMapping(testimonialId: string, updates: Partial<TestimonialMapping>): Promise<void> {
    try {
      const currentMapping = this.mappings.get(testimonialId) || {
        testimonialId,
        tags: [],
        programs: [],
        experiences: [],
        solutions: [],
        featuredSpaces: [],
        priority: 5,
        autoTagged: false,
        lastUpdated: new Date()
      }

      const updatedMapping = {
        ...currentMapping,
        ...updates,
        lastUpdated: new Date()
      }

      await setDoc(doc(this.db, 'testimonialMappings', testimonialId), updatedMapping)
      this.mappings.set(testimonialId, updatedMapping)
    } catch (error) {
      console.error(`Error updating mapping for ${testimonialId}:`, error)
      throw error
    }
  }
}

