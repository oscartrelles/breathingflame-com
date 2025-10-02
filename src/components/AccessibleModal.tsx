import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAccessibility } from './AccessibilityProvider'
import { trapFocus, restoreFocus, ARIA_LABELS } from '@/utils/accessibility'
import styles from './AccessibleModal.module.css'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  ariaLabel,
  ariaDescribedBy,
  className = ''
}: AccessibleModalProps) {
  const { announce, reducedMotion } = useAccessibility()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const cleanupFocusTrapRef = useRef<(() => void) | null>(null)

  // Handle opening/closing animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsAnimating(true)
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => setIsAnimating(false), 50)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsAnimating(false)
      }, reducedMotion ? 0 : 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, reducedMotion])

  // Handle focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Trap focus within the modal
      cleanupFocusTrapRef.current = trapFocus(modalRef.current)
      
      // Announce modal opening
      announce(`Modal opened: ${title}`, 'polite')
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else if (!isOpen && previousFocusRef.current) {
      // Restore focus to previously focused element
      restoreFocus(previousFocusRef.current)
      previousFocusRef.current = null
      
      // Announce modal closing
      announce('Modal closed', 'polite')
      
      // Restore body scroll
      document.body.style.overflow = 'unset'
    }

    return () => {
      if (cleanupFocusTrapRef.current) {
        cleanupFocusTrapRef.current()
        cleanupFocusTrapRef.current = null
      }
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, title, announce])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeOnEscape, onClose])

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  // Handle close button click
  const handleCloseClick = () => {
    onClose()
  }

  if (!isVisible) {
    return null
  }

  const modalContent = (
    <div
      className={`${styles.overlay} ${isAnimating ? styles.animating : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${styles[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              className={styles.closeButton}
              onClick={handleCloseClick}
              aria-label={ARIA_LABELS.closeModal}
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
        
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Hook for managing modal state
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(prev => !prev)

  return {
    isOpen,
    open,
    close,
    toggle
  }
}
