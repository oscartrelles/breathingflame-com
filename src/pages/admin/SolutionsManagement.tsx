import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { AdminTopBar } from './AdminTopBar'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'
import styles from './ProgramsManagement.module.css'

interface Solution {
  id: string
  title: string
  slug: string
  updatedAt: string
}

export function SolutionsManagement() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchSolutions = async () => {
      setIsLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, 'solutions'))
        const fetchedSolutions: Solution[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug,
          updatedAt: doc.data().updatedAt || new Date().toISOString(),
        }))
        setSolutions(fetchedSolutions)
      } catch (error) {
        console.error('Error fetching solutions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSolutions()
  }, [])

  const filteredSolutions = solutions.filter(solution =>
    solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solution.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading solutions...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: 'Manage Solutions - Breathing Flame' }} />
      <div className={styles.container}>
        <AdminTopBar 
          backTo="/admin"
          actions={(<Link to="/admin/solutions/new" className="btn btn--primary">+ New Solution</Link>)}
        />

        <div className={styles.mainContent}>
          <h1 className={styles.title}>Solutions Management</h1>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search solutions..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredSolutions.length === 0 ? (
            <p className={styles.emptyState}>No solutions found. {searchTerm && `for "${searchTerm}"`}</p>
          ) : (
            <div className={styles.programsGrid}>
              {filteredSolutions.map(solution => (
                <div key={solution.id} className={styles.programCard}>
                  <h3 className={styles.programTitle}>{solution.title}</h3>
                  <p className={styles.programSlug}>{solution.slug}</p>
                  <p className={styles.programUpdated}>Last Updated: {formatDate(solution.updatedAt)}</p>
                  <div className={styles.programActions}>
                    <Link to={`/admin/solutions/${solution.id}`} className={styles.editButton}>
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

