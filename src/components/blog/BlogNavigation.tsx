import { Link } from 'react-router-dom'
import { usePosts } from '@/hooks/useFirestore'
import styles from './BlogNavigation.module.css'

interface BlogNavigationProps {
  currentSlug: string | undefined
}

export function BlogNavigation({ currentSlug }: BlogNavigationProps) {
  const { data: posts } = usePosts()
  
  if (!posts || !currentSlug) return null

  const currentIndex = posts.findIndex(post => post.slug === currentSlug)
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  if (!prevPost && !nextPost) return null

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContent}>
        {/* Previous Post */}
        <div className={styles.navItem}>
          {prevPost ? (
            <Link to={`/blog/${prevPost.slug}`} className={styles.navLink}>
              <div className={styles.navDirection}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Previous</span>
              </div>
              <div className={styles.navTitle}>{prevPost.title}</div>
            </Link>
          ) : (
            <div className={styles.navPlaceholder} />
          )}
        </div>

        {/* Back to Blog */}
        <div className={styles.navCenter}>
          <Link to="/blog" className={styles.backToBlog}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            All Articles
          </Link>
        </div>

        {/* Next Post */}
        <div className={styles.navItem}>
          {nextPost ? (
            <Link to={`/blog/${nextPost.slug}`} className={styles.navLink}>
              <div className={styles.navDirection}>
                <span>Next</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
              <div className={styles.navTitle}>{nextPost.title}</div>
            </Link>
          ) : (
            <div className={styles.navPlaceholder} />
          )}
        </div>
      </div>
    </nav>
  )
}
