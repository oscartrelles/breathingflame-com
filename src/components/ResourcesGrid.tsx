import React from 'react'
import { motion } from 'framer-motion'
import { ResourceCard, Resource } from './ResourceCard'
import { AnimatedWrapper } from './AnimatedWrapper'
import { useAnimation } from './AnimationProvider'
import { staggerContainer, staggerChild } from '@/utils/animationSystem'
import styles from './ResourcesGrid.module.css'

interface ResourcesGridProps {
  resources: Resource[]
  title?: string
  subtitle?: string
  className?: string
  reducedMotion?: boolean
}

export function ResourcesGrid({ 
  resources, 
  title, 
  subtitle, 
  className = '',
  reducedMotion = false 
}: ResourcesGridProps) {
  const { getAnimationVariants } = useAnimation()

  if (!resources || resources.length === 0) {
    return null
  }

  const gridVariants = getAnimationVariants(staggerContainer)

  return (
    <section className={`section section--sm ${className}`}>
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
          className={styles.resourcesGrid}
          variants={gridVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {resources.map((resource, index) => (
            <ResourceCard
              key={resource.id || index}
              resource={resource}
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
