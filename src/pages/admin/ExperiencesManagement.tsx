import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { AdminTopBar } from './AdminTopBar'
import { db } from '@/services/firebase'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import styles from './ProgramsManagement.module.css'

interface Experience {
  id: string
  title: string
  summary?: string
  description?: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export function ExperiencesManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    if (!db) {
      setLoading(false)
      return
    }

    try {
      const experiencesSnapshot = await getDocs(collection(db, 'experiences'))
      const experiencesData = experiencesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Experience[]
      
      setExperiences(experiencesData)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!db) return
    
    try {
      await deleteDoc(doc(db, 'experiences', id))
      setExperiences(experiences.filter(experience => experience.id !== id))
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || experience.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading experiences...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: 'Experiences Management - Breathing Flame' }} />
      
      <div className={styles.container}>
        <AdminTopBar 
          backTo="/admin"
          actions={(<Link to="/admin/experiences/new" className="btn btn--primary">New Experience</Link>)}
        />

        <div className={styles.mainContent}>
          <h1 className={styles.title}>Experiences Management</h1>
          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Experiences List */}
          <div className={styles.programsList}>
            {filteredExperiences.map((experience) => (
              <div key={experience.id} className={styles.programCard}>
                <div className={styles.programInfo}>
                  <h3 className={styles.programTitle}>{experience.title}</h3>
                  {experience.summary && (
                    <p className={styles.programSummary}>{experience.summary}</p>
                  )}
                  <div className={styles.programMeta}>
                    <span className={`${styles.status} ${styles[experience.status]}`}>
                      {experience.status}
                    </span>
                    <span className={styles.updatedAt}>
                      Updated: {new Date(experience.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={styles.programActions}>
                  <Link
                    to={`/admin/experiences/${experience.id}`}
                    className={styles.editButton}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredExperiences.length === 0 && (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3>No experiences found</h3>
              <p>Create your first experience to get started.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

