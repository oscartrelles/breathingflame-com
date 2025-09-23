import { useState } from 'react'
import { usePrograms, useExperiences } from '@/hooks/useFirestore'
import { SEO } from '@/components/SEO'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/utils/animations'
import styles from './Programs.module.css'

/**
 * Programs Page - Unified list of programs and experiences
 * 
 * Features:
 * - Unified grid layout with programs and experiences
 * - Filter tabs (All, Programs, Experiences)
 * - Program/Experience cards with consistent styling
 * - Search functionality
 */
export function Programs() {
  const { data: programs } = usePrograms()
  const { data: experiences } = useExperiences()
  const [activeFilter, setActiveFilter] = useState<'all' | 'programs' | 'experiences'>('all')
  const reducedMotion = useReducedMotion()

  // Combine programs and experiences
  const allItems = [
    ...(programs?.map(program => ({ ...program, type: 'program' })) || []),
    ...(experiences?.map(experience => ({ ...experience, type: 'experience' })) || [])
  ].sort((a, b) => (a.order || 0) - (b.order || 0))

  // Filter items based on active filter
  const filteredItems = allItems.filter(item => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'programs') return item.type === 'program'
    if (activeFilter === 'experiences') return item.type === 'experience'
    return true
  })

  const filters = [
    { key: 'all', label: 'All', count: allItems.length },
    { key: 'programs', label: 'Programs', count: programs?.length || 0 },
    { key: 'experiences', label: 'Experiences', count: experiences?.length || 0 }
  ]

  return (
    <>
      <SEO 
        data={{
          title: 'Programs & Experiences - Breathing Flame',
          description: 'Discover our transformative programs and experiences designed to build resilience, gain clarity, and create lasting positive change.',
          image: '/og-programs.jpg'
        }}
      />

      <main className={styles.programsPage}>
        <div className="container">
          <header className={styles.pageHeader}>
            <motion.h1
              initial={reducedMotion ? {} : { y: 20, opacity: 0 }}
              animate={reducedMotion ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Programs & Experiences
            </motion.h1>
            <motion.p
              initial={reducedMotion ? {} : { y: 20, opacity: 0 }}
              animate={reducedMotion ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Transformative programs and experiences designed to build resilience, gain clarity, and create lasting positive change.
            </motion.p>
          </header>

          {/* Filter Tabs */}
          <motion.div 
            className={styles.filterTabs}
            initial={reducedMotion ? {} : { y: 20, opacity: 0 }}
            animate={reducedMotion ? {} : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filters.map((filter) => (
              <button
                key={filter.key}
                className={`${styles.filterTab} ${activeFilter === filter.key ? styles.active : ''}`}
                onClick={() => setActiveFilter(filter.key as any)}
              >
                {filter.label}
                <span className={styles.filterCount}>({filter.count})</span>
              </button>
            ))}
          </motion.div>

          {/* Items Grid */}
          <motion.section 
            className={styles.itemsGrid}
            layout
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={reducedMotion ? {} : { opacity: 0 }}
                animate={reducedMotion ? {} : { opacity: 1 }}
                exit={reducedMotion ? {} : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.gridContainer}
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    className={`${styles.itemCard} ${styles[item.type]}`}
                    initial={reducedMotion ? {} : { y: 20, opacity: 0 }}
                    animate={reducedMotion ? {} : { y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={reducedMotion ? {} : { y: -4 }}
                  >
                    <div className={styles.cardHeader}>
                      <span className={styles.itemType}>{item.type === 'program' ? 'Program' : 'Experience'}</span>
                      <h2 className={styles.itemTitle}>{item.title}</h2>
                      {item.subtitle && <p className={styles.itemSubtitle}>{item.subtitle}</p>}
                    </div>
                    
                    <div className={styles.cardContent}>
                      <p className={styles.itemDescription}>{item.shortDescription}</p>
                      
                      <div className={styles.cardMeta}>
                        {item.duration && (
                          <span className={styles.metaItem}>
                            <strong>Duration:</strong> {item.duration}
                          </span>
                        )}
                        {item.format && (
                          <span className={styles.metaItem}>
                            <strong>Format:</strong> {item.format}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.cardFooter}>
                      <a 
                        href={`/${item.type}s/${item.slug}`} 
                        className="btn btn--primary"
                      >
                        Learn More
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.section>

          {filteredItems.length === 0 && (
            <motion.div 
              className={styles.emptyState}
              initial={reducedMotion ? {} : { opacity: 0 }}
              animate={reducedMotion ? {} : { opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3>No {activeFilter === 'all' ? 'items' : activeFilter} found</h3>
              <p>Try selecting a different filter or check back later for new content.</p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}