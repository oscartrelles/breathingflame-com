import { useState, useEffect } from 'react'
import styles from './VideoBackground.module.css'

interface VideoBackgroundProps {
  videoId: string
  title?: string
  className?: string
  overlay?: boolean
  overlayOpacity?: number
  startTime?: number // Start time in seconds
  endTime?: number   // End time in seconds
}

/**
 * Video Background Component - YouTube video as background
 * 
 * Features:
 * - YouTube video as full-screen background
 * - Automatic play on load (muted)
 * - Responsive design
 * - Overlay support for text readability
 * - Performance optimized
 * - Accessibility friendly
 */
export function VideoBackground({ 
  videoId, 
  title = "Background Video",
  className = '',
  overlay = true,
  overlayOpacity = 0.4,
  startTime = 0,
  endTime = 0
}: VideoBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Load YouTube iframe API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Set up YouTube API ready callback
    window.onYouTubeIframeAPIReady = () => {
      setIsLoaded(true)
    }

    return () => {
      // Cleanup
      if (window.YT && window.YT.Player) {
        const players = document.querySelectorAll('.youtube-player')
        players.forEach(player => {
          if (player.id) {
            window.YT.Player.get(player.id)?.destroy()
          }
        })
      }
    }
  }, [])

  const handleError = () => {
    setHasError(true)
    console.warn('YouTube video failed to load:', videoId)
  }

  const containerClasses = `${styles.videoContainer} ${className}`

  return (
    <div className={containerClasses}>
      {/* YouTube Video Background */}
      <div className={styles.videoWrapper}>
        <iframe
          className={styles.video}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&enablejsapi=1&start=${startTime}&end=${endTime}`}
          title={title}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          onError={handleError}
        />
      </div>

      {/* Overlay for text readability */}
      {overlay && (
        <div 
          className={styles.overlay}
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Fallback content if video fails to load */}
      {hasError && (
        <div className={styles.fallback}>
          <div className={styles.fallbackContent}>
            <h3>Video temporarily unavailable</h3>
            <p>The background video is currently unavailable. Please refresh the page.</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </div>
  )
}

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
