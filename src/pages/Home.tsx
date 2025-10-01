import { useHome, usePrograms, useExperiences } from '@/hooks/useFirestore'
import { HeroSection } from '@/components/HeroSection'
import { SEO } from '@/components/SEO'
import { TestimonialDisplay } from '@/components/TestimonialDisplay'
import { trackTypeformInteraction } from '@/components/Analytics'
import testimonialsData from '@/content/testimonials.json'

import { motion } from 'framer-motion'
import { 
  fadeInUp, 
  staggerContainer, 
  staggerChild, 
  useInViewAnimation,
  useReducedMotion,
  pageTransition 
} from '@/utils/animations'
import styles from './Home.module.css'

/**
 * Home Page - Main landing page with Typeform sections
 * 
 * Features:
 * - Hero section with video/image background
 * - Pillars section (Resilience, Clarity, Transformation)
 * - Featured programs and experiences
 * - Testimonials carousel
 * - Organization preview cards
 * - Events section
 * - Community CTAs
 * - CRITICAL: Two Typeform sections with hash anchors
 */
export function Home() {
  const { data: homeData } = useHome()
  const { data: programs } = usePrograms()
  const { data: experiences } = useExperiences()
  
  // Get home page testimonials from playlist
  const allTestimonials = testimonialsData.testimonials || []
  const homePlaylist = testimonialsData.playlists?.home || []
  const homeTestimonials = homePlaylist.map(id => 
    allTestimonials.find(t => t.id === id)
  ).filter(Boolean) as any[]
  
  const reducedMotion = useReducedMotion()

  // Source pillars strictly from pages.home.pillars
  const pillars: any[] = Array.isArray(homeData?.pillars) ? homeData!.pillars : []

  // Get featured programs and experiences
  const featuredPrograms = programs?.filter(program => 
    homeData?.sections?.featured?.featuredPrograms?.includes(program.id)
  ) || []

  const featuredExperiences = experiences?.filter(experience => 
    homeData?.sections?.featured?.featuredExperiences?.includes(experience.id)
  ) || []

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={reducedMotion ? {} : pageTransition}
    >
      <SEO 
        data={{
          title: homeData?.seo?.title,
          description: homeData?.seo?.description,
          image: homeData?.seo?.ogImage
        }}
      />

      {/* Hero Section */}
      <HeroSection
        title={homeData?.hero?.headline}
        subtitle={homeData?.hero?.subtext}
        media={homeData?.hero?.media ?? {
          imageUrl: homeData?.hero?.imageUrl,
          videoEmbed: homeData?.hero?.videoEmbed,
          videoId: homeData?.hero?.videoId,
        }}
        ctas={homeData?.hero?.ctas}
        className="home-hero"
      />

      {/* Pillars Section - Staggered reveal like Positive Intelligence */}
      <section className="section section--lg">
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            {...useInViewAnimation()}
          >
            <h2 className={styles.sectionTitle}>{homeData?.sections?.pillars?.headline || 'Resilience. Clarity. Transformation.'}</h2>
            <p className={styles.sectionDescription}>{homeData?.sections?.pillars?.subtext || 'Three pillars that guide every program and experience we offer.'}</p>
          </motion.div>

          <motion.div 
            className={styles.pillarsGrid}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {pillars.map((pillar: any, index: number) => (
              <motion.div 
                key={pillar.id || index} 
                className={styles.pillarCard}
                variants={reducedMotion ? {} : staggerChild}
                whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
              >
                <div className={styles.pillarIcon}>
                  <div 
                    className={styles.pillarIconInner}
                    style={{ backgroundColor: pillar.color || '#ffb332' }}
                  >
                    <span className={styles.pillarIconText}>
                      {pillar.icon || (pillar.title ? pillar.title.charAt(0) : '')}
                    </span>
                  </div>
                </div>
                
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDescription}>{pillar.copy}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Programs */}
      {featuredPrograms.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Programs</h2>
              <p className={styles.sectionDescription}>
                Transform your life with our signature programs
              </p>
            </div>

            <div className={styles.programsGrid}>
              {featuredPrograms.map((program) => (
                <div key={program.id} className={styles.programCard}>
                  <div className={styles.programImage}>
                    <img src={program.image} alt={program.title} />
                  </div>
                  
                  <div className={styles.programContent}>
                    <h3 className={styles.programTitle}>{program.title}</h3>
                    <p className={styles.programSubtitle}>{program.subtitle}</p>
                    <p className={styles.programDescription}>{program.shortDescription}</p>
                    
                    <div className={styles.programMeta}>
                      <span className={styles.programDuration}>{program.duration}</span>
                      <span className={styles.programFormat}>{program.format?.delivery || program.format_legacy}</span>
                    </div>

                    <a
                      href={program.ctaHref}
                      className="btn btn--secondary"
                    >
                      {program.ctaText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Experiences */}
      {featuredExperiences.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Transformative Experiences</h2>
              <p className={styles.sectionDescription}>
                Deep dive into breathwork and mindfulness practices
              </p>
            </div>

            <div className={styles.experiencesGrid}>
              {featuredExperiences.map((experience) => (
                <div key={experience.id} className={styles.experienceCard}>
                  <div className={styles.experienceImage}>
                    <img src={experience.image} alt={experience.title} />
                  </div>
                  
                  <div className={styles.experienceContent}>
                    <h3 className={styles.experienceTitle}>{experience.title}</h3>
                    <p className={styles.experienceSubtitle}>{experience.subtitle}</p>
                    <p className={styles.experienceDescription}>{experience.shortDescription}</p>
                    
                    <div className={styles.experienceMeta}>
                      <span className={styles.experienceDuration}>{experience.duration}</span>
                      <span className={styles.experienceFormat}>{experience.format?.delivery || experience.format_legacy}</span>
                    </div>

                    <a
                      href={experience.ctaHref}
                      className="btn btn--secondary"
                    >
                      {experience.ctaText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{homeData?.sections?.testimonials?.headline}</h2>
            <p className={styles.sectionDescription}>{homeData?.sections?.testimonials?.subtext}</p>
          </div>

          {/* Home Page Testimonials */}
          {homeTestimonials.length > 0 && (
            <TestimonialDisplay 
              testimonials={homeTestimonials} 
              layout="carousel" 
              showRating={true}
              showTags={false}
              showSource={false}
              maxItems={10}
            />
          )}
        </div>
      </section>

      {/* Organization Preview Cards */}
      {homeData?.sections?.organizations?.cards && homeData.sections.organizations.cards.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{homeData?.sections?.organizations?.headline}</h2>
              <p className={styles.sectionDescription}>
                Build resilient teams and transformative cultures
              </p>
            </div>

            <div className={styles.orgCardsGrid}>
              {homeData.sections.organizations.cards.map((card, index) => (
                <div key={index} className={styles.orgCard}>
                  <div className={styles.orgCardImage}>
                    <img src={card.image || '/images/org-card.jpg'} alt={card.title} />
                  </div>
                  
                  <div className={styles.orgCardContent}>
                    <h3 className={styles.orgCardTitle}>{card.title}</h3>
                    <p className={styles.orgCardDescription}>{card.copy}</p>
                    
                    <a
                      href={card.cta.url}
                      className="btn btn--outline"
                    >
                      {card.cta.label}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community CTA */}
      {homeData?.sections?.community?.ctas && homeData.sections.community.ctas.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{homeData?.sections?.community?.headline}</h2>
            </div>
            <div className={styles.communityCTAs}>
              {homeData.sections.community.ctas.map((cta, index) => (
                <div key={index} className={styles.communityCTA}>
                  <a
                    href={cta.pathOrUrl}
                    target={cta.external ? '_blank' : undefined}
                    rel={cta.external ? 'noopener noreferrer' : undefined}
                    className={`btn ${index === 0 ? 'btn--secondary' : 'btn--primary'}`}
                  >
                    {cta.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


    </motion.div>
  )
}

