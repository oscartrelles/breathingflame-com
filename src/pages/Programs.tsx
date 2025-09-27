import { useState, useMemo, useCallback } from 'react'
import { usePagePrograms, useAllOfferings } from '@/hooks/useFirestore'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import { 
  fadeInUp, 
  staggerContainer, 
  staggerChild,
  useInViewAnimation,
  useReducedMotion,
  pageTransition 
} from '@/utils/animations'
import { Offering } from '@/types'
import styles from './Programs.module.css'

type FilterTab = 'all' | 'programs' | 'experiences'

export function Programs() {
  const { data: pageData } = usePagePrograms()
  const { data: allOfferings } = useAllOfferings()
  const reducedMotion = useReducedMotion()

  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(12)

  // Filter and search logic
  const filteredOfferings = useMemo(() => {
    if (!allOfferings) return []
    
    let filtered = allOfferings

    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(offering => offering.kind === activeTab)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(offering => 
        offering.title.toLowerCase().includes(query) ||
        offering.slug.toLowerCase().includes(query) ||
        (offering.tags && offering.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    return filtered
  }, [allOfferings, activeTab, searchQuery])

  // Pagination
  const visibleOfferings = filteredOfferings.slice(0, visibleCount)
  const hasMore = visibleOfferings.length < filteredOfferings.length

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + 12)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setVisibleCount(12) // Reset pagination on search
  }, [])

  const handleTabChange = useCallback((tab: FilterTab) => {
    setActiveTab(tab)
    setVisibleCount(12) // Reset pagination on tab change
  }, [])

  if (!pageData) {
    return (
      <div className="container">
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading programs...</p>
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
          title: pageData.seo.title,
          description: pageData.seo.description,
          image: pageData.seo.ogImage
        }}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <motion.div 
            className={styles.heroContent}
            {...useInViewAnimation()}
          >
            <h1 className={styles.heroTitle}>
              {pageData.hero.headline}
            </h1>
            
            <p className={styles.heroSubtitle}>
              {pageData.hero.subtext}
            </p>

            {pageData.hero.ctas && pageData.hero.ctas.length > 0 && (
              <div className={styles.heroCTA}>
                {pageData.hero.ctas.map((cta, index) => (
                  <a
                    key={index}
                    href={cta.pathOrUrl}
                    className={`btn ${index === 0 ? 'btn--primary' : 'btn--secondary'} btn--large`}
                    target={cta.external ? '_blank' : undefined}
                    rel={cta.external ? 'noopener noreferrer' : undefined}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="section section--sm">
        <div className="container">
          <motion.div 
            className={styles.controls}
            {...useInViewAnimation()}
          >
            {/* Filter Tabs */}
            <div className={styles.tabs} role="tablist">
              {pageData.filters.showAll && (
                <button
                  className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'all'}
                  onClick={() => handleTabChange('all')}
                >
                  All
                </button>
              )}
              {pageData.filters.showPrograms && (
                <button
                  className={`${styles.tab} ${activeTab === 'programs' ? styles.tabActive : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'programs'}
                  onClick={() => handleTabChange('programs')}
                >
                  Programs
                </button>
              )}
              {pageData.filters.showExperiences && (
                <button
                  className={`${styles.tab} ${activeTab === 'experiences' ? styles.tabActive : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'experiences'}
                  onClick={() => handleTabChange('experiences')}
                >
                  Experiences
                </button>
              )}
                    </div>
                    
            {/* Search Input */}
            {pageData.search.enabled && (
              <div className={styles.search}>
                <input
                  type="text"
                  placeholder={pageData.search.placeholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                  aria-label="Search programs"
                />
              </div>
            )}
          </motion.div>
                      </div>
      </section>

      {/* Programs Grid */}
      <section className="section section--sm">
        <div className="container">
          <motion.div 
            className={styles.grid}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            {visibleOfferings.map((offering) => (
              <motion.div 
                key={`${offering.kind}-${offering.id}`}
                className={styles.card}
                variants={reducedMotion ? {} : staggerChild}
                whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
              >
                <OfferingCard offering={offering} />
                  </motion.div>
                ))}
              </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <motion.div 
              className={styles.loadMore}
              {...useInViewAnimation()}
            >
              <button 
                onClick={handleLoadMore}
                className="btn btn--outline btn--large"
              >
                Show More Programs
              </button>
            </motion.div>
          )}

          {/* No Results */}
          {filteredOfferings.length === 0 && (
            <motion.div 
              className={styles.noResults}
              {...useInViewAnimation()}
            >
              <h3>No programs found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCTA}>
        <div className="container">
          <motion.div 
            className={styles.footerContent}
            {...useInViewAnimation()}
          >
            <h2 className={styles.footerTitle}>Not sure where to start?</h2>
            <p className={styles.footerDescription}>
              Explore our individual and organizational offerings to find the perfect fit for your needs.
            </p>
            
            <div className={styles.footerButtons}>
              <a href="/individuals" className="btn btn--primary btn--large">
                For Individuals
              </a>
              <a href="/organizations" className="btn btn--secondary btn--large">
                For Organizations
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

// Offering Card Component
function OfferingCard({ offering }: { offering: Offering }) {
  const handleClick = useCallback(() => {
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'programs_card_click', {
        title: offering.title,
        kind: offering.kind,
        slug: offering.slug
      })
    }
  }, [offering])

  const getSummary = () => {
    // 1. Check for summary field first
    if (offering.summary) {
      return offering.summary
    }
    
    // 2. Programs: fallback to first outcome
    if (offering.kind === 'program' && offering.outcomes && offering.outcomes.length > 0) {
      return offering.outcomes[0]
    }
    
    // 3. Experiences: fallback to first highlight
    if (offering.kind === 'experience' && offering.highlights && offering.highlights.length > 0) {
      return offering.highlights[0]
    }
    
    // 4. Final fallback: shortDescription (equivalent to hero.subtext)
    return offering.shortDescription
  }

  return (
    <a
      href={offering.ctaHref}
      className={styles.cardLink}
      onClick={handleClick}
      aria-label={`Open ${offering.title} (${offering.kind})`}
    >
      <div className={styles.cardImage}>
        <img src={offering.image} alt={offering.title} />
        <div className={styles.cardEyebrow}>
          {offering.kind === 'program' ? 'Program' : 'Experience'}
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{offering.title}</h3>
        <p className={styles.cardSubtitle}>{offering.subtitle}</p>
        <p className={styles.cardSummary}>{getSummary()}</p>
        
        {offering.tags && offering.tags.length > 0 && (
          <div className={styles.cardTags}>
            {offering.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={styles.cardTag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className={styles.cardMeta}>
          <span className={styles.cardDuration}>{offering.duration}</span>
          <span className={styles.cardFormat}>{offering.format?.delivery || offering.format_legacy}</span>
        </div>
      </div>
    </a>
  )
}