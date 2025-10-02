import React from 'react'
import styles from './OfferingCard.module.css'

export interface Offering {
  id: string
  kind: 'program' | 'experience' | 'solution'
  title: string
  subtitle?: string
  shortDescription?: string
  description?: string
  summary?: string
  image?: string
  duration?: string
  format?: {
    delivery?: string
  }
  format_legacy?: string
  tags?: string[]
  ctaText?: string
  ctaHref?: string
  slug?: string
  order?: number
  eyebrow?: string
}

interface OfferingCardProps {
  offering: Offering
  pageData?: any
  className?: string
  showEyebrow?: boolean
  customEyebrow?: string
}

export function OfferingCard({ 
  offering, 
  pageData, 
  className = '', 
  showEyebrow = true,
  customEyebrow 
}: OfferingCardProps) {
  const getSummary = () => {
    return offering.shortDescription || offering.description || offering.summary || ''
  }

  const getEyebrow = () => {
    if (customEyebrow) return customEyebrow
    if (offering.eyebrow) return offering.eyebrow
    
    if (offering.kind === 'program') {
      return pageData?.typeLabels?.program || 'Program'
    } else if (offering.kind === 'experience') {
      return pageData?.typeLabels?.experience || 'Experience'
    } else if (offering.kind === 'solution') {
      return 'Solution'
    }
    return 'Offering'
  }

  const getCtaText = () => {
    return offering.ctaText || 'Learn More'
  }

  const getCtaHref = () => {
    if (offering.ctaHref) return offering.ctaHref
    
    if (offering.kind === 'solution' && offering.slug) {
      return `/solutions/${offering.slug}`
    }
    
    return '#'
  }


  const handleClick = (e: React.MouseEvent) => {
    // Track interaction if needed
    // console.log(`Clicked on ${offering.kind}: ${offering.title}`)
  }

  return (
    <a
      href={getCtaHref()}
      className={`${styles.cardLink} ${className}`}
      onClick={handleClick}
      aria-label={`Open ${offering.title} (${offering.kind})`}
    >
      <div className={styles.cardImage}>
        {offering.image && (
          <img src={offering.image} alt={offering.title} />
        )}
        {showEyebrow && (
          <div className={styles.cardEyebrow}>
            {getEyebrow()}
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{offering.title}</h3>
        {offering.subtitle && (
          <p className={styles.cardSubtitle}>{offering.subtitle}</p>
        )}
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
          {offering.duration && (
            <span className={styles.cardDuration}>{offering.duration}</span>
          )}
          {(offering.format?.delivery || offering.format_legacy) && (
            <span className={styles.cardFormat}>
              {offering.format?.delivery || offering.format_legacy}
            </span>
          )}
        </div>
        
        <div className={styles.cardCTA}>
          <span className="btn btn--secondary">
            {getCtaText()}
          </span>
        </div>
      </div>
    </a>
  )
}
