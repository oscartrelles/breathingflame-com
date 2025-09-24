import { formatDistanceToNow } from 'date-fns'
import styles from './BlogMeta.module.css'

interface BlogMetaProps {
  author: {
    name: string
    avatar?: string
  }
  publishedAt: Date
  readingTime: number
  updatedAt?: Date
  variant?: 'default' | 'compact'
}

export function BlogMeta({ 
  author, 
  publishedAt, 
  readingTime, 
  updatedAt, 
  variant = 'default' 
}: BlogMetaProps) {
  const timeAgo = formatDistanceToNow(publishedAt, { addSuffix: true })
  const updatedTimeAgo = updatedAt ? formatDistanceToNow(updatedAt, { addSuffix: true }) : null

  return (
    <div className={`${styles.meta} ${styles[variant]}`}>
      {/* Author */}
      <div className={styles.author}>
        {author.avatar && (
          <img 
            src={author.avatar} 
            alt={author.name}
            className={styles.avatar}
          />
        )}
        <span className={styles.authorName}>{author.name}</span>
      </div>

      {/* Separator */}
      <span className={styles.separator}>•</span>

      {/* Published Date */}
      <time className={styles.date} dateTime={publishedAt.toISOString()}>
        {timeAgo}
      </time>

      {/* Updated Date (if different) */}
      {updatedAt && updatedAt.getTime() !== publishedAt.getTime() && (
        <>
          <span className={styles.separator}>•</span>
          <span className={styles.updated}>
            Updated {updatedTimeAgo}
          </span>
        </>
      )}

      {/* Reading Time */}
      <span className={styles.separator}>•</span>
      <span className={styles.readingTime}>
        {readingTime} min read
      </span>
    </div>
  )
}
