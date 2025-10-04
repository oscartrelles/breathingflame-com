import { useState, useMemo, useCallback } from 'react'
import { usePagePrograms, useAllOfferings } from '@/hooks/useFirestore'
import { HeroSection } from '@/components/HeroSection'
import { SEO } from '@/components/SEO'
import { OfferingCard } from '@/components/OfferingCard'
import { LoadingWrapper } from '@/components/LoadingWrapper'
import { FinalCTABand } from '@/components/FinalCTABand'
import { FAQ } from '@/components/FAQ'
import { motion } from 'framer-motion'
import { 
  fadeInUp, 
  heroText,
  staggerContainer, 
  staggerChild,
  useInViewAnimation,
  useReducedMotion,
  pageTransition 
} from '@/utils/animations'
import { Offering } from '@/types'
import styles from './Programs.module.css'

type FilterTab = 'all' | 'programs' | 'experiences' | 'solutions'

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

  // Early return after all hooks
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
          title: pageData.seo?.title,
          description: pageData.seo?.description,
          image: pageData.seo?.ogImage,
          structuredData: [
            // CollectionPage schema
            {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: pageData.seo?.title || 'Programs & Experiences',
              description: pageData.seo?.description,
              url: 'https://breathingflame.com/programs',
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: filteredOfferings.length,
                itemListElement: filteredOfferings.slice(0, visibleCount).map((offering, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Service',
                    name: offering.title,
                    description: offering.summary || offering.description,
                    provider: {
                      '@type': 'Organization',
                      name: 'Breathing Flame'
                    },
                    url: `https://breathingflame.com/${offering.type}/${offering.slug}`,
                    ...(offering.faq && offering.faq.length > 0 && {
                      mainEntity: offering.faq.map((faq: any) => ({
                        '@type': 'Question',
                        name: faq.question || faq.q,
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: faq.answer || faq.a
                        }
                      }))
                    })
                  }
                }))
              }
            },
            // Organization schema
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Breathing Flame',
              url: 'https://breathingflame.com',
              logo: 'https://breathingflame.com/logo.png',
              description: 'Resilience. Clarity. Transformation.',
              sameAs: [
                'https://www.instagram.com/breathing.flame',
                'https://www.youtube.com/@BreathingFlameTV',
                'https://www.linkedin.com/company/breathingflame/',
                'https://www.tiktok.com/@breathingflame'
              ]
            }
          ]
        }}
        pageData={pageData}
      />

      {/* Hero Section */}
      {pageData.sections?.hero?.visible !== false && (
        <HeroSection
          title={pageData.sections.hero.headline}
          subtitle={pageData.sections.hero.subtext}
          media={pageData.sections.hero.media ?? {
            imageUrl: pageData.sections.hero.imageUrl,
            videoEmbed: pageData.sections.hero.videoEmbed,
            videoId: pageData.sections.hero.videoId,
          }}
          ctas={pageData.sections.hero.ctas}
          className="programs-hero"
        />
      )}

      {/* Intro Section */}
      {(pageData.sections?.intro?.visible !== false) && pageData.sections?.intro && (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
          <motion.div
            className={styles.sectionHeader}
            {...useInViewAnimation()}
          >
            <h2 className={styles.sectionTitle}>{pageData.sections.intro.title}</h2>
            <div className={styles.sectionDescription}>
              {pageData.sections.intro.body}
            </div>
          </motion.div>
        </div>
      )}

      {/* Controls Section */}
      <div className="container" style={{ paddingTop: 'var(--spacing-2)', paddingBottom: 'var(--spacing-2)' }}>
        <motion.div 
          className={styles.controls}
          {...useInViewAnimation()}
        >
            {/* Filter Tabs */}
            <div className={styles.tabs} role="tablist">
              {(pageData.sections?.filters?.visible !== false) && pageData.sections?.filters?.showAll && (
              <button
                  className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'all'}
                  onClick={() => handleTabChange('all')}
                >
                  All
              </button>
              )}
              {(pageData.sections?.filters?.visible !== false) && pageData.sections?.filters?.showPrograms && (
                <button
                  className={`${styles.tab} ${activeTab === 'programs' ? styles.tabActive : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'programs'}
                  onClick={() => handleTabChange('programs')}
                >
                  Programs
                </button>
              )}
              {(pageData.sections?.filters?.visible !== false) && pageData.sections?.filters?.showExperiences && (
                <button
                  className={`${styles.tab} ${activeTab === 'experiences' ? styles.tabActive : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'experiences'}
                  onClick={() => handleTabChange('experiences')}
                >
                  Experiences
                </button>
              )}
              {(pageData.sections?.filters?.visible !== false) && pageData.sections?.filters?.showSolutions && (
                <button
                  className={`${styles.tab} ${activeTab === 'solutions' ? styles.tabActive : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'solutions'}
                  onClick={() => handleTabChange('solutions')}
                >
                  Solutions
                </button>
              )}
                    </div>
                    
            {/* Search Input */}
            {(pageData.sections?.search?.visible !== false) && pageData.sections?.search?.enabled && (
              <div className={styles.search}>
                <input
                  type="text"
                  placeholder={pageData.sections?.search?.placeholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                  aria-label={pageData.sections?.search?.ariaLabel || 'Search programs'}
                />
              </div>
            )}
          </motion.div>
        </div>

      {/* Programs Grid */}
      <div className="container" style={{ paddingTop: 'var(--spacing-2)' }}>
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
                <OfferingCard offering={offering} pageData={pageData} />
              </motion.div>
            ))}

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
          </motion.div>
        </div>

      {/* FAQ Section */}
      {(pageData.sections?.faq?.visible !== false) && pageData.sections?.faq && (
        <FAQ
          title={pageData.sections.faq.title}
          subtitle={pageData.sections.faq.subtitle}
          items={pageData.sections.faq.items || []}
        />
      )}

      {/* Final CTA Section */}
      {(pageData.sections?.finalCTA?.visible !== false) && pageData.sections?.finalCTA && (
        <FinalCTABand
          headline={pageData.sections.finalCTA.headline}
          subtext={pageData.sections.finalCTA.subtext}
          buttons={pageData.sections.finalCTA.buttons?.map(button => ({
            label: button.label,
            url: button.url,
            external: button.external || false
          }))}
          fallbackHeadline="Your path to resilience starts here"
          fallbackSubtext="Pick the program or experience that meets you where you are — and take the first step today."
          fallbackButtons={[
            { label: "Join a Program", url: "/programs", external: false },
            { label: "Book an Experience", url: "/events", external: false }
          ]}
        />
      )}
    </motion.div>
  )
}
