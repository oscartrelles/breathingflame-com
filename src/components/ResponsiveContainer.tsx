import React from 'react'
import { motion } from 'framer-motion'
import { useInViewAnimation } from '@/utils/animations'
import styles from './ResponsiveContainer.module.css'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  variant?: 'section' | 'card' | 'hero' | 'content'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
  as?: 'section' | 'div' | 'article' | 'aside'
}

export function ResponsiveContainer({
  children,
  className = '',
  variant = 'section',
  size = 'md',
  animate = true,
  as: Component = 'section'
}: ResponsiveContainerProps) {
  const containerClass = `${styles.container} ${styles[variant]} ${styles[size]} ${className}`
  
  if (animate) {
    return (
      <motion.div
        as={Component}
        className={containerClass}
        {...useInViewAnimation()}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <Component className={containerClass}>
      {children}
    </Component>
  )
}
