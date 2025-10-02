import React from 'react'
import { useAccessibility } from './AccessibilityProvider'
import { ARIA_LABELS } from '@/utils/accessibility'
import styles from './AccessibleButton.module.css'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  announceOnClick?: boolean
  announceMessage?: string
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ariaLabel,
  ariaDescribedBy,
  announceOnClick = false,
  announceMessage,
  className = '',
  disabled,
  onClick,
  ...props
}: AccessibleButtonProps) {
  const { announce, reducedMotion } = useAccessibility()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      e.preventDefault()
      return
    }

    if (announceOnClick) {
      const message = announceMessage || `Button clicked: ${children}`
      announce(message, 'polite')
    }

    onClick?.(e)
  }

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ')

  const ariaLabelFinal = ariaLabel || (typeof children === 'string' ? children : ARIA_LABELS.submitForm)

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      aria-label={ariaLabelFinal}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <>
          <span 
            className={styles.spinner} 
            aria-hidden="true"
            style={{ animationDuration: reducedMotion ? '0s' : '1s' }}
          />
          <span className="sr-only">{loadingText}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={styles.iconLeft} aria-hidden="true">
              {icon}
            </span>
          )}
          <span className={styles.content}>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className={styles.iconRight} aria-hidden="true">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  )
}
