import React from 'react'
import { AnimatedCard } from './AnimatedWrapper'
import { useAnimation } from './AnimationProvider'
import styles from './PillarCard.module.css'

export interface Pillar {
  id?: string
  title: string
  copy: string
  icon?: string
  color?: string
}

interface PillarCardProps {
  pillar: Pillar
  index?: number
  className?: string
  variants?: any
  reducedMotion?: boolean
}

export function PillarCard({ 
  pillar, 
  index = 0, 
  className = '', 
  variants,
  reducedMotion = false 
}: PillarCardProps) {
  const { getAnimationVariants } = useAnimation()

  const getIcon = () => {
    if (pillar.icon) return pillar.icon
    if (pillar.title) return pillar.title.charAt(0)
    return '?'
  }

  const getColor = () => {
    return pillar.color || '#ffb332'
  }

  const animationVariants = getAnimationVariants(variants || {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  })

  return (
    <AnimatedCard 
      className={`${styles.pillarCard} ${className}`}
      variants={animationVariants}
      delay={index * 0.1}
    >
      <div className={styles.pillarIcon}>
        <div 
          className={styles.pillarIconInner}
          style={{ backgroundColor: getColor() }}
        >
          <span className={styles.pillarIconText}>
            {getIcon()}
          </span>
        </div>
      </div>
      
      <h3 className={styles.pillarTitle}>{pillar.title}</h3>
      <p className={styles.pillarDescription}>{pillar.copy}</p>
    </AnimatedCard>
  )
}
