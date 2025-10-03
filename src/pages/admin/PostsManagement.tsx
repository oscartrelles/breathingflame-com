import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { AdminTopBar } from './AdminTopBar'
import { db } from '@/services/firebase'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import styles from './PostsManagement.module.css'

interface Post {
  id: string
  title: string
  summary?: string
  description?: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
  publishedAt?: string
  author?: {
    name: string
    email?: string
  }
  tags?: string[]
  featured?: boolean
}

export function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterFeatured, setFilterFeatured] = useState<string>('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    if (!db) {
      setLoading(false)
      return
    }

    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'))
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
      
      // Sort by updatedAt descending
      postsData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      
      setPosts(postsData)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'posts', id))
      setPosts(posts.filter(post => post.id !== id))
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    
    const matchesFeatured = filterFeatured === 'all' || 
                           (filterFeatured === 'featured' && post.featured) ||
                           (filterFeatured === 'regular' && !post.featured)
    
    return matchesSearch && matchesStatus && matchesFeatured
  })

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
      <div className={styles.container}>
        <AdminTopBar />
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <SEO data={{ title: 'Posts Management - Admin' }} />
      <AdminTopBar />
      
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Posts Management</h1>
          <p className={styles.subtitle}>Manage blog posts and articles</p>
        </div>
        <div className={styles.actions}>
          <Link to="/admin/posts/new" className={styles.primaryButton}>
            + New Post
          </Link>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Posts</option>
            <option value="featured">Featured</option>
            <option value="regular">Regular</option>
          </select>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{posts.length}</div>
          <div className={styles.statLabel}>Total Posts</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{posts.filter(p => p.status === 'published').length}</div>
          <div className={styles.statLabel}>Published</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{posts.filter(p => p.status === 'draft').length}</div>
          <div className={styles.statLabel}>Drafts</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{posts.filter(p => p.featured).length}</div>
          <div className={styles.statLabel}>Featured</div>
        </div>
      </div>

      <div className={styles.content}>
        {filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>No posts found</h3>
            <p>
              {searchTerm || filterStatus !== 'all' || filterFeatured !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Create your first post to get started.'}
            </p>
            <Link to="/admin/posts/new" className={styles.primaryButton}>
              + New Post
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredPosts.map((post) => (
              <div key={post.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <h3>{post.title}</h3>
                    <div className={styles.badges}>
                      {post.featured && (
                        <span className={styles.badge + ' ' + styles.featuredBadge}>
                          Featured
                        </span>
                      )}
                      <span className={`${styles.badge} ${styles[post.status]}`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <Link 
                      to={`/admin/posts/${post.id}`} 
                      className={styles.actionButton}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  {post.summary && (
                    <p className={styles.summary}>{post.summary}</p>
                  )}
                  
                  <div className={styles.meta}>
                    <div className={styles.metaItem}>
                      <strong>Author:</strong> {post.author?.name || 'Unknown'}
                    </div>
                    <div className={styles.metaItem}>
                      <strong>Updated:</strong> {formatDate(post.updatedAt)}
                    </div>
                    {post.publishedAt && (
                      <div className={styles.metaItem}>
                        <strong>Published:</strong> {formatDate(post.publishedAt)}
                      </div>
                    )}
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.tags}>
                      {post.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostsManagement
