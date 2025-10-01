import { useState, useEffect, useRef } from 'react'
import { Testimonial, selectTestimonials, TestimonialSelectionOptions } from '@/lib/testimonials'
import { useContent } from '@/hooks/useContent'
import styles from './TestimonialDisplay.module.css'

interface TestimonialDisplayTestimonial extends Testimonial {
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

interface TestimonialDisplayProps {
  context?: {
    programSlug?: string
    experienceSlug?: string
    solutionSlug?: string
    audience?: 'individuals' | 'organizations'
  }
  maxItems?: number
  minRating?: number
  showRating?: boolean
  showTags?: boolean
  showSource?: boolean
  showLanguage?: boolean
  layout?: 'grid' | 'carousel' | 'list'
  title?: string
  subtext?: string
  className?: string
}

export function TestimonialDisplay({
  context,
  maxItems = 6,
  minRating = 4,
  showRating = true,
  showTags = false,
  showSource = false,
  showLanguage = false,
  layout = 'grid',
  title,
  subtext,
  className = ''
}: TestimonialDisplayProps) {
  const [displayedTestimonials, setDisplayedTestimonials] = useState<TestimonialDisplayTestimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const { data: contentData } = useContent()
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  useEffect(() => {
    if (!contentData?.testimonials) {
      setLoading(false)
      return
    }

    // Convert testimonials data to our interface
    const testimonialsData: TestimonialDisplayTestimonial[] = contentData.testimonials.map((testimonial: any) => ({
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

    // Get current route for context
    const route = window.location.pathname

    // Select testimonials based on context
    const options: TestimonialSelectionOptions = {
      route,
      context,
      minRating,
      maxCount: maxItems
    }

    const selectedTestimonials = selectTestimonials(testimonialsData, options)
    setDisplayedTestimonials(selectedTestimonials)
    setLoading(false)

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'testimonial_display_view', {
        route,
        count: selectedTestimonials.length,
        layout
      })
    }
  }, [contentData, context, maxItems, minRating, layout])

  // Touch navigation handlers
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

    if (isLeftSwipe && displayedTestimonials.length > 1) {
      setCurrentIndex((prev) => 
        prev === displayedTestimonials.length - 1 ? 0 : prev + 1
      )
    }
    if (isRightSwipe && displayedTestimonials.length > 1) {
      setCurrentIndex((prev) => 
        prev === 0 ? displayedTestimonials.length - 1 : prev - 1
      )
    }
  }

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

  const renderTestimonial = (testimonial: TestimonialDisplayTestimonial) => (
    <div key={testimonial.id} className={styles.testimonial}>
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
        
        {showRating && (
          <div className={styles.rating}>
            {renderStars(testimonial.rating || 5)}
            <span className={styles.ratingText}>{testimonial.rating || 5}/5</span>
          </div>
        )}
      </div>

      <blockquote className={styles.quote}>
        "{testimonial.text}"
      </blockquote>

      {renderTags(testimonial.tags)}

      <div className={styles.testimonialFooter}>
        {testimonial.verified && (
          <span className={styles.verified}>✓ Verified</span>
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
  )

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

  if (displayedTestimonials.length === 0) {
    return null
  }

  if (layout === 'carousel') {
    return (
      <div className={`${styles.container} ${className}`}>
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
            {displayedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={styles.carouselItem}
              >
                {renderTestimonial(testimonial)}
              </div>
            ))}
          </div>
          
          {displayedTestimonials.length > 1 && (
            <div className={styles.carouselControls}>
              <button
                onClick={() => setCurrentIndex((prev) => 
                  prev === 0 ? displayedTestimonials.length - 1 : prev - 1
                )}
                className={styles.carouselButton}
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <span className={styles.carouselIndicator}>
                {currentIndex + 1} / {displayedTestimonials.length}
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => 
                  prev === displayedTestimonials.length - 1 ? 0 : prev + 1
                )}
                className={styles.carouselButton}
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

  if (layout === 'list') {
    return (
      <div className={`${styles.container} ${className}`}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtext && <p className={styles.subtext}>{subtext}</p>}
        
        <div className={styles.list}>
          {displayedTestimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.listItem}>
              {renderTestimonial(testimonial)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default grid layout
  return (
    <div className={`${styles.container} ${className}`}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {subtext && <p className={styles.subtext}>{subtext}</p>}
      
      <div className={styles.grid}>
        {displayedTestimonials.map((testimonial) => 
          renderTestimonial(testimonial)
        )}
      </div>
    </div>
  )
}

