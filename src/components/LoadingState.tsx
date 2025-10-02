import React from 'react'
import { motion } from 'framer-motion'
import styles from './LoadingState.module.css'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
  fullScreen?: boolean
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md', 
  variant = 'spinner',
  className = '',
  fullScreen = false 
}: LoadingStateProps) {
  const containerClass = fullScreen ? styles.fullScreen : styles.container
  const sizeClass = styles[`size-${size}`]

  return (
    <div className={`${containerClass} ${className}`}>
      <motion.div 
        className={styles.loadingContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {variant === 'spinner' && (
          <div className={`${styles.spinner} ${sizeClass}`}>
            <div className={styles.spinnerInner}></div>
          </div>
        )}
        
        {variant === 'dots' && (
          <div className={`${styles.dots} ${sizeClass}`}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}
        
        {variant === 'pulse' && (
          <div className={`${styles.pulse} ${sizeClass}`}>
            <div className={styles.pulseCircle}></div>
          </div>
        )}
        
        {message && (
          <p className={styles.message}>{message}</p>
        )}
      </motion.div>
    </div>
  )
}
