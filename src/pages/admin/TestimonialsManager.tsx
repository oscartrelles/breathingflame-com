import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { AdminTopBar } from './AdminTopBar'
import { db } from '@/services/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import styles from './ProgramsManagement.module.css'

interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  source: string
  avatar?: string
  tags: string[]
  score: number
  createdAt: string
  updatedAt: string
}

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [sortBy, setSortBy] = useState('score')
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // Helpers to normalize imported testimonial fields
  const coerceName = (raw: any): string => {
    if (typeof raw === 'string') return raw
    if (raw && typeof raw === 'object') {
      const full = raw.fullName || raw.name
      const first = raw.firstName || raw.given_name || raw.givenName
      const last = raw.lastName || raw.family_name || raw.familyName
      if (typeof full === 'string') return full
      if (typeof first === 'string' || typeof last === 'string') {
        return [first, last].filter(Boolean).join(' ').trim()
      }
    }
    return 'Anonymous'
  }

  const coerceAvatar = (raw: any): string | undefined => {
    const candidate = raw?.avatar || raw?.avatarUrl || raw?.avatarURL || raw?.photoURL || raw?.photoUrl || raw?.profilePhotoUrl || raw?.picture || raw?.image || raw?.img || raw?.avatarPath || raw?.avatarFilename || raw
    if (!candidate) return undefined
    if (typeof candidate !== 'string') return undefined
    // Trim whitespace and strip accidental surrounding quotes from CSV/Firestore imports
    const value = candidate.trim().replace(/^"|"$/g, '')
    // If it's already absolute (http) or absolute path (/), return as is
    if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value
    // Otherwise assume it is a filename under our static avatars folder
    return `/images/reviews/avatars/${value}`
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    if (!db) {
      setLoading(false)
      return
    }

    try {
      const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'))
      const testimonialsData: Testimonial[] = []
      
      testimonialsSnapshot.forEach((d) => {
        const data: any = d.data()
        // Prefer nested author fields (matches front-end/TestimonialComponent)
        const resolvedName: string = coerceName(
          data.author?.name ?? data.name ?? data.displayName ?? data.reviewerName ?? data.user?.name
        )
        const resolvedAvatar: string | undefined = coerceAvatar(
          data.author?.avatar ?? data.avatar
        )
        const resolvedSource: string = String(data.source ?? data.platform ?? data.origin ?? 'Unknown')

        testimonialsData.push({
          id: d.id,
          name: resolvedName,
          content: typeof data.content === 'string' ? data.content : (typeof data.text === 'string' ? data.text : (typeof data.review === 'string' ? data.review : '')),
          rating: Number(typeof data.rating === 'number' ? data.rating : (data.stars ?? 5)) || 5,
          source: resolvedSource,
          avatar: resolvedAvatar,
          tags: Array.isArray(data.tags) ? data.tags : (Array.isArray(data.labels) ? data.labels : []),
          score: typeof data.score === 'number' ? data.score : 0,
          createdAt: data.createdAt || data.date || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        })
      })

      setTestimonials(testimonialsData)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setMessage('Error fetching testimonials.')
    } finally {
      setLoading(false)
    }
  }

  const toLower = (v: unknown): string => (typeof v === 'string' ? v.toLowerCase() : String(v ?? '').toLowerCase())

  // --- Duplicate detection & cleanup ---
  // Exact-match dedupe: author (name) + full content (verbatim), minor cleanup for quotes/outer spaces only
  const stripQuotes = (s: unknown): string => (typeof s === 'string' ? s.replace(/^"|"$/g, '') : '')
  const makeDedupKey = (t: Testimonial): string => {
    const name = stripQuotes(t.name).trim()
    const content = stripQuotes(t.content).trim()
    return `${name}|${content}`
  }

  const findDuplicates = (items: Testimonial[]): { keeper: Testimonial; dupes: Testimonial[] }[] => {
    const groups = new Map<string, Testimonial[]>()
    items.forEach((t) => {
      const key = makeDedupKey(t)
      const arr = groups.get(key) || []
      arr.push(t)
      groups.set(key, arr)
    })
    const results: { keeper: Testimonial; dupes: Testimonial[] }[] = []
    groups.forEach((arr) => {
      if (arr.length <= 1) return
      const sorted = [...arr].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      results.push({ keeper: sorted[0], dupes: sorted.slice(1) })
    })
    return results
  }

  const dedupeNow = async () => {
    if (!db) return
    const clusters = findDuplicates(testimonials)
    const idsToDelete = clusters.flatMap((c) => c.dupes.map((d) => d.id))
    if (idsToDelete.length === 0) {
      setMessage('No duplicates found.')
      return
    }
    const ok = window.confirm(`Found ${idsToDelete.length} duplicates across ${clusters.length} groups. Delete duplicates and keep most recent?`)
    if (!ok) return
    try {
      setLoading(true)
      for (const id of idsToDelete) {
        await deleteDoc(doc(db, 'testimonials', id))
      }
      setMessage(`Removed ${idsToDelete.length} duplicate testimonial(s).`)
      await fetchTestimonials()
    } catch (err) {
      console.error('Error during dedupe:', err)
      setMessage('Error during dedupe.')
    } finally {
      setLoading(false)
    }
  }

  // Compute a display score when stored score is 0/missing
  const computeScore = (t: Testimonial): number => {
    const ratingPart = Math.max(0, Math.min(10, ((t.rating || 0) / 5) * 6))
    const tagsCount = Array.isArray(t.tags) ? t.tags.length : 0
    const tagsPart = Math.max(0, Math.min(2, (Math.min(tagsCount, 6) / 6) * 2))
    const textLen = typeof t.content === 'string' ? t.content.trim().length : 0
    const lengthPart = Math.max(0, Math.min(1.5, (Math.min(textLen, 300) / 300) * 1.5))
    let recencyPart = 0
    const ts = Date.parse(t.updatedAt || t.createdAt)
    if (!Number.isNaN(ts)) {
      const months = Math.max(0, (Date.now() - ts) / (1000 * 60 * 60 * 24 * 30))
      const f = 1 - Math.min(months, 24) / 24
      recencyPart = Math.max(0, 0.5 * f)
    }
    const total = ratingPart + tagsPart + lengthPart + recencyPart
    return Math.max(0, Math.min(10, Number(total.toFixed(1))))
  }

  const filteredTestimonials = testimonials
    .filter((testimonial) => {
      const nameL = toLower(testimonial.name)
      const contentL = toLower(testimonial.content)
      const sourceL = toLower(testimonial.source)
      const query = toLower(searchTerm)

      const matchesSearch = nameL.includes(query) || contentL.includes(query) || sourceL.includes(query)
      const matchesTag = filterTag === 'all' || (Array.isArray(testimonial.tags) && testimonial.tags.includes(filterTag))
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return computeScore(b) - computeScore(a)
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        default:
          return 0
      }
    })

  const allTags = Array.from(new Set(testimonials.flatMap(t => t.tags))).sort()

  const handleBulkAction = async (action: string) => {
    if (selectedTestimonials.length === 0) return

    try {
      setLoading(true)
      
      if (action === 'delete') {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedTestimonials.length} testimonials?`)
        if (!confirmDelete) return

        for (const id of selectedTestimonials) {
          await deleteDoc(doc(db, 'testimonials', id))
        }
        setMessage(`Successfully deleted ${selectedTestimonials.length} testimonials.`)
      } else if (action === 'tag') {
        const tag = prompt('Enter tag to add to selected testimonials:')
        if (!tag) return

        for (const id of selectedTestimonials) {
          const testimonial = testimonials.find(t => t.id === id)
          if (testimonial && !testimonial.tags.includes(tag)) {
            await updateDoc(doc(db, 'testimonials', id), {
              tags: [...testimonial.tags, tag],
              updatedAt: new Date().toISOString()
            })
          }
        }
        setMessage(`Successfully added tag "${tag}" to ${selectedTestimonials.length} testimonials.`)
      }

      setSelectedTestimonials([])
      await fetchTestimonials()
    } catch (error) {
      console.error('Error performing bulk action:', error)
      setMessage('Error performing bulk action.')
    } finally {
      setLoading(false)
    }
  }

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return styles.scoreHigh
    if (score >= 6) return styles.scoreMedium
    return styles.scoreLow
  }

  const getInitial = (name: unknown): string => {
    const s = typeof name === 'string' ? name : String(name ?? '')
    const ch = s.trim().charAt(0).toUpperCase()
    return ch || 'A'
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading testimonials...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: 'Testimonials Manager - Breathing Flame' }} />
      <div className={styles.container}>
        <AdminTopBar backTo="/admin" />
        <div className={styles.mainContent}>
          <div className={styles.headerSection}>
            <h1 className={styles.title}>Testimonials Manager</h1>
            <div className={styles.headerActions}>
              <Link to="/admin/testimonials-migration" className={styles.migrationButton}>
                🌐 Multilingual Migration
              </Link>
            </div>
          </div>
          
          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Testimonials List */}
          <div className={styles.programsList}>
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className={styles.programCard}>
                <div className={styles.programInfo}>
                  <h3 className={styles.programTitle}>{testimonial.name}</h3>
                  <p className={styles.programSummary}>{testimonial.content}</p>
                  <div className={styles.programMeta}>
                    <span className={styles.status}>
                      {testimonial.rating}★ {testimonial.source}
                    </span>
                    <span className={styles.updatedAt}>
                      Updated: {new Date(testimonial.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={styles.programActions}>
                  <button
                    onClick={() => navigate(`/admin/testimonials/${testimonial.id}`)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => window.open(`/testimonials#${testimonial.id}`, '_blank', 'noopener')}
                    className={styles.deleteButton}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3>No testimonials found</h3>
              <p>Create your first testimonial to get started.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
