import React from 'react'
import { motion } from 'framer-motion'
import styles from './ErrorState.module.css'

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | string
  onRetry?: () => void
  retryText?: string
  variant?: 'page' | 'card' | 'inline'
  className?: string
  showDetails?: boolean
}

export function ErrorState({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  error,
  onRetry,
  retryText = 'Try Again',
  variant = 'page',
  className = '',
  showDetails = false
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error
  const errorStack = error instanceof Error ? error.stack : undefined

  const containerClass = `${styles.container} ${styles[variant]} ${className}`

  return (
    <motion.div 
      className={containerClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
              fill="currentColor"
            />
          </svg>
        </div>
        
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        
        {showDetails && errorMessage && (
          <details className={styles.details}>
            <summary className={styles.detailsSummary}>Error Details</summary>
            <div className={styles.detailsContent}>
              <code className={styles.errorCode}>{errorMessage}</code>
              {errorStack && (
                <pre className={styles.errorStack}>{errorStack}</pre>
              )}
            </div>
          </details>
        )}
        
        {onRetry && (
          <button 
            className={styles.retryButton}
            onClick={onRetry}
            aria-label={retryText}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" 
                fill="currentColor"
              />
            </svg>
            {retryText}
          </button>
        )}
      </div>
    </motion.div>
  )
}
