import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { AdminTopBar } from './AdminTopBar'
import { db } from '@/services/firebase'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import styles from './ProgramsManagement.module.css'

interface Program {
  id: string
  title: string
  summary?: string
  description?: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    if (!db) {
      setLoading(false)
      return
    }

    try {
      const programsSnapshot = await getDocs(collection(db, 'programs'))
      const programsData = programsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Program[]
      
      setPrograms(programsData)
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!db) return
    
    try {
      await deleteDoc(doc(db, 'programs', id))
      setPrograms(programs.filter(program => program.id !== id))
    } catch (error) {
      console.error('Error deleting program:', error)
    }
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || program.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading programs...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: 'Programs Management - Breathing Flame' }} />
      
      <div className={styles.container}>
        <AdminTopBar backTo="/admin" actions={(<Link to="/admin/programs/new" className="btn btn--primary">New Program</Link>)} />

        <div className={styles.mainContent}>
          <h1 className={styles.title}>Programs Management</h1>
          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search programs..."
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

          {/* Programs List */}
          <div className={styles.programsList}>
            {filteredPrograms.map((program) => (
              <div key={program.id} className={styles.programCard}>
                <div className={styles.programInfo}>
                  <h3 className={styles.programTitle}>{program.title}</h3>
                  {program.summary && (
                    <p className={styles.programSummary}>{program.summary}</p>
                  )}
                  <div className={styles.programMeta}>
                    <span className={`${styles.status} ${styles[program.status]}`}>
                      {program.status}
                    </span>
                    <span className={styles.updatedAt}>
                      Updated: {new Date(program.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={styles.programActions}>
                  <Link
                    to={`/admin/programs/${program.id}`}
                    className={styles.editButton}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <h3>No programs found</h3>
              <p>Create your first program to get started.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

