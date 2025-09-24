import { usePosts } from '@/hooks/useFirestore'
import { SEO } from '@/components/SEO'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { motion } from 'framer-motion'
import { 
  fadeInUp, 
  staggerContainer, 
  staggerChild,
  useInViewAnimation,
  useReducedMotion,
  pageTransition 
} from '@/utils/animations'
import { useState, useMemo } from 'react'
import styles from './Blog.module.css'

/**
 * Blog Listing Page
 * 
 * Features:
 * - Hero section with blog introduction
 * - Filterable blog posts by tags
 * - Search functionality
 * - Pagination
 * - Featured posts
 * - Category filtering
 */
export function Blog() {
  const { data: posts, loading, error } = usePosts()
  const reducedMotion = useReducedMotion()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts?.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // Filter posts based on selected tag and search query
  const filteredPosts = useMemo(() => {
    if (!posts) return []
    
    return posts.filter(post => {
      const matchesTag = !selectedTag || post.tags?.includes(selectedTag)
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesTag && matchesSearch && post.published
    })
  }, [posts, selectedTag, searchQuery])

  // Get featured posts (first 3)
  const featuredPosts = filteredPosts.slice(0, 3)
  const regularPosts = filteredPosts.slice(3)

  if (loading) {
    return (
      <div className="container">
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading blog posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.error}>
          <h2>Error Loading Blog</h2>
          <p>We're having trouble loading the blog posts. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={reducedMotion ? {} : pageTransition}
    >
      <SEO 
        data={{
          title: 'Blog - Breathing Flame',
          description: 'Discover insights, techniques, and stories about breathwork, mindfulness, resilience, and transformation.',
          image: '/blog/blog-hero-og.jpg'
        }}
      />

      {/* Blog Hero */}
      <BlogHero 
        title="Insights & Stories"
        subtitle="Discover the latest research, techniques, and personal stories about breathwork, mindfulness, and transformation."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Blog Filters */}
      <section className="section section--sm">
        <div className="container">
          <BlogFilters
            tags={allTags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
            postCount={filteredPosts.length}
          />
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <motion.div 
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>Featured Articles</h2>
              <p className={styles.sectionDescription}>
                Our most popular and impactful articles
              </p>
            </motion.div>

            <motion.div 
              className={styles.featuredGrid}
              variants={reducedMotion ? {} : staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              {featuredPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  className={styles.featuredCard}
                  variants={reducedMotion ? {} : staggerChild}
                >
                  <BlogCard 
                    post={post} 
                    variant="featured"
                    priority={index < 2}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      {regularPosts.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <motion.div 
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>All Articles</h2>
              <p className={styles.sectionDescription}>
                Explore our complete collection of articles
              </p>
            </motion.div>

            <motion.div 
              className={styles.postsGrid}
              variants={reducedMotion ? {} : staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {regularPosts.map((post) => (
                <motion.div 
                  key={post.id}
                  className={styles.postCard}
                  variants={reducedMotion ? {} : staggerChild}
                >
                  <BlogCard 
                    post={post} 
                    variant="regular"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.noResults}>
              <h3>No articles found</h3>
              <p>
                {searchQuery 
                  ? `No articles match "${searchQuery}". Try a different search term.`
                  : selectedTag 
                    ? `No articles found in the "${selectedTag}" category.`
                    : 'No articles are available at the moment.'
                }
              </p>
              {(searchQuery || selectedTag) && (
                <button 
                  className="btn btn--primary"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedTag(null)
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="section section--sm">
        <div className="container">
          <motion.div 
            className={styles.newsletter}
            {...useInViewAnimation()}
          >
            <h3>Stay Updated</h3>
            <p>Get the latest articles and insights delivered to your inbox.</p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
              />
              <button type="submit" className="btn btn--primary">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
