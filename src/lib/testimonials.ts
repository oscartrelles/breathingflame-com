export interface Testimonial {
  id: string
  author: {
    name: string
    role?: string
  }
  text: string
  rating?: number // 1-5
  tags: string[]
  refs?: {
    programSlugs?: string[]
    experienceSlugs?: string[]
    solutionSlugs?: string[]
  }
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface TestimonialSelectionOptions {
  route: string
  context?: {
    programSlug?: string
    experienceSlug?: string
    solutionSlug?: string
    audience?: 'individuals' | 'organizations'
  }
  minRating?: number // default 4
  maxCount?: number // default 6
  diversity?: {
    byAuthor?: boolean // default true
    byTag?: boolean // default false
  }
  preferFeatured?: boolean // default true
}

/**
 * Select testimonials based on context, rating, and diversity criteria
 */
export function selectTestimonials(
  testimonials: Testimonial[],
  options: TestimonialSelectionOptions
): Testimonial[] {
  const {
    route,
    context,
    minRating = 4,
    maxCount = 6,
    diversity = { byAuthor: true, byTag: false },
    preferFeatured = true
  } = options

  // Start with all testimonials
  let pool = [...testimonials]

  // Filter by context
  if (context?.programSlug) {
    pool = pool.filter(t => 
      t.refs?.programSlugs?.includes(context.programSlug!) || 
      t.tags.some(tag => tag.toLowerCase().includes('program'))
    )
  } else if (context?.experienceSlug) {
    pool = pool.filter(t => 
      t.refs?.experienceSlugs?.includes(context.experienceSlug!) || 
      t.tags.some(tag => tag.toLowerCase().includes('experience'))
    )
  } else if (context?.solutionSlug) {
    pool = pool.filter(t => 
      t.refs?.solutionSlugs?.includes(context.solutionSlug!) || 
      t.tags.some(tag => tag.toLowerCase().includes('solution'))
    )
  } else if (context?.audience) {
    pool = pool.filter(t => 
      t.tags.some(tag => 
        tag.toLowerCase().includes(context.audience!) || 
        tag.toLowerCase().includes('general')
      )
    )
  } else {
    // Map route to audience for general filtering
    const audience = getAudienceFromRoute(route)
    if (audience) {
      pool = pool.filter(t => 
        t.tags.some(tag => 
          tag.toLowerCase().includes(audience) || 
          tag.toLowerCase().includes('general')
        )
      )
    }
  }

  // Filter by minimum rating
  pool = pool.filter(t => (t.rating || 5) >= minRating)

  // If no context matches, fall back to high-rated general testimonials
  if (pool.length === 0) {
    pool = testimonials.filter(t => (t.rating || 5) >= minRating)
  }

  // Sort by featured status if preferred
  if (preferFeatured) {
    pool.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
  }

  // Apply diversity constraints
  const selected: Testimonial[] = []
  const usedAuthors = new Set<string>()
  const usedTags = new Set<string>()

  // First pass: select featured testimonials
  if (preferFeatured) {
    for (const testimonial of pool) {
      if (testimonial.featured && selected.length < maxCount) {
        if (diversity.byAuthor && usedAuthors.has(testimonial.author.name)) continue
        if (diversity.byTag && testimonial.tags.some(tag => usedTags.has(tag))) continue

        selected.push(testimonial)
        usedAuthors.add(testimonial.author.name)
        if (diversity.byTag) {
          testimonial.tags.forEach(tag => usedTags.add(tag))
        }
      }
    }
  }

  // Second pass: fill remaining slots
  for (const testimonial of pool) {
    if (selected.length >= maxCount) break
    if (selected.includes(testimonial)) continue

    if (diversity.byAuthor && usedAuthors.has(testimonial.author.name)) continue
    if (diversity.byTag && testimonial.tags.some(tag => usedTags.has(tag))) continue

    selected.push(testimonial)
    usedAuthors.add(testimonial.author.name)
    if (diversity.byTag) {
      testimonial.tags.forEach(tag => usedTags.add(tag))
    }
  }

  // If we still need more testimonials and diversity is too strict, relax constraints
  if (selected.length < maxCount && pool.length > selected.length) {
    const remaining = pool.filter(t => !selected.includes(t))
    const needed = maxCount - selected.length
    
    // Shuffle remaining testimonials deterministically based on route
    const shuffled = shuffleArray(remaining, route)
    
    for (let i = 0; i < Math.min(needed, shuffled.length); i++) {
      selected.push(shuffled[i])
    }
  }

  return selected
}

/**
 * Map route to audience type for general filtering
 */
function getAudienceFromRoute(route: string): 'individuals' | 'organizations' | null {
  if (route.includes('/individuals') || route.includes('/programs')) {
    return 'individuals'
  }
  if (route.includes('/organizations') || route.includes('/solutions')) {
    return 'organizations'
  }
  return null
}

/**
 * Shuffle array deterministically based on seed
 */
function shuffleArray<T>(array: T[], seed: string): T[] {
  const shuffled = [...array]
  let seedNum = 0
  
  // Convert seed string to number
  for (let i = 0; i < seed.length; i++) {
    seedNum += seed.charCodeAt(i)
  }
  
  // Simple seeded shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    seedNum = (seedNum * 9301 + 49297) % 233280
    const j = Math.floor((seedNum / 233280) * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

/**
 * Get testimonials for a specific program
 */
export function getTestimonialsForProgram(
  testimonials: Testimonial[],
  programSlug: string,
  maxCount: number = 6
): Testimonial[] {
  return selectTestimonials(testimonials, {
    route: `/programs/${programSlug}`,
    context: { programSlug },
    maxCount
  })
}

/**
 * Get testimonials for a specific experience
 */
export function getTestimonialsForExperience(
  testimonials: Testimonial[],
  experienceSlug: string,
  maxCount: number = 6
): Testimonial[] {
  return selectTestimonials(testimonials, {
    route: `/experiences/${experienceSlug}`,
    context: { experienceSlug },
    maxCount
  })
}

/**
 * Get testimonials for a specific solution
 */
export function getTestimonialsForSolution(
  testimonials: Testimonial[],
  solutionSlug: string,
  maxCount: number = 6
): Testimonial[] {
  return selectTestimonials(testimonials, {
    route: `/solutions/${solutionSlug}`,
    context: { solutionSlug },
    maxCount
  })
}

/**
 * Get testimonials for home page (mixed audience)
 */
export function getTestimonialsForHome(
  testimonials: Testimonial[],
  maxCount: number = 6
): Testimonial[] {
  return selectTestimonials(testimonials, {
    route: '/',
    maxCount
  })
}

/**
 * Get testimonials for individuals page
 */
export function getTestimonialsForIndividuals(
  testimonials: Testimonial[],
  maxCount: number = 6
): Testimonial[] {
  return selectTestimonials(testimonials, {
    route: '/individuals',
    context: { audience: 'individuals' },
    maxCount
  })
}

/**
 * Get testimonials for organizations page
 */
export function getTestimonialsForOrganizations(
  testimonials: Testimonial[],
  maxCount: number = 6
): Testimonial[] {
  return selectTestimonials(testimonials, {
    route: '/organizations',
    context: { audience: 'organizations' },
    maxCount
  })
}
