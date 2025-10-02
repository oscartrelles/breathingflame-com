import React from 'react'
import { motion } from 'framer-motion'
import { useInViewAnimation } from '@/utils/animations'
import styles from './FinalCTABand.module.css'

export interface CTAButton {
  label: string
  url: string
  external?: boolean
}

export interface FinalCTABandProps {
  headline?: string
  subtext?: string
  buttons?: CTAButton[]
  className?: string
  onButtonClick?: (label: string, url: string, external: boolean) => void
  fallbackHeadline?: string
  fallbackSubtext?: string
  fallbackButtons?: CTAButton[]
}

export function FinalCTABand({ 
  headline, 
  subtext, 
  buttons, 
  className = '',
  onButtonClick,
  fallbackHeadline = "Ready to Get Started?",
  fallbackSubtext = "Take the next step in your journey.",
  fallbackButtons = [
    { label: "Get Started", url: "/contact", external: false },
    { label: "Learn More", url: "/programs", external: false }
  ]
}: FinalCTABandProps) {
  const handleButtonClick = (button: CTAButton) => {
    if (onButtonClick) {
      onButtonClick(button.label, button.url, button.external || false)
    }
  }

  // Use fallbacks if data is missing
  const displayHeadline = headline || fallbackHeadline
  const displaySubtext = subtext || fallbackSubtext
  const displayButtons = buttons && buttons.length > 0 ? buttons : fallbackButtons

  // Don't render if no data and no fallbacks
  if (!displayHeadline && !displaySubtext && (!displayButtons || displayButtons.length === 0)) {
    return null
  }

  return (
    <motion.section 
      className={`section ${styles.finalCTA} ${className}`}
      {...useInViewAnimation()}
    >
      <div className="container">
        <div className={styles.finalCTAContent}>
          <h2 className={styles.finalCTAHeadline}>
            {displayHeadline}
          </h2>
          {displaySubtext && (
            <p className={styles.finalCTASubtext}>
              {displaySubtext}
            </p>
          )}
          <div className={styles.finalCTAButtons}>
            {displayButtons.map((button, index) => (
              <a
                key={index}
                href={button.url}
                className={`btn btn--on-accent ${index === 0 ? 'btn--primary' : 'btn--secondary'} btn--large`}
                onClick={(e) => {
                  e.preventDefault()
                  handleButtonClick(button)
                }}
                target={button.external ? '_blank' : undefined}
                rel={button.external ? 'noopener noreferrer' : undefined}
              >
                {button.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
