import { useState, useEffect } from 'react'
import { 
  doc, 
  collection, 
  query, 
  onSnapshot,
  DocumentData
} from 'firebase/firestore'
import { db } from '@/services/firebase'
// Mock data imports removed - now using static content
import { 
  useHome as useHomeContent,
  usePrograms as useProgramsContent,
  useExperiences as useExperiencesContent,
  useSolutions as useSolutionsContent,
  usePosts as usePostsContent,
  useTestimonials as useTestimonialsContent,
  useSettings as useSettingsContent,
  useNavigation as useNavigationContent,
  usePageIndividuals as usePageIndividualsContent,
  usePageOrganizations as usePageOrganizationsContent,
  usePagePrograms as usePageProgramsContent,
  usePageEvents as usePageEventsContent,
  usePageResources as usePageResourcesContent,
  usePageTestimonials as usePageTestimonialsContent,
  usePageContact as usePageContactContent,
  usePageCommunity as usePageCommunityContent,
  usePagePress as usePagePressContent,
  usePageSearch as usePageSearchContent,
  usePageNotFound as usePageNotFoundContent,
  useResourcePeakEnergyProfiler as useResourcePeakEnergyProfilerContent,
  useResourceIgniteYourFlame as useResourceIgniteYourFlameContent,
  useAbout as useAboutContent,
  useAllOfferingsLite as useAllOfferingsLiteContent,
  useLatestPostsLite as useLatestPostsLiteContent,
  usePostBySlug as usePostBySlugContent
} from './useContent'
import { Offering } from '@/types'

// Generic hook for single document
export function useDocument<T = DocumentData>(
  collectionPath: string,
  docId: string,
  enabled: boolean = true
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled || !docId) {
      setLoading(false)
      return
    }

    const docRef = doc(db, collectionPath, docId)

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T)
        } else {
          setData(null)
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [collectionPath, docId, enabled])

  return { data, loading, error }
}

// Generic hook for collection
export function useCollection<T = DocumentData>(
  collectionPath: string,
  constraints: any[] = [],
  enabled: boolean = true
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    const collectionRef = collection(db, collectionPath)
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[]
        setData(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [collectionPath, enabled, ...constraints])

  return { data, loading, error }
}

// Specific hooks for our CMS collections (using mock data for development)
export function useSettings() {
  return useSettingsContent()
}

export function useNavigation() {
  return useNavigationContent()
}

export function useHome() {
  return useHomeContent()
}

export function usePrograms() {
  return useProgramsContent()
}


export function usePosts() {
  return usePostsContent()
}

export function useTestimonials() {
  return useTestimonialsContent()
}

export function useCaseStudies() {
  return { data: [], loading: false, error: null }
}

export function useEvents() {
  return { data: [], loading: false, error: null }
}

// Hook for getting a specific post by slug
export function usePost(slug: string) {
  return usePostBySlugContent(slug)
}

export function usePageResources() {
  return usePageResourcesContent()
}

export function usePostsFiltered(params?: { tag?: string; search?: string; limit?: number; offset?: number }) {
  const { tag, search, limit, offset } = params || {}
  const { data: posts, loading, error } = usePostsContent()
  
  let filtered = [...(posts || [])]
  if (tag && tag !== 'All') filtered = filtered.filter(p => p.tags?.includes(tag))
  if (search && search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
    )
  }
  filtered.sort((a, b) => {
    // Handle both Date objects and Firestore timestamp objects
    const getTime = (publishedAt: any) => {
      if (publishedAt instanceof Date) {
        return publishedAt.getTime()
      }
      if (publishedAt && typeof publishedAt === 'object' && publishedAt.seconds) {
        return publishedAt.seconds * 1000 + (publishedAt.nanoseconds || 0) / 1000000
      }
      if (typeof publishedAt === 'string') {
        return new Date(publishedAt).getTime()
      }
      return 0
    }
    return getTime(b.publishedAt) - getTime(a.publishedAt)
  })
  const start = offset || 0
  const end = limit ? start + limit : undefined
  const slice = filtered.slice(start, end)
  
  return { data: slice, loading, error, total: filtered.length }
}

// Hook for getting featured testimonials
export function useFeaturedTestimonials(limitCount: number = 6) {
  const { data: testimonials, loading, error } = useTestimonialsContent()
  const data = (testimonials || []).slice(0, limitCount)
  return { data, loading, error }
}

export function usePageIndividuals() {
  return usePageIndividualsContent()
}

export function usePageOrganizations() {
  return usePageOrganizationsContent()
}

export function usePagePrograms() {
  return usePageProgramsContent()
}

export function useAbout() {
  return useAboutContent()
}

export function usePageEvents() {
  return usePageEventsContent()
}

export function useExperiences() {
  return useExperiencesContent()
}

export function useSolutions() {
  return useSolutionsContent()
}

export function usePageTestimonials() {
  return usePageTestimonialsContent()
}

export function usePageContact() {
  return usePageContactContent()
}

// Lightweight hooks for 404 page
export function useAllOfferingsLite() {
  return useAllOfferingsLiteContent()
}

export function useLatestPostsLite(_limit: number = 5) {
  return useLatestPostsLiteContent()
}

// Solutions hooks - already defined above

export function useSolutionBySlug(slug: string) {
  const { data, loading, error } = useSolutions()
  const solution = data?.find(s => s.slug === slug) || null
  return { data: solution, loading, error }
}

export function useAllOfferings() {
  const { data: programs, loading: programsLoading, error: programsError } = usePrograms()
  const { data: experiences, loading: experiencesLoading, error: experiencesError } = useExperiences()
  const { data: solutions, loading: solutionsLoading, error: solutionsError } = useSolutions()
  const [data, setData] = useState<Offering[]>([])

  useEffect(() => {
    if (programs && experiences && solutions) {
      const mergedOfferings: Offering[] = [
        ...programs.map(program => ({ ...program, kind: 'programs' as const })),
        ...experiences.map(experience => ({ ...experience, kind: 'experiences' as const })),
        ...solutions.map(solution => ({ ...solution, kind: 'solutions' as const }))
      ].sort((a, b) => {
        // Sort by order if present, otherwise by title
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order
        }
        return a.title.localeCompare(b.title)
      })
      
      // Only update if the data has actually changed
      setData(prevData => {
        if (prevData.length !== mergedOfferings.length) {
          return mergedOfferings
        }
        
        // Check if any items have changed
        const hasChanged = prevData.some((prevItem, index) => {
          const newItem = mergedOfferings[index]
          return !newItem || prevItem.id !== newItem.id || prevItem.title !== newItem.title
        })
        
        return hasChanged ? mergedOfferings : prevData
      })
    }
  }, [programs, experiences, solutions])

  return { 
    data, 
    loading: programsLoading || experiencesLoading || solutionsLoading, 
    error: programsError || experiencesError || solutionsError 
  }
}

// Community page hook
export function usePageCommunity() {
  const { data, loading, error } = usePageCommunityContent()
  return { data, loading, error }
}

// Press page hook
export function usePagePress() {
  const { data, loading, error } = usePagePressContent()
  return { data, loading, error }
}

// Search page hook
export function usePageSearch() {
  return usePageSearchContent()
}

// 404 Not Found page hook
export function usePageNotFound() {
  return usePageNotFoundContent()
}

// Resource page hooks
export function useResourceIgniteYourFlame() {
  return useResourceIgniteYourFlameContent()
}

export function useResourcePeakEnergyProfiler() {
  return useResourcePeakEnergyProfilerContent()
}


