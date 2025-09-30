import { useEffect, useState } from 'react'
import { Testimonial, selectTestimonials, TestimonialSelectionOptions } from '@/lib/testimonials'
import { useContent } from '@/hooks/useContent'
import styles from './TestimonialsRail.module.css'

interface TestimonialsRailProps {
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
  context,
  maxCount = 6,
  minRating = 4,
  title = "What People Say",
  subtext,
  className
}: TestimonialsRailProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const { data: contentData } = useContent()

  useEffect(() => {
    if (!contentData?.testimonials) {
      setLoading(false)
      return
    }

    // Convert testimonials data to our interface
    const testimonialsData: Testimonial[] = Object.entries(contentData.testimonials).map(([id, testimonial]: [string, any]) => ({
      id,
      author: {
        name: testimonial.author?.name || testimonial.name || 'Anonymous',
        role: testimonial.author?.role || testimonial.role
      },
      text: testimonial.content || testimonial.text || testimonial.review || '',
      rating: testimonial.rating || testimonial.stars || 5,
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

    // Get current route for context
    const route = window.location.pathname

    // Select testimonials based on context
    const options: TestimonialSelectionOptions = {
      route,
      context,
      minRating,
      maxCount
    }

    const selectedTestimonials = selectTestimonials(testimonialsData, options)
    setTestimonials(selectedTestimonials)
    setLoading(false)

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'testimonial_view', {
        route,
        count: selectedTestimonials.length
      })
    }
  }, [contentData, context, maxCount, minRating])

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
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { author, text, rating } = testimonial

  return (
    <blockquote className={styles.card}>
      <div className={styles.content}>
        <p className={styles.text}>"{text}"</p>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.author}>
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
