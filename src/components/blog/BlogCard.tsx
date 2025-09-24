import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BlogMeta } from './BlogMeta'
import { BlogTags } from './BlogTags'
import { useReducedMotion } from '@/utils/animations'
import styles from './BlogCard.module.css'

interface BlogCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string
    featuredImage?: string
    author: {
      name: string
      avatar?: string
    }
    publishedAt: Date
    readingTime: number
    tags: string[]
  }
  variant?: 'featured' | 'regular'
  priority?: boolean
}

export function BlogCard({ post, variant = 'regular', priority = false }: BlogCardProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.article 
      className={`${styles.blogCard} ${styles[variant]}`}
      whileHover={reducedMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
    >
      <Link to={`/blog/${post.slug}`} className={styles.cardLink}>
        {/* Featured Image */}
        {post.featuredImage && (
          <div className={styles.imageContainer}>
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className={styles.image}
              loading={priority ? 'eager' : 'lazy'}
            />
            <div className={styles.imageOverlay} />
          </div>
        )}

        {/* Card Content */}
        <div className={styles.cardContent}>
          {/* Tags */}
          <BlogTags tags={post.tags} variant="compact" />
          
          {/* Title */}
          <h3 className={styles.title}>{post.title}</h3>
          
          {/* Excerpt */}
          <p className={styles.excerpt}>{post.excerpt}</p>
          
          {/* Meta */}
          <BlogMeta 
            author={post.author}
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
            variant="compact"
          />
        </div>
      </Link>
    </motion.article>
  )
}
