import { useState, useEffect } from 'react'
import styles from './TestimonialDisplay.module.css'

interface Testimonial {
  id: string
  text: string
  author: {
    name: string
    title: string
    company: string
    avatar: string
  }
  rating: number
  verified: boolean
  featured: boolean
  tags: string[]
  priority?: number
  sourceUrl?: string
}

interface TestimonialDisplayProps {
  testimonials: Testimonial[]
  maxItems?: number
  showRating?: boolean
  showTags?: boolean
  showSource?: boolean
  layout?: 'grid' | 'carousel' | 'list'
  className?: string
}

export function TestimonialDisplay({
  testimonials,
  maxItems = 3,
  showRating = true,
  showTags = false,
  showSource = false,
  layout = 'grid',
  className = ''
}: TestimonialDisplayProps) {
  const [displayedTestimonials, setDisplayedTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Sort by rating (highest first) and limit items
    const sorted = [...testimonials]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, maxItems)
    
    
    setDisplayedTestimonials(sorted)
  }, [testimonials, maxItems])

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

  const renderTestimonial = (testimonial: Testimonial, index: number) => (
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
            {testimonial.author.title && (
              <p className={styles.authorTitle}>{testimonial.author.title}</p>
            )}
            {testimonial.author.company && (
              <p className={styles.authorCompany}>{testimonial.author.company}</p>
            )}
          </div>
        </div>
        
        {showRating && (
          <div className={styles.rating}>
            {renderStars(testimonial.rating)}
            <span className={styles.ratingText}>{testimonial.rating}/5</span>
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

  if (layout === 'carousel') {
    return (
      <div className={`${styles.carousel} ${className}`}>
        <div 
          className={styles.carouselContainer}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {displayedTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={styles.carouselItem}
            >
              {renderTestimonial(testimonial, index)}
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
            >
              ›
            </button>
          </div>
        )}
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className={`${styles.list} ${className}`}>
        {displayedTestimonials.map((testimonial, index) => (
          <div key={testimonial.id} className={styles.listItem}>
            {renderTestimonial(testimonial, index)}
          </div>
        ))}
      </div>
    )
  }

  // Default grid layout
  return (
    <div className={`${styles.grid} ${className}`}>
      {displayedTestimonials.map((testimonial, index) => 
        renderTestimonial(testimonial, index)
      )}
    </div>
  )
}

