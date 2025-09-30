import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { AdminTopBar } from './AdminTopBar'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'
import styles from './ProgramsManagement.module.css'

interface Page {
  id: string
  title: string
  updatedAt: string
}

export function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true)
      try {
        const snapshot = await getDocs(collection(db, 'pages'))
        const pagesData: Page[] = snapshot.docs.map(d => {
          const data: any = d.data()
          return {
            id: d.id,
            title: data.hero?.headline || data.title || d.id,
            updatedAt: data.updatedAt || new Date().toISOString()
          }
        })
        setPages(pagesData)
      } catch (error) {
        console.error('Error fetching pages:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPages()
  }, [])

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className={styles.loadingText}>Loading pages...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: 'Manage Pages - Breathing Flame' }} />
      <div className={styles.container}>
        <AdminTopBar title="Pages Management" subtitle="Manage all your website pages and content." />

        <div className={styles.mainContent}>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search pages..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredPages.length === 0 ? (
            <p className={styles.emptyState}>No pages found. {searchTerm && `for "${searchTerm}"`}</p>
          ) : (
            <div className={styles.programsGrid}>
              {filteredPages.map(page => (
                <div key={page.id} className={styles.programCard}>
                  <h3 className={styles.programTitle}>{page.title}</h3>
                  <p className={styles.programSlug}>{page.id}</p>
                  <p className={styles.programUpdated}>Last Updated: {formatDate(page.updatedAt)}</p>
                  <div className={styles.programActions}>
                    <Link to={`/admin/pages/${page.id}`} className={styles.editButton}>
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
