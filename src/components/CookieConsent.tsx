import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackButtonClick } from './Analytics'
import styles from './CookieConsent.module.css'

interface CookieConsentProps {
  className?: string
}

export function CookieConsent({ className = '' }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Check if user has already accepted cookies
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      // Show cookie banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    setIsAnimating(true)
    
    // Track the acceptance
    trackButtonClick('cookie_accept', 'consent_banner')
    
    // Store consent in localStorage
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    
    // Hide the banner
    setTimeout(() => {
      setIsVisible(false)
      setIsAnimating(false)
    }, 300)
  }

  const handleDecline = () => {
    setIsAnimating(true)
    
    // Track the decline
    trackButtonClick('cookie_decline', 'consent_banner')
    
    // Store consent in localStorage
    localStorage.setItem('cookie-consent', 'declined')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    
    // Hide the banner
    setTimeout(() => {
      setIsVisible(false)
      setIsAnimating(false)
    }, 300)
  }

  const handleLearnMore = () => {
    trackButtonClick('cookie_learn_more', 'consent_banner')
    // Navigate to privacy policy or cookie policy
    window.open('/privacy#cookies', '_blank')
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className={`${styles.cookieBanner} ${className}`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: isAnimating ? 0.95 : 1
        }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ 
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <div className={styles.content}>
          <div className={styles.text}>
            <h3 className={styles.title}>🍪 We use cookies</h3>
            <p className={styles.description}>
              We use cookies to enhance your experience, analyze site traffic, and personalize content. 
              By continuing to use our site, you consent to our use of cookies.{' '}
              <button 
                type="button"
                className={styles.learnMoreLink}
                onClick={handleLearnMore}
              >
                Learn more
              </button>
            </p>
          </div>
          
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.declineButton}
              onClick={handleDecline}
              disabled={isAnimating}
            >
              Decline
            </button>
            <button
              type="button"
              className={styles.acceptButton}
              onClick={handleAccept}
              disabled={isAnimating}
            >
              Accept All
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

