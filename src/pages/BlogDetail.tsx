import { useParams, Link } from 'react-router-dom'
import { usePost } from '@/hooks/useFirestore'
import { SEO } from '@/components/SEO'
import { BlogMeta } from '@/components/blog/BlogMeta'
import { BlogAuthor } from '@/components/blog/BlogAuthor'
import { BlogTags } from '@/components/blog/BlogTags'
import { BlogShare } from '@/components/blog/BlogShare'
import { BlogNavigation } from '@/components/blog/BlogNavigation'
import { motion } from 'framer-motion'
import { 
  fadeInUp, 
  useInViewAnimation,
  useReducedMotion,
  pageTransition 
} from '@/utils/animations'
import { useState, useEffect } from 'react'
import styles from './BlogDetail.module.css'

/**
 * Blog Detail Page
 * 
 * Features:
 * - Full article content with markdown rendering
 * - Author information
 * - Tags and sharing
 * - Reading progress indicator
 * - Related articles
 * - Social sharing
 * - Print-friendly layout
 */
export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, loading, error } = usePost(slug || '')
  const reducedMotion = useReducedMotion()
  const [readingProgress, setReadingProgress] = useState(0)

  // Reading progress calculation
  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.querySelector('article')
      if (!article) return

      const scrollTop = window.scrollY
      const docHeight = article.offsetHeight
      const winHeight = window.innerHeight
      const scrollPercent = scrollTop / (docHeight - winHeight)
      const scrollPercentRounded = Math.round(scrollPercent * 100)
      
      setReadingProgress(Math.min(100, Math.max(0, scrollPercentRounded)))
    }

    window.addEventListener('scroll', updateReadingProgress)
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container">
        <div className={styles.error}>
          <h2>Article Not Found</h2>
          <p>The article you're looking for doesn't exist or has been moved.</p>
          <Link to="/blog" className="btn btn--primary">
            Back to Blog
          </Link>
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
          title: post.seo?.metaTitle || post.title,
          description: post.seo?.metaDescription || post.excerpt,
          image: post.seo?.ogImage || post.featuredImage,
          publishedTime: post.publishedAt?.toISOString(),
          modifiedTime: post.updatedAt?.toISOString(),
          author: post.author.name,
          tags: post.tags
        }}
      />

      {/* Reading Progress Bar */}
      <div className={styles.readingProgress}>
        <div 
          className={styles.readingProgressBar}
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Article Header */}
      <motion.header 
        className={styles.articleHeader}
        {...useInViewAnimation()}
      >
        <div className="container">
          <div className={styles.articleHeaderContent}>
            <Link to="/blog" className={styles.backLink}>
              ← Back to Blog
            </Link>
            
            <h1 className={styles.articleTitle}>{post.title}</h1>
            
            <p className={styles.articleExcerpt}>{post.excerpt}</p>
            
            <BlogMeta 
              author={post.author}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
              updatedAt={post.updatedAt}
            />
          </div>
        </div>
      </motion.header>

      {/* Featured Image */}
      {post.featuredImage && (
        <motion.div 
          className={styles.featuredImageContainer}
          {...useInViewAnimation()}
        >
          <div className="container">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className={styles.featuredImage}
            />
          </div>
        </motion.div>
      )}

      {/* Article Content */}
      <motion.article 
        className={styles.articleContent}
        {...useInViewAnimation()}
      >
        <div className="container">
          <div className={styles.articleBody}>
            {/* Markdown content would be rendered here */}
            <div 
              className={styles.markdownContent}
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br>') 
              }}
            />
          </div>
        </div>
      </motion.article>

      {/* Article Footer */}
      <motion.footer 
        className={styles.articleFooter}
        {...useInViewAnimation()}
      >
        <div className="container">
          <div className={styles.articleFooterContent}>
            {/* Tags */}
            <BlogTags tags={post.tags} />
            
            {/* Share Buttons */}
            <BlogShare 
              title={post.title}
              url={window.location.href}
              excerpt={post.excerpt}
            />
            
            {/* Author Bio */}
            <BlogAuthor author={post.author} />
          </div>
        </div>
      </motion.footer>

      {/* Navigation */}
      <motion.section 
        className={styles.navigation}
        {...useInViewAnimation()}
      >
        <div className="container">
          <BlogNavigation currentSlug={slug} />
        </div>
      </motion.section>

      {/* Related Articles */}
      <motion.section 
        className={styles.relatedArticles}
        {...useInViewAnimation()}
      >
        <div className="container">
          <h3 className={styles.relatedTitle}>Related Articles</h3>
          <p className={styles.relatedDescription}>
            Continue your journey with these related articles
          </p>
          {/* Related articles would be implemented here */}
        </div>
      </motion.section>
    </motion.div>
  )
}
