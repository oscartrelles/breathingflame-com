import { useEffect } from 'react'
import styles from './AssessmentOverlay.module.css'

interface AssessmentOverlayProps {
  isOpen: boolean
  onClose: () => void
  assessmentUrl: string
  title: string
}

export function AssessmentOverlay({ isOpen, onClose, assessmentUrl, title }: AssessmentOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll when overlay is closed
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close assessment"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className={styles.iframeContainer}>
        <iframe
          src={assessmentUrl}
          className={styles.iframe}
          title={title}
          allow="camera; microphone; geolocation"
        />
      </div>
    </div>
  )
}
