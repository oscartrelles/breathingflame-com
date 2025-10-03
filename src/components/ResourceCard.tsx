import React from 'react'
import { AnimatedCard } from './AnimatedWrapper'
import { useAnimation } from './AnimationProvider'
import styles from './ResourceCard.module.css'

export interface Resource {
  id?: string
  title: string
  description: string
  ctaText: string
  ctaHref: string
  external?: boolean
  type?: 'guide' | 'article' | 'assessment' | 'other'
}

interface ResourceCardProps {
  resource: Resource
  index?: number
  className?: string
  variants?: any
  reducedMotion?: boolean
}

export function ResourceCard({ 
  resource, 
  index = 0, 
  className = '', 
  variants,
  reducedMotion = false 
}: ResourceCardProps) {
  const { getAnimationVariants } = useAnimation()

  const handleClick = (e: React.MouseEvent) => {
    // Track interaction if needed
    // console.log(`Clicked on resource: ${resource.title}`)
  }

  const animationVariants = getAnimationVariants(variants || {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  })

  return (
    <AnimatedCard 
      className={`${styles.resourceCard} ${className}`}
      variants={animationVariants}
      delay={index * 0.1}
    >
      <div className={styles.cardContent}>
        <h3 className={styles.resourceTitle}>{resource.title}</h3>
        <div className={styles.resourceDescription}>
          {resource.description.split('\n').map((line, index) => (
            <div key={index} className={styles.descriptionLine}>
              {line}
            </div>
          ))}
        </div>
        
        {resource.ctaText && (
          <div className={styles.cardCTA}>
            <a 
              href={resource.ctaHref}
              className="btn btn--outline"
              target={resource.external ? '_blank' : undefined}
              rel={resource.external ? 'noopener noreferrer' : undefined}
              onClick={handleClick}
              aria-label={`Open ${resource.title}`}
            >
              {resource.ctaText}
            </a>
          </div>
        )}
      </div>
    </AnimatedCard>
  )
}
