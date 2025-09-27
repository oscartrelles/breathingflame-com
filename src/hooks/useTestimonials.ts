import { useState, useEffect } from 'react'

interface Testimonial {
  id: string
  text: string
  author: {
    name: string
    title: string
    company: string
    avatar: string
  }
  rating: number
  verified: boolean
  featured: boolean
  tags: string[]
  priority?: number
  sourceUrl?: string
}

interface TestimonialData {
  testimonials: Testimonial[]
  programTestimonials: Record<string, Testimonial[]>
  experienceTestimonials: Record<string, Testimonial[]>
  featuredTestimonials: Record<string, Testimonial[]>
}

export function useTestimonials() {
  const [data, setData] = useState<TestimonialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch from static file first
        const response = await fetch('/data/testimonials.json')
        if (response.ok) {
          const testimonialData = await response.json()
          setData(testimonialData)
        } else {
          // Fallback to Firestore
          const firestoreData = await fetchFromFirestore()
          setData(firestoreData)
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials')
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return { data, loading, error }
}

export function useTestimonialsForProgram(programId: string) {
  const { data, loading, error } = useTestimonials()
  
  const programTestimonials = data?.programTestimonials[programId] || []
  
  return {
    testimonials: programTestimonials,
    loading,
    error
  }
}

export function useTestimonialsForExperience(experienceId: string) {
  const { data, loading, error } = useTestimonials()
  
  const experienceTestimonials = data?.experienceTestimonials[experienceId] || []
  
  return {
    testimonials: experienceTestimonials,
    loading,
    error
  }
}

export function useFeaturedTestimonials(space: string, limit: number = 3) {
  const { data, loading, error } = useTestimonials()
  
  const featuredTestimonials = data?.featuredTestimonials[space]?.slice(0, limit) || []
  
  return {
    testimonials: featuredTestimonials,
    loading,
    error
  }
}

async function fetchFromFirestore(): Promise<TestimonialData> {
  // This would be implemented to fetch from Firestore
  // For now, return empty data
  return {
    testimonials: [],
    programTestimonials: {},
    experienceTestimonials: {},
    featuredTestimonials: {}
  }
}

