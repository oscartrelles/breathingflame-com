import { useEffect, useRef, useState } from 'react'
import styles from './TypeformEmbed.module.css'

interface TypeformEmbedProps {
  src: string
  title: string
  height?: number
  className?: string
}

/**
 * TypeformEmbed - Responsive Typeform iframe with fallbacks
 * 
 * This component renders a Typeform assessment in an iframe with:
 * - Responsive height (600-1000px range)
 * - PostMessage resize listener for Typeform auto-resize
 * - Graceful fallback link if iframe fails to load
 * - Lazy loading for performance
 * - Accessibility features
 */
export function TypeformEmbed({ 
  src, 
  title, 
  height = 800, 
  className = '' 
}: TypeformEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Handle Typeform postMessage resize events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from Typeform
      if (event.origin !== 'https://form.typeform.com' && 
          event.origin !== 'https://admin.typeform.com') {
        return
      }

      // Handle height resize messages
      if (event.data && typeof event.data === 'object') {
        if (event.data.type === 'form:ready' || event.data.type === 'form:resize') {
          const newHeight = event.data.height
          if (newHeight && iframeRef.current) {
            // Clamp height between 600px and 1000px for responsive design
            const clampedHeight = Math.max(600, Math.min(1000, newHeight))
            iframeRef.current.style.height = `${clampedHeight}px`
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleIframeLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleIframeError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  // Ensure URL is properly formatted
  const formattedSrc = src.includes('?') 
    ? `${src}&embed=popup&embed-hide-headers=true&embed-hide-footer=true`
    : `${src}?embed=popup&embed-hide-headers=true&embed-hide-footer=true`

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.wrapper}>
        {!hasError && (
          <iframe
            ref={iframeRef}
            src={formattedSrc}
            title={title}
            className={styles.iframe}
            style={{ height: `${height}px` }}
            allowFullScreen
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            aria-label={title}
          />
        )}

        {hasError && (
          <div className={styles.error}>
            <div className={styles.errorContent}>
              <h3>Unable to load assessment</h3>
              <p>
                There was a problem loading the assessment. 
                You can still access it directly using the link below.
              </p>
              <a 
                href={src} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                Open Assessment in New Tab
              </a>
            </div>
          </div>
        )}

        {/* Fallback link for noscript users */}
        <noscript>
          <div className={styles.noscript}>
            <p>
              <a href={src} target="_blank" rel="noopener noreferrer">
                Open {title} in a new tab
              </a>
            </p>
          </div>
        </noscript>

        {/* Loading indicator */}
        {!isLoaded && !hasError && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading assessment...</p>
          </div>
        )}
      </div>
    </div>
  )
}

