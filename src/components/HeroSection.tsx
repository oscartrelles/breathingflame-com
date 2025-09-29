import { VideoBackground } from './VideoBackground'
import { motion } from 'framer-motion'
import { 
  fadeInUp, 
  heroText,
  useReducedMotion
} from '@/utils/animations'
import styles from './HeroSection.module.css'

interface CTA {
  label: string
  pathOrUrl: string
  external?: boolean
  onClick?: () => void
}

interface HeroSectionProps {
  title: string
  subtitle: string
  videoId?: string
  videoEmbed?: string
  imageUrl?: string
  ctas?: CTA[]
  className?: string
}

/**
 * Reusable Hero Section Component
 * 
 * Features:
 * - Consistent styling across all pages
 * - Optional video background
 * - Configurable title, subtitle, and CTAs
 * - Smooth animations
 * - Responsive design
 */
export function HeroSection({ 
  title, 
  subtitle, 
  videoId, 
  videoEmbed,
  imageUrl,
  ctas = [], 
  className = '' 
}: HeroSectionProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section className={`${styles.hero} ${className}`}>
      {/* Video Background */}
      {videoId && (
        <VideoBackground
          videoId={videoId}
          title="Hero Background Video"
          overlay={false}
          startTime={6}
          endTime={80}
          className={styles.heroVideoBackground}
        />
      )}

      {/* Video Embed Background */}
      {!videoId && videoEmbed && (
        <div className={styles.heroVideoEmbedBackground}>
          <iframe
            src={videoEmbed}
            title="Hero Background Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.heroVideoEmbed}
          />
        </div>
      )}

      {/* Image Background */}
      {!videoId && !videoEmbed && imageUrl && (
        <div 
          className={styles.heroImageBackground}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* Fallback Background */}
      {!videoId && !videoEmbed && !imageUrl && (
        <div className={styles.heroFallbackBackground} />
      )}

      {/* Hero Content Overlay */}
      <div className={styles.heroContent}>
        <div className="container">
          <motion.h1 
            className={styles.heroTitle}
            variants={reducedMotion ? {} : heroText}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            variants={reducedMotion ? {} : fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {subtitle}
          </motion.p>

          {ctas.length > 0 && (
            <motion.div 
              className={`${styles.heroCTA} cta-container`}
              variants={reducedMotion ? {} : fadeInUp}
              transition={{ delay: 0.4 }}
            >
              {ctas.map((cta, index) => {
                if (cta.onClick) {
                  return (
                    <button
                      key={index}
                      onClick={cta.onClick}
                      className={`btn ${index === 0 ? 'btn--primary' : 'btn--secondary'} btn--large`}
                    >
                      {cta.label}
                    </button>
                  )
                }
                
                return (
                  <a
                    key={index}
                    href={cta.pathOrUrl}
                    className={`btn ${index === 0 ? 'btn--primary' : 'btn--secondary'} btn--large`}
                    target={cta.external ? '_blank' : undefined}
                    rel={cta.external ? 'noopener noreferrer' : undefined}
                  >
                    {cta.label}
                  </a>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
