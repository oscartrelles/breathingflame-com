import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'
import styles from './ProgramsManagement.module.css'

interface NavigationItem {
  id: string
  title: string
  updatedAt: string
}

export function NavigationManagement() {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchNavigation = async () => {
      setIsLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, 'navigation'))
        const fetchedItems: NavigationItem[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || doc.data().name || 'Navigation Item',
          updatedAt: doc.data().updatedAt || new Date().toISOString(),
        }))
        setNavigationItems(fetchedItems)
      } catch (error) {
        console.error('Error fetching navigation:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNavigation()
  }, [])

  const filteredItems = navigationItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className={styles.loadingText}>Loading navigation...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: 'Manage Navigation - Breathing Flame' }} />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <h1>Navigation Management</h1>
              <p>Manage your website navigation structure and menu items.</p>
            </div>
            <div className={styles.headerActions}>
              <button onClick={() => window.open('/', '_blank')} className={styles.viewSiteButton}>
                View Site
              </button>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search navigation items..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredItems.length === 0 ? (
            <p className={styles.emptyState}>No navigation items found. {searchTerm && `for "${searchTerm}"`}</p>
          ) : (
            <div className={styles.programsGrid}>
              {filteredItems.map(item => (
                <div key={item.id} className={styles.programCard}>
                  <h3 className={styles.programTitle}>{item.title}</h3>
                  <p className={styles.programSlug}>{item.id}</p>
                  <p className={styles.programUpdated}>Last Updated: {formatDate(item.updatedAt)}</p>
                  <div className={styles.programActions}>
                    <Link to={`/admin/navigation/${item.id}`} className={styles.editButton}>
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

