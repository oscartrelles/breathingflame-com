import styles from './BlogFilters.module.css'

interface BlogFiltersProps {
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
  postCount: number
}

export function BlogFilters({ tags, selectedTag, onTagSelect, postCount }: BlogFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.filtersHeader}>
        <h3 className={styles.filtersTitle}>Filter by Category</h3>
        <span className={styles.postCount}>
          {postCount} article{postCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${!selectedTag ? styles.active : ''}`}
          onClick={() => onTagSelect(null)}
        >
          All Articles
        </button>
        
        {tags.map((tag) => (
          <button
            key={tag}
            className={`${styles.filterButton} ${selectedTag === tag ? styles.active : ''}`}
            onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
