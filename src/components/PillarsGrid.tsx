import React from 'react'
import { motion } from 'framer-motion'
import { PillarCard, Pillar } from './PillarCard'
import { AnimatedWrapper } from './AnimatedWrapper'
import { useAnimation } from './AnimationProvider'
import { staggerContainer, staggerChild } from '@/utils/animationSystem'
import styles from './PillarsGrid.module.css'

interface PillarsGridProps {
  pillars: Pillar[]
  title?: string
  subtitle?: string
  className?: string
  reducedMotion?: boolean
}

export function PillarsGrid({ 
  pillars, 
  title, 
  subtitle, 
  className = '',
  reducedMotion = false 
}: PillarsGridProps) {
  const { getAnimationVariants, animationsEnabled } = useAnimation()

  if (!pillars || pillars.length === 0) {
    return null
  }

  const headerVariants = getAnimationVariants({
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  })

  const gridVariants = getAnimationVariants(staggerContainer)

  return (
    <section className={`section section--lg ${className}`}>
      <div className="container">
        {(title || subtitle) && (
          <AnimatedWrapper
            className={styles.sectionHeader}
            animation="fadeInUp"
            delay={0.1}
          >
            {title && (
              <h2 className={styles.sectionTitle}>{title}</h2>
            )}
            {subtitle && (
              <p className={styles.sectionDescription}>{subtitle}</p>
            )}
          </AnimatedWrapper>
        )}

        <motion.div 
          className={styles.pillarsGrid}
          variants={gridVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.id || index}
              pillar={pillar}
              index={index}
              variants={getAnimationVariants(staggerChild)}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
