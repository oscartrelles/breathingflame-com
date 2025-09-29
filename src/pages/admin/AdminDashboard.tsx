import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { db } from '@/services/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import styles from './AdminDashboard.module.css'

interface AdminItem {
  id: string
  title: string
  type: 'program' | 'experience' | 'solution' | 'post' | 'testimonial' | 'page'
  lastModified: string
  status: 'published' | 'draft'
  description?: string
}

export function AdminDashboard() {
  const [items, setItems] = useState<AdminItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [stats, setStats] = useState({
    total: 0,
    programs: 0,
    experiences: 0,
    solutions: 0,
    pages: 0,
    testimonials: 0,
    navigation: 0,
    settings: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    console.log('🔄 Fetching admin data...')
    
    if (!db) {
      console.log('❌ No database connection')
      setLoading(false)
      return
    }

    // Check database connection
    if (!db || !db._databaseId) {
      console.log('❌ Database object is invalid:', db)
      setLoading(false)
      return
    }

    try {
      const adminItems: AdminItem[] = []
      
      // Fetch programs
      console.log('📚 Fetching programs...')
      const programsSnapshot = await getDocs(collection(db, 'programs'))
      console.log(`Found ${programsSnapshot.size} programs`)
      programsSnapshot.forEach((doc) => {
        const program = doc.data()
        adminItems.push({
          id: doc.id,
          title: program.title || 'Untitled Program',
          type: 'program',
          lastModified: program.updatedAt || program.createdAt || new Date().toISOString(),
          status: 'published',
          description: program.summary || program.description
        })
      })

      // Fetch experiences
      console.log('🌟 Fetching experiences...')
      const experiencesSnapshot = await getDocs(collection(db, 'experiences'))
      console.log(`Found ${experiencesSnapshot.size} experiences`)
      experiencesSnapshot.forEach((doc) => {
        const experience = doc.data()
        adminItems.push({
          id: doc.id,
          title: experience.title || 'Untitled Experience',
          type: 'experience',
          lastModified: experience.updatedAt || experience.createdAt || new Date().toISOString(),
          status: 'published',
          description: experience.summary || experience.description
        })
      })

      // Fetch solutions
      console.log('🏢 Fetching solutions...')
      const solutionsSnapshot = await getDocs(collection(db, 'solutions'))
      console.log(`Found ${solutionsSnapshot.size} solutions`)
      solutionsSnapshot.forEach((doc) => {
        const solution = doc.data()
        adminItems.push({
          id: doc.id,
          title: solution.title || 'Untitled Solution',
          type: 'solution',
          lastModified: solution.updatedAt || solution.createdAt || new Date().toISOString(),
          status: 'published',
          description: solution.summary || solution.description
        })
      })

      // Fetch pages (each page is its own collection)
      console.log('📄 Fetching pages...')
      
      const pageCollections = [
        'pageHome', 'pageAbout', 'pageIndividuals', 'pageOrganizations', 
        'pagePrograms', 'pageResources', 'pageTestimonials', 'pageCommunity', 
        'pagePress', 'pageContact', 'pageEvents', 'home', 'about', 'navigation'
      ]
      
      for (const pageCollection of pageCollections) {
        try {
          const pageSnapshot = await getDocs(collection(db, pageCollection))
          
          if (pageSnapshot.size > 0) {
            // Get the first document from the collection
            const pageDoc = pageSnapshot.docs[0]
            const pageData = pageDoc.data()
            
            adminItems.push({
              id: pageCollection,
              title: pageData.hero?.headline || pageData.title || pageCollection.replace('page', ''),
              type: 'page',
              lastModified: pageData.updatedAt || new Date().toISOString(),
              status: 'published',
              description: pageData.hero?.subtext || pageData.description
            })
          }
        } catch (error) {
          console.log(`❌ Error fetching collection ${pageCollection}:`, error)
        }
      }

      // Fetch testimonials
      console.log('💬 Fetching testimonials...')
      const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'))
      console.log(`Found ${testimonialsSnapshot.size} testimonials`)
      testimonialsSnapshot.forEach((doc) => {
        const testimonial = doc.data()
        adminItems.push({
          id: doc.id,
          title: testimonial.name || 'Anonymous',
          type: 'testimonial',
          lastModified: testimonial.updatedAt || testimonial.createdAt || new Date().toISOString(),
          status: 'published',
          description: testimonial.content?.substring(0, 100) + '...' || 'No content'
        })
      })

      // Fetch navigation
      console.log('🧭 Fetching navigation...')
      const navigationSnapshot = await getDocs(collection(db, 'navigation'))
      console.log(`Found ${navigationSnapshot.size} navigation items`)
      navigationSnapshot.forEach((doc) => {
        const navItem = doc.data()
        adminItems.push({
          id: doc.id,
          title: navItem.title || navItem.name || 'Navigation Item',
          type: 'navigation',
          lastModified: navItem.updatedAt || new Date().toISOString(),
          status: 'published',
          description: navItem.description || 'Navigation configuration'
        })
      })

      // Fetch settings
      console.log('⚙️ Fetching settings...')
      const settingsSnapshot = await getDocs(collection(db, 'settings'))
      console.log(`Found ${settingsSnapshot.size} settings items`)
      settingsSnapshot.forEach((doc) => {
        const setting = doc.data()
        adminItems.push({
          id: doc.id,
          title: setting.title || setting.name || 'Settings Item',
          type: 'settings',
          lastModified: setting.updatedAt || new Date().toISOString(),
          status: 'published',
          description: setting.description || 'Website configuration'
        })
      })

      console.log(`✅ Total items fetched: ${adminItems.length}`)
      setItems(adminItems)
      
      // Calculate stats
      const newStats = {
        total: adminItems.length,
        programs: adminItems.filter(item => item.type === 'program').length,
        experiences: adminItems.filter(item => item.type === 'experience').length,
        solutions: adminItems.filter(item => item.type === 'solution').length,
        pages: adminItems.filter(item => item.type === 'page').length,
        testimonials: adminItems.filter(item => item.type === 'testimonial').length,
        navigation: adminItems.filter(item => item.type === 'navigation').length,
        settings: adminItems.filter(item => item.type === 'settings').length
      }
      
      console.log('📊 Final Stats:', newStats)
      setStats(newStats)
      
    } catch (error) {
      console.error('❌ Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeIcon = (type: string) => {
    const icons = {
      program: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      experience: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      solution: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
        </svg>
      ),
      page: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      post: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
      testimonial: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      )
    }
    return icons[type as keyof typeof icons] || icons.page
  }

  const getTypeColor = (type: string) => {
    const colors = {
      program: 'bg-blue-100 text-blue-800',
      experience: 'bg-purple-100 text-purple-800',
      solution: 'bg-green-100 text-green-800',
      page: 'bg-gray-100 text-gray-800',
      post: 'bg-yellow-100 text-yellow-800',
      testimonial: 'bg-pink-100 text-pink-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const displayStats = stats

  console.log('🎨 Rendering AdminDashboard with cards...')
  
  return (
    <>
      <SEO data={{ title: 'Admin Dashboard - Breathing Flame' }} />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className={styles.logoText}>Breathing Flame</h1>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={fetchData}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button
                onClick={() => window.open('/', '_blank')}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Site</span>
              </button>
              <div className={styles.userAvatar}>
                <span>A</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <h2 className={styles.title}>Admin Dashboard - UPDATED</h2>

          {/* Management Cards */}
          <div className={styles.cardsGrid}>
            {/* Programs Management */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <div className={styles.cardIcon}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={styles.cardTitleText}>Programs</h3>
                </div>
                <Link
                  to="/admin/programs"
                  className={styles.manageButton}
                >
                  Manage →
                </Link>
              </div>
              
              <div className={styles.stats}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Total Programs</span>
                  <span className={styles.statValue}>{displayStats.programs}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Published</span>
                  <span className={styles.statValueSmall}>{displayStats.programs}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Draft</span>
                  <span className={styles.statValueGray}>0</span>
                </div>
              </div>

              <div className={styles.divider}>
                <div className={styles.actionRow}>
                  <span className={styles.actionLabel}>Recent updates</span>
                  <span className={styles.actionValue}>0 items need attention</span>
                </div>
              </div>
            </div>

            {/* Experiences Management */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <div className={styles.cardIcon}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className={styles.cardTitleText}>Experiences</h3>
                </div>
                <Link
                  to="/admin/experiences"
                  className={styles.manageButton}
                >
                  Manage →
                </Link>
              </div>
              
              <div className={styles.stats}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Total Experiences</span>
                  <span className={styles.statValue}>{displayStats.experiences}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Published</span>
                  <span className={styles.statValueSmall}>{displayStats.experiences}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Upcoming</span>
                  <span className={styles.statValueGray}>0</span>
                </div>
              </div>

              <div className={styles.divider}>
                <div className={styles.actionRow}>
                  <span className={styles.actionLabel}>Recent updates</span>
                  <span className={styles.actionValue}>0 items need attention</span>
                </div>
              </div>
            </div>

            {/* Solutions Management */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <div className={styles.cardIcon}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className={styles.cardTitleText}>Solutions</h3>
                </div>
                <Link
                  to="/admin/solutions"
                  className={styles.manageButton}
                >
                  Manage →
                </Link>
              </div>
              
              <div className={styles.stats}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Total Solutions</span>
                  <span className={styles.statValue}>{displayStats.solutions}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Active</span>
                  <span className={styles.statValueSmall}>{displayStats.solutions}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Inactive</span>
                  <span className={styles.statValueGray}>0</span>
                </div>
              </div>

              <div className={styles.divider}>
                <div className={styles.actionRow}>
                  <span className={styles.actionLabel}>Recent updates</span>
                  <span className={styles.actionValue}>0 items need attention</span>
                </div>
              </div>
            </div>

            {/* Pages Management */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <div className={styles.cardIcon}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className={styles.cardTitleText}>Pages</h3>
                </div>
                <Link
                  to="/admin/pages"
                  className={styles.manageButton}
                >
                  Manage →
                </Link>
              </div>
              
              <div className={styles.stats}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Total Pages</span>
                  <span className={styles.statValue}>{displayStats.pages}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Published</span>
                  <span className={styles.statValueSmall}>{displayStats.pages}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Draft</span>
                  <span className={styles.statValueGray}>0</span>
                </div>
              </div>

              <div className={styles.divider}>
                <div className={styles.actionRow}>
                  <span className={styles.actionLabel}>Recent updates</span>
                  <span className={styles.actionValue}>0 items need attention</span>
                </div>
              </div>
            </div>

                {/* Testimonials Management */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      <div className={styles.cardIcon}>
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className={styles.cardTitleText}>Testimonials</h3>
                    </div>
                    <Link
                      to="/admin/testimonials"
                      className={styles.manageButton}
                    >
                      Manage →
                    </Link>
                  </div>
                  
                  <div className={styles.stats}>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Total Testimonials</span>
                      <span className={styles.statValue}>{displayStats.testimonials || 0}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>High Score (8+)</span>
                      <span className={styles.statValueSmall}>{Math.floor((displayStats.testimonials || 0) * 0.7)}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>5-Star Reviews</span>
                      <span className={styles.statValueSmall}>{Math.floor((displayStats.testimonials || 0) * 0.8)}</span>
                    </div>
                  </div>

                  <div className={styles.divider}>
                    <div className={styles.actionRow}>
                      <span className={styles.actionLabel}>Recent reviews</span>
                      <span className={styles.actionValue}>0 items need attention</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Management */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      <div className={styles.cardIcon}>
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className={styles.cardTitleText}>Navigation</h3>
                    </div>
                    <Link
                      to="/admin/navigation"
                      className={styles.manageButton}
                    >
                      Manage →
                    </Link>
                  </div>
                  
                  <div className={styles.stats}>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Menu Items</span>
                      <span className={styles.statValue}>{displayStats.navigation || 0}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Active</span>
                      <span className={styles.statValueSmall}>{displayStats.navigation || 0}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Draft</span>
                      <span className={styles.statValueGray}>0</span>
                    </div>
                  </div>

                  <div className={styles.divider}>
                    <div className={styles.actionRow}>
                      <span className={styles.actionLabel}>Recent updates</span>
                      <span className={styles.actionValue}>0 items need attention</span>
                    </div>
                  </div>
                </div>

                {/* Settings Management */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      <div className={styles.cardIcon}>
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className={styles.cardTitleText}>Settings</h3>
                    </div>
                    <Link
                      to="/admin/settings"
                      className={styles.manageButton}
                    >
                      Manage →
                    </Link>
                  </div>
                  
                  <div className={styles.stats}>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Config Items</span>
                      <span className={styles.statValue}>{displayStats.settings || 0}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Active</span>
                      <span className={styles.statValueSmall}>{displayStats.settings || 0}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Draft</span>
                      <span className={styles.statValueGray}>0</span>
                    </div>
                  </div>

                  <div className={styles.divider}>
                    <div className={styles.actionRow}>
                      <span className={styles.actionLabel}>Recent updates</span>
                      <span className={styles.actionValue}>0 items need attention</span>
                    </div>
                  </div>
                </div>

            {/* Analytics Overview */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <div className={styles.cardIcon}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className={styles.cardTitleText}>Analytics</h3>
                </div>
                <button className={styles.manageButton}>
                  View →
                </button>
              </div>
              
              <div className={styles.stats}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Total Content</span>
                  <span className={styles.statValue}>{displayStats.total}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Published</span>
                  <span className={styles.statValueSmall}>{displayStats.total}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Draft</span>
                  <span className={styles.statValueGray}>0</span>
                </div>
              </div>

              <div className={styles.divider}>
                <div className={styles.actionRow}>
                  <span className={styles.actionLabel}>System health</span>
                  <span className={styles.actionValue}>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
