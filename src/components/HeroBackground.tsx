import { VideoBackground } from './VideoBackground'
import styles from './HeroBackground.module.css'

interface HeroBackgroundProps {
  videoId?: string
  imageUrl?: string
  title?: string
  className?: string
  overlay?: boolean
  overlayOpacity?: number
  startTime?: number
  endTime?: number
  tuckedBehindHeader?: boolean
}

/**
 * Hero Background Component - Supports video, image, or black background
 * 
 * Features:
 * - YouTube video background (priority)
 * - Image background fallback
 * - Black background fallback
 * - Overlay support for text readability
 * - Responsive design
 * - Performance optimized
 */
export function HeroBackground({ 
  videoId,
  imageUrl,
  title = "Hero Background",
  className = '',
  overlay = true,
  startTime = 0,
  endTime = 60,
  tuckedBehindHeader = true
}: HeroBackgroundProps) {
  // Priority: video > image > no background (empty)
  if (videoId) {
    return (
      <VideoBackground
        videoId={videoId}
        title={title}
        className={`${styles.heroBackground} ${className}`}
        overlay={overlay}
        startTime={startTime}
        endTime={endTime}
        tuckedBehindHeader={tuckedBehindHeader}
      />
    )
  }

  if (imageUrl) {
    return (
      <div 
        className={`${styles.heroBackground} ${styles.imageBackground} ${className}`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {overlay && (
          <div 
            className={styles.overlay}
          />
        )}
      </div>
    )
  }

  // No background - return empty div
  return <div className={`${styles.heroBackground} ${className}`} />
}
