import { Link } from 'react-router-dom'
import styles from './BlogTags.module.css'

interface BlogTagsProps {
  tags: string[]
  variant?: 'default' | 'compact'
}

export function BlogTags({ tags, variant = 'default' }: BlogTagsProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div className={`${styles.tags} ${styles[variant]}`}>
      {tags.map((tag) => (
        <Link 
          key={tag}
          to={`/blog?tag=${encodeURIComponent(tag)}`}
          className={styles.tag}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
