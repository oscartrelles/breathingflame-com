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

interface HeroMedia {
  imageUrl?: string
  videoEmbed?: string
  videoId?: string
}

interface HeroSectionProps {
  title: string
  subtitle: string
  // Legacy top-level props
  videoId?: string
  videoEmbed?: string
  imageUrl?: string
  // New preferred structure
  media?: HeroMedia
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
  videoEmbed,
  imageUrl,
  media,
  ctas = [], 
  className = '' 
}: HeroSectionProps) {
  const reducedMotion = useReducedMotion()

  function ensureAutoplayEmbed(url: string | undefined): string | undefined {
    if (!url) return url
    try {
      const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://example.com')
      // Only handle youtube embeds; otherwise just append autoplay parameters
      const pathname = u.pathname || ''
      let videoIdFromPath = ''
      const match = pathname.match(/\/embed\/([^/?#]+)/)
      if (match && match[1]) videoIdFromPath = match[1]

      // Required params for background playback
      const params = u.searchParams
      params.set('autoplay', '1')
      params.set('mute', '1')
      params.set('controls', '0')
      params.set('playsinline', '1')
      params.set('modestbranding', '1')
      params.set('rel', '0')
      params.set('showinfo', '0')
      params.set('loop', '1')
      if (videoIdFromPath) params.set('playlist', videoIdFromPath)

      u.search = params.toString()
      return u.toString()
    } catch {
      // If URL constructor fails (relative URL), fall back to appending params naïvely
      const hasQuery = url.includes('?')
      const base = url + (hasQuery ? '&' : '?')
      return `${base}autoplay=1&mute=1&controls=0&playsinline=1&modestbranding=1&rel=0&loop=1`
    }
  }

  return (
    <section className={`${styles.hero} ${className}`}>
      {/* Preferred: Video Embed Background */}
      {Boolean((media?.videoEmbed ?? videoEmbed)?.trim()) && (
        <div className={styles.heroVideoEmbedBackground}>
          <iframe
            src={ensureAutoplayEmbed((media?.videoEmbed ?? videoEmbed) as string)}
            title="Hero Background Video"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className={styles.heroVideoEmbed}
          />
        </div>
      )}

      {/* Fallback: Image Background */}
      {!Boolean((media?.videoEmbed ?? videoEmbed)?.trim()) && Boolean((media?.imageUrl ?? imageUrl)?.trim()) && (
        <div 
          className={styles.heroImageBackground}
          style={{ backgroundImage: `url(${(media?.imageUrl ?? imageUrl) as string})` }}
        />
      )}

      {/* Fallback Background */}
      {!Boolean((media?.videoEmbed ?? videoEmbed)?.trim()) && !Boolean((media?.imageUrl ?? imageUrl)?.trim()) && (
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
