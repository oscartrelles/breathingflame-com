import { useEffect, useState, useRef } from 'react'
import { Testimonial, selectTestimonials, TestimonialSelectionOptions } from '@/lib/testimonials'
import { useContent } from '@/hooks/useContent'
import styles from './TestimonialsRail.module.css'

interface TestimonialsRailProps {
  testimonialRefs?: string[] // Specific testimonial IDs to display (overrides context filtering)
  context?: {
    programSlug?: string
    experienceSlug?: string
    solutionSlug?: string
    audience?: 'individuals' | 'organizations'
  }
  maxCount?: number
  minRating?: number
  title?: string
  subtext?: string
  className?: string
}

export function TestimonialsRail({
  testimonialRefs,
  context,
  maxCount = 6,
  minRating = 4,
  title = "What People Say",
  subtext,
  className
}: TestimonialsRailProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const { data: contentData } = useContent()

  useEffect(() => {
    if (!contentData?.testimonials) {
      setLoading(false)
      return
    }

    // Convert testimonials data to our interface
    const testimonialsData: Testimonial[] = contentData.testimonials.map((testimonial: any) => ({
      id: testimonial.id,
      author: {
        name: testimonial.author?.name || 'Anonymous',
        role: testimonial.author?.title || testimonial.author?.role,
        avatar: testimonial.author?.avatar
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
      createdAt: testimonial.createdAt || new Date().toISOString(),
      updatedAt: testimonial.updatedAt || new Date().toISOString()
    }))

    let selectedTestimonials: Testimonial[] = []

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
        maxCount
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
        source: testimonialRefs ? 'curated' : 'context-aware'
      })
    }
  }, [contentData, context, maxCount, minRating, testimonialRefs])

  // Modal handlers
  const openModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'testimonial_modal_open', {
        testimonial_id: testimonial.id,
        route: window.location.pathname
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
      newIndex = currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1
    } else {
      newIndex = currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0
    }
    
    setSelectedTestimonial(testimonials[newIndex])
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return
      
      switch (e.key) {
        case 'Escape':
          closeModal()
          break
        case 'ArrowLeft':
          e.preventDefault()
          navigateTestimonial('prev')
          break
        case 'ArrowRight':
          e.preventDefault()
          navigateTestimonial('next')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, selectedTestimonial, testimonials])

  // Focus trap
  useEffect(() => {
    if (!isModalOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    firstElement?.focus()
    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isModalOpen])

  if (loading) {
    return (
      <div className={`${styles.rail} ${className || ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtext && <p className={styles.subtext}>{subtext}</p>}
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading testimonials...</p>
        </div>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className={`${styles.rail} ${className || ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtext && <p className={styles.subtext}>{subtext}</p>}
      </div>
      
      <div className={styles.grid}>
        {testimonials.map((testimonial) => (
          <TestimonialCard 
            key={testimonial.id} 
            testimonial={testimonial} 
            onReadMore={() => openModal(testimonial)}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedTestimonial && (
        <div 
          className={styles.modalOverlay}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            ref={modalRef}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 id="modal-title" className={styles.modalTitle}>Testimonial</h3>
              <button 
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <blockquote className={styles.modalQuote}>
                <p className={styles.modalText}>"{selectedTestimonial.text}"</p>
              </blockquote>
              
              <div className={styles.modalAuthor}>
                {selectedTestimonial.author.avatar && (
                  <div className={styles.modalAvatar}>
                    <img 
                      src={selectedTestimonial.author.avatar} 
                      alt={`${selectedTestimonial.author.name} avatar`} 
                    />
                  </div>
                )}
                <div className={styles.modalAuthorInfo}>
                  <cite className={styles.modalAuthorName}>{selectedTestimonial.author.name}</cite>
                  {selectedTestimonial.author.role && (
                    <p className={styles.modalAuthorRole}>{selectedTestimonial.author.role}</p>
                  )}
                </div>
              </div>

              {selectedTestimonial.rating && (
                <div className={styles.modalRating} aria-label={`${selectedTestimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${i < selectedTestimonial.rating! ? styles.starFilled : styles.starEmpty}`}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>

            {testimonials.length > 1 && (
              <div className={styles.modalNavigation}>
                <button 
                  className={styles.navButton}
                  onClick={() => navigateTestimonial('prev')}
                  aria-label="Previous testimonial"
                >
                  ← Previous
                </button>
                <span className={styles.navCounter}>
                  {testimonials.findIndex(t => t.id === selectedTestimonial.id) + 1} of {testimonials.length}
                </span>
                <button 
                  className={styles.navButton}
                  onClick={() => navigateTestimonial('next')}
                  aria-label="Next testimonial"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

interface TestimonialCardProps {
  testimonial: Testimonial
  onReadMore: () => void
}

function TestimonialCard({ testimonial, onReadMore }: TestimonialCardProps) {
  const { author, text, rating } = testimonial
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Check if text is overflowing (needs "Read more")
  useEffect(() => {
    if (!textRef.current) return

    const element = textRef.current
    const lineHeight = parseInt(getComputedStyle(element).lineHeight)
    
    // Responsive line clamping
    let maxLines = 10 // Desktop default
    if (window.innerWidth <= 480) {
      maxLines = 4
    } else if (window.innerWidth <= 768) {
      maxLines = 6
    } else if (window.innerWidth <= 1024) {
      maxLines = 8
    }
    
    const maxHeight = lineHeight * maxLines
    setIsOverflowing(element.scrollHeight > maxHeight)
  }, [text])

  // Re-check on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!textRef.current) return

      const element = textRef.current
      const lineHeight = parseInt(getComputedStyle(element).lineHeight)
      
      let maxLines = 10
      if (window.innerWidth <= 480) {
        maxLines = 4
      } else if (window.innerWidth <= 768) {
        maxLines = 6
      } else if (window.innerWidth <= 1024) {
        maxLines = 8
      }
      
      const maxHeight = lineHeight * maxLines
      setIsOverflowing(element.scrollHeight > maxHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [text])

  return (
    <blockquote className={styles.card}>
      <div className={styles.content}>
        <p 
          ref={textRef}
          className={`${styles.text} ${isOverflowing ? styles.textClamped : ''}`}
        >
          "{text}"
        </p>
        {isOverflowing && (
          <button 
            className={styles.readMoreButton}
            onClick={onReadMore}
            aria-label="Read full testimonial"
          >
            Read more
          </button>
        )}
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.author}>
          {author.avatar && (
            <div className={styles.avatar}>
              <img src={author.avatar} alt={`${author.name} avatar`} />
            </div>
          )}
          <div className={styles.authorInfo}>
            <cite className={styles.name}>{author.name}</cite>
            {author.role && <p className={styles.role}>{author.role}</p>}
          </div>
        </div>
        
        {rating && (
          <div className={styles.rating} aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`${styles.star} ${i < rating ? styles.starFilled : styles.starEmpty}`}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>
        )}
      </footer>
    </blockquote>
  )
}
