import { useState, useEffect, useRef } from 'react'
import { Testimonial, selectTestimonials, TestimonialSelectionOptions } from '@/lib/testimonials'
import { useContent } from '@/hooks/useContent'
import styles from './TestimonialComponent.module.css'

interface TestimonialComponentTestimonial extends Testimonial {
  author: {
    name: string
    title?: string
    company?: string
    avatar?: string
    role?: string
  }
  verified?: boolean
  sourceUrl?: string
  originalLanguage?: string
  isTranslated?: boolean
}

interface TestimonialComponentProps {
  // Mode control
  mode?: 'proof' | 'grid' | 'carousel'
  
  // Source control
  testimonialRefs?: string[]
  context?: {
    programSlug?: string
    experienceSlug?: string
    solutionSlug?: string
    audience?: 'individuals' | 'organizations'
  }
  
  // Display settings
  maxCount?: number
  minRating?: number
  title?: string
  subtext?: string
  
  // Layout-specific settings
  showRating?: boolean
  showTags?: boolean
  showSource?: boolean
  showLanguage?: boolean
  
  // Text truncation settings
  maxTextLength?: number
  showReadMore?: boolean
  
  // Styling
  className?: string
}

export function TestimonialComponent({
  mode = 'proof',
  testimonialRefs,
  context,
  maxCount = 6,
  minRating = 4,
  title,
  subtext,
  showRating = true,
  showTags = false,
  showSource = false,
  showLanguage = false,
  maxTextLength = 580, // 75th percentile from analysis
  showReadMore = true,
  className = ''
}: TestimonialComponentProps) {
  
  const [testimonials, setTestimonials] = useState<TestimonialComponentTestimonial[]>([])
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialComponentTestimonial | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null)
  
  const { data: contentData } = useContent()

  useEffect(() => {
    if (!contentData?.testimonials) {
      setLoading(false)
      return
    }

    // Convert testimonials data to our interface
    const testimonialsData: TestimonialComponentTestimonial[] = contentData.testimonials.map((testimonial: any) => ({
      id: testimonial.id,
      author: {
        name: testimonial.author?.name || 'Anonymous',
        title: testimonial.author?.title,
        company: testimonial.author?.company,
        avatar: testimonial.author?.avatar,
        role: testimonial.author?.title
      },
      text: testimonial.text || '',
      rating: testimonial.rating || 5,
      tags: Array.isArray(testimonial.tags) ? testimonial.tags : [],
      refs: {
        programSlugs: testimonial.refs?.programSlugs || [],
        experienceSlugs: testimonial.refs?.experienceSlugs || [],
        solutionSlugs: testimonial.refs?.solutionSlugs || []
      },
      featured: testimonial.featured || false,
      verified: testimonial.verified || false,
      sourceUrl: testimonial.sourceUrl,
      originalLanguage: testimonial.originalLanguage,
      isTranslated: testimonial.isTranslated || false,
      createdAt: testimonial.createdAt || new Date().toISOString(),
      updatedAt: testimonial.updatedAt || new Date().toISOString()
    }))

    let selectedTestimonials: TestimonialComponentTestimonial[] = []

    // If specific testimonialRefs are provided, use those
    if (testimonialRefs && testimonialRefs.length > 0) {
      selectedTestimonials = testimonialsData
        .filter(testimonial => testimonialRefs.includes(testimonial.id))
        .filter(testimonial => (testimonial.rating || 5) >= minRating)
        .slice(0, maxCount)
    } else {
      // Otherwise, use context-aware selection
      const route = window.location.pathname
      const options: TestimonialSelectionOptions = {
        route,
        context,
        minRating,
        maxCount,
        preferFeatured: mode === 'proof' // For proof mode, prefer featured testimonials
      }
      selectedTestimonials = selectTestimonials(testimonialsData, options)
    }

    setTestimonials(selectedTestimonials)
    setLoading(false)

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const route = window.location.pathname
      (window as any).gtag('event', 'testimonial_view', {
        route,
        count: selectedTestimonials.length,
        mode,
        source: testimonialRefs ? 'curated' : 'context-aware'
      })
    }
  }, [contentData, context, maxCount, minRating, testimonialRefs, mode])

  // Auto-advance logic for carousel mode
  useEffect(() => {
    if (mode !== 'carousel' || testimonials.length <= 1 || hasUserInteracted) {
      return
    }

    const startAutoAdvance = () => {
      autoAdvanceTimer.current = setInterval(() => {
        setCurrentIndex((prev) => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        )
      }, 10000) // 10 seconds
    }

    const stopAutoAdvance = () => {
      if (autoAdvanceTimer.current) {
        clearInterval(autoAdvanceTimer.current)
        autoAdvanceTimer.current = null
      }
    }

    if (isAutoAdvancing) {
      startAutoAdvance()
    } else {
      stopAutoAdvance()
    }

    return () => stopAutoAdvance()
  }, [mode, testimonials.length, isAutoAdvancing, hasUserInteracted])

  // Modal handlers
  const openModal = (testimonial: TestimonialComponentTestimonial) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'testimonial_modal_open', {
        testimonial_id: testimonial.id,
        route: window.location.pathname,
        mode
      })
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTestimonial(null)
  }

  const navigateTestimonial = (direction: 'prev' | 'next') => {
    if (!selectedTestimonial) return
    
    const currentIndex = testimonials.findIndex(t => t.id === selectedTestimonial.id)
    let newIndex: number
    
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    } else {
      newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    }
    
    setSelectedTestimonial(testimonials[newIndex])
  }

  // Touch navigation handlers for carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if ((isLeftSwipe || isRightSwipe) && testimonials.length > 1) {
      setHasUserInteracted(true)
      setIsAutoAdvancing(false)
    }

    if (isLeftSwipe && testimonials.length > 1) {
      setCurrentIndex((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      )
    }
    if (isRightSwipe && testimonials.length > 1) {
      setCurrentIndex((prev) => 
        prev === 0 ? testimonials.length - 1 : prev - 1
      )
    }
  }

  // Button navigation handlers
  const handlePrevClick = () => {
    setHasUserInteracted(true)
    setIsAutoAdvancing(false)
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  const handleNextClick = () => {
    setHasUserInteracted(true)
    setIsAutoAdvancing(false)
    setCurrentIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    )
  }

  // Utility functions
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${styles.star} ${i < rating ? styles.starFilled : styles.starEmpty}`}
      >
        ★
      </span>
    ))
  }

  const renderTags = (tags: string[]) => {
    if (!showTags || !tags.length) return null
    
    return (
      <div className={styles.tags}>
        {tags.slice(0, 3).map(tag => (
          <span key={tag} className={styles.tag}>
            {tag.replace('-', ' ')}
          </span>
        ))}
        {tags.length > 3 && (
          <span className={styles.tagMore}>+{tags.length - 3}</span>
        )}
      </div>
    )
  }

  // Helper function to truncate text and add read more functionality
  const truncateText = (text: string, isModal = false) => {
    if (isModal || !showReadMore || text.length <= maxTextLength) {
      return text
    }

    // Find the last complete word within the limit
    const truncated = text.substring(0, maxTextLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    const finalText = lastSpaceIndex > maxTextLength * 0.8 ? 
      truncated.substring(0, lastSpaceIndex) : 
      truncated

    return finalText
  }

  const isTextTruncated = (text: string, isModal = false) => {
    return !isModal && showReadMore && text.length > maxTextLength
  }

  const renderTestimonial = (testimonial: TestimonialComponentTestimonial, isModal = false) => (
    <div key={testimonial.id} className={`${styles.testimonial} ${isModal ? styles.testimonialModal : ''}`}>
      <div className={styles.testimonialHeader}>
        <div className={styles.authorInfo}>
          <img
            src={testimonial.author.avatar || '/images/reviews/avatars/default.svg'}
            alt={testimonial.author.name}
            className={styles.avatar}
            onError={(e) => {
              e.currentTarget.src = '/images/reviews/avatars/default.svg'
            }}
          />
          <div className={styles.authorDetails}>
            <h4 className={styles.authorName}>{testimonial.author.name}</h4>
            {(testimonial.author.title || testimonial.author.role) && (
              <p className={styles.authorTitle}>{testimonial.author.title || testimonial.author.role}</p>
            )}
            {testimonial.author.company && (
              <p className={styles.authorCompany}>{testimonial.author.company}</p>
            )}
          </div>
        </div>
      </div>

      <blockquote className={styles.quote}>
        "{truncateText(testimonial.text, isModal)}"
        {isTextTruncated(testimonial.text, isModal) && (
          <>
            ...
            {!isModal && (
              <button 
                className={styles.readMoreButton}
                onClick={(e) => {
                  e.preventDefault()
                  openModal(testimonial)
                }}
                aria-label="Read full testimonial"
              >
                Read more
              </button>
            )}
          </>
        )}
      </blockquote>

      {renderTags(testimonial.tags)}

      <div className={styles.testimonialFooter}>
        <div className={styles.footerLeft}>
          {showRating && (
            <div className={styles.rating}>
              {renderStars(testimonial.rating || 5)}
            </div>
          )}
          {testimonial.featured && (
            <span className={styles.featured}>⭐ Featured</span>
          )}
          {showLanguage && testimonial.originalLanguage && (
            <span className={styles.language}>
              {testimonial.originalLanguage === 'spa' ? '🇪🇸' : 
               testimonial.originalLanguage === 'eng' ? '🇺🇸' : 
               testimonial.originalLanguage === 'glg' ? '🇪🇸' : 
               testimonial.originalLanguage === 'sco' ? '🏴󠁧󠁢󠁳󠁣󠁴󠁿' : '🌐'}
              {testimonial.isTranslated && ' (Translated)'}
            </span>
          )}
        </div>
        
        <div className={styles.footerRight}>
          {testimonial.verified && (
            <span className={styles.verified}>✓ Verified</span>
          )}
          {showSource && testimonial.sourceUrl && (
            <a
              href={testimonial.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
            >
              View Source
            </a>
          )}
        </div>
      </div>
    </div>
  )

  // Calculate proof statistics
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0'

  // Loading state
  if (loading) {
    return (
      <div className={`${styles.container} ${className}`}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtext && <p className={styles.subtext}>{subtext}</p>}
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading testimonials...</p>
        </div>
      </div>
    )
  }

  // No testimonials state
  if (testimonials.length === 0) {
    return null
  }

  // PROOF MODE: Show average rating and total count
  if (mode === 'proof') {
    return (
      <>
        <div className={`${styles.container} ${styles.proofMode} ${className}`}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtext && <p className={styles.subtext}>{subtext}</p>}
          
          <div className={styles.proofStats}>
            <div className={styles.ratingDisplay}>
              <div className={styles.stars}>
                {renderStars(parseFloat(averageRating))}
              </div>
              <span className={styles.averageRating}>{averageRating}</span>
            </div>
            <div className={styles.countDisplay}>
              <span className={styles.totalCount}>{testimonials.length}</span>
              <span className={styles.countLabel}>
                {testimonials.length === 1 ? 'testimonial' : 'testimonials'}
              </span>
            </div>
          </div>
        </div>
        
        <TestimonialModal
          isOpen={isModalOpen}
          testimonial={selectedTestimonial}
          onClose={closeModal}
          onNavigate={navigateTestimonial}
          totalCount={testimonials.length}
          currentIndex={selectedTestimonial ? testimonials.findIndex(t => t.id === selectedTestimonial.id) : 0}
        />
      </>
    )
  }

  // GRID MODE: CSS Grid layout
  if (mode === 'grid') {
    return (
      <>
        <div className={`${styles.container} ${styles.gridMode} ${className}`}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtext && <p className={styles.subtext}>{subtext}</p>}
          
          <div className={styles.grid}>
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className={styles.gridItem}
                onClick={() => openModal(testimonial)}
              >
                {renderTestimonial(testimonial)}
              </div>
            ))}
          </div>
        </div>
        
        <TestimonialModal
          isOpen={isModalOpen}
          testimonial={selectedTestimonial}
          onClose={closeModal}
          onNavigate={navigateTestimonial}
          totalCount={testimonials.length}
          currentIndex={selectedTestimonial ? testimonials.findIndex(t => t.id === selectedTestimonial.id) : 0}
        />
      </>
    )
  }

  // CAROUSEL MODE: Touch-friendly swipable carousel
  if (mode === 'carousel') {
    return (
      <>
        <div className={`${styles.container} ${styles.carouselMode} ${className}`}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtext && <p className={styles.subtext}>{subtext}</p>}
          
          <div 
            className={styles.carousel}
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={styles.carouselContainer}
              style={{
                transform: `translateX(-${currentIndex * 100}%)`
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={styles.carouselItem}
                >
                  {renderTestimonial(testimonial)}
                </div>
              ))}
            </div>
            
            {testimonials.length > 1 && (
              <div className={styles.carouselControls}>
                <button
                  onClick={handlePrevClick}
                  className={styles.carouselButton}
                  aria-label="Previous testimonial"
                >
                  ‹
                </button>
                <span className={styles.carouselIndicator}>
                  {currentIndex + 1} / {testimonials.length}
                </span>
                <button
                  onClick={handleNextClick}
                  className={styles.carouselButton}
                  aria-label="Next testimonial"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
        
        <TestimonialModal
          isOpen={isModalOpen}
          testimonial={selectedTestimonial}
          onClose={closeModal}
          onNavigate={navigateTestimonial}
          totalCount={testimonials.length}
          currentIndex={selectedTestimonial ? testimonials.findIndex(t => t.id === selectedTestimonial.id) : 0}
        />
      </>
    )
  }

  return null
}

// Modal component for detailed testimonial view
const TestimonialModal = ({ 
  isOpen, 
  testimonial, 
  onClose, 
  onNavigate,
  totalCount,
  currentIndex 
}: {
  isOpen: boolean
  testimonial: TestimonialComponentTestimonial | null
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  totalCount: number
  currentIndex: number
}) => {
  if (!isOpen || !testimonial) return null

  return (
    <div 
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 id="modal-title" className={styles.modalTitle}>Testimonial</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.modalTestimonial}>
            <div className={styles.modalAuthor}>
              <img
                src={testimonial.author.avatar || '/images/reviews/avatars/default.svg'}
                alt={testimonial.author.name}
                className={styles.modalAvatar}
                onError={(e) => {
                  e.currentTarget.src = '/images/reviews/avatars/default.svg'
                }}
              />
              <div className={styles.modalAuthorDetails}>
                <h4 className={styles.modalAuthorName}>{testimonial.author.name}</h4>
                {(testimonial.author.title || testimonial.author.role) && (
                  <p className={styles.modalAuthorTitle}>{testimonial.author.title || testimonial.author.role}</p>
                )}
                {testimonial.author.company && (
                  <p className={styles.modalAuthorCompany}>{testimonial.author.company}</p>
                )}
              </div>
            </div>
            
            <blockquote className={styles.modalQuote}>
              "{testimonial.text}"
            </blockquote>
            
            {testimonial.verified && (
              <div className={styles.modalVerified}>
                <span className={styles.verified}>✓ Verified Review</span>
              </div>
            )}
          </div>
        </div>
        
        {totalCount > 1 && (
          <div className={styles.modalNavigation}>
            <button
              onClick={() => onNavigate('prev')}
              className={styles.modalNavButton}
              aria-label="Previous testimonial"
            >
              ‹
            </button>
            <span className={styles.modalCounter}>
              {currentIndex + 1} of {totalCount}
            </span>
            <button
              onClick={() => onNavigate('next')}
              className={styles.modalNavButton}
              aria-label="Next testimonial"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
