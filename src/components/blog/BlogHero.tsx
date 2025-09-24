import { useState } from 'react'
import styles from './BlogHero.module.css'

interface BlogHeroProps {
  title: string
  subtitle: string
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function BlogHero({ title, subtitle, searchQuery, onSearchChange }: BlogHeroProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          
          {/* Search Bar */}
          <div className={`${styles.searchContainer} ${isSearchFocused ? styles.focused : ''}`}>
            <div className={styles.searchIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className={styles.clearButton}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
