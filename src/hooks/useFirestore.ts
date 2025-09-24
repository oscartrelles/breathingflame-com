import { useState, useEffect } from 'react'
import { 
  doc, 
  collection, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  DocumentData,
  Unsubscribe
} from 'firebase/firestore'
import { db } from '@/services/firebase'
import { mockSettings, mockNavigation, mockHome, mockPrograms, mockExperiences, mockTestimonials, mockPosts, mockPageIndividuals, mockPageOrganizations, mockPagePrograms } from '@/services/mockData'
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
  const [data, setData] = useState(mockSettings)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function useNavigation() {
  const [data, setData] = useState(mockNavigation)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function useHome() {
  const [data, setData] = useState(mockHome)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function usePrograms() {
  const [data, setData] = useState(mockPrograms)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}


export function usePosts() {
  const [data, setData] = useState(mockPosts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function useTestimonials() {
  const [data, setData] = useState(mockTestimonials)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function useCaseStudies() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function useEvents() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

// Hook for getting a specific post by slug
export function usePost(slug: string) {
  const [data, setData] = useState(mockPosts.find(post => post.slug === slug) || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

// Hook for getting featured testimonials
export function useFeaturedTestimonials(limitCount: number = 6) {
  const [data, setData] = useState(mockTestimonials.slice(0, limitCount))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function usePageIndividuals() {
  const [data, setData] = useState(mockPageIndividuals)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function usePageOrganizations() {
  const [data, setData] = useState(mockPageOrganizations)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function usePagePrograms() {
  const [data, setData] = useState(mockPagePrograms)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function useExperiences() {
  const [data, setData] = useState(mockExperiences)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  return { data, loading, error }
}

export function useAllOfferings() {
  const { data: programs } = usePrograms()
  const { data: experiences } = useExperiences()
  const [data, setData] = useState<Offering[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (programs && experiences) {
      const mergedOfferings: Offering[] = [
        ...programs.map(program => ({ ...program, kind: 'program' as const })),
        ...experiences.map(experience => ({ ...experience, kind: 'experience' as const }))
      ].sort((a, b) => {
        // Sort by order if present, otherwise by title
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order
        }
        return a.title.localeCompare(b.title)
      })
      
      setData(mergedOfferings)
    }
  }, [programs, experiences])

  return { data, loading, error }
}

