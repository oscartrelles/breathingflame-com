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
  QuerySnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from '@/services/firebase'

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

// Specific hooks for our CMS collections
export function useSettings() {
  return useDocument('settings', 'site')
}

export function useNavigation() {
  return useDocument('navigation', 'main')
}

export function useHome() {
  return useDocument('home', 'content')
}

export function usePrograms() {
  return useCollection('programs', [orderBy('order', 'asc')])
}

export function useExperiences() {
  return useCollection('experiences', [orderBy('order', 'asc')])
}

export function usePosts() {
  return useCollection('posts', [
    where('published', '==', true),
    orderBy('publishedAt', 'desc')
  ])
}

export function useTestimonials() {
  return useCollection('testimonials', [
    where('featured', '==', true),
    orderBy('createdAt', 'desc')
  ])
}

export function useCaseStudies() {
  return useCollection('caseStudies', [
    orderBy('order', 'asc')
  ])
}

export function useEvents() {
  return useCollection('eventsPinned', [
    where('active', '==', true),
    orderBy('startDate', 'desc')
  ])
}

// Hook for getting a specific post by slug
export function usePost(slug: string) {
  return useCollection('posts', [
    where('slug', '==', slug),
    where('published', '==', true),
    limit(1)
  ], !!slug)
}

// Hook for getting featured testimonials
export function useFeaturedTestimonials(limitCount: number = 6) {
  return useCollection('testimonials', [
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ])
}

