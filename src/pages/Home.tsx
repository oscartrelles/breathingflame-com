import { useHome, usePrograms, useExperiences } from '@/hooks/useFirestore'
import { VideoBackground } from '@/components/VideoBackground'
import { SEO } from '@/components/SEO'
import { trackTypeformInteraction } from '@/components/Analytics'
import { motion } from 'framer-motion'
import { 
  fadeInUp, 
  heroText, 
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
  const reducedMotion = useReducedMotion()

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
          title: homeData?.seo?.title || 'Breathing Flame - Resilience. Clarity. Transformation.',
          description: homeData?.seo?.description || 'Perform at your best. Live with clarity. Transform your life through breathwork, mindfulness, and transformative experiences.',
          image: homeData?.seo?.ogImage || '/og-image.jpg'
        }}
      />

      {/* Hero Section with YouTube Video Background */}
      <section className={`${styles.hero} home-hero`}>
        {/* YouTube Video Background */}
        <VideoBackground
          videoId="KcK67tYvPgA"
          title="Breathing Flame Hero Video"
          overlay={true}
          overlayOpacity={0.65}
          startTime={6}
          endTime={80}
          className={styles.heroVideoBackground}
        />

        {/* Hero Content Overlay */}
        <div className={styles.heroContent}>
          <div className="container">
            <motion.h1 
              className={styles.heroTitle}
              variants={reducedMotion ? {} : heroText}
            >
              {homeData?.hero?.headline || 'Resilience. Clarity. Transformation.'}
            </motion.h1>
            
            <motion.p 
              className={styles.heroSubtitle}
              variants={reducedMotion ? {} : fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {homeData?.hero?.subtext || 'We help individuals and organizations unlock performance, wellbeing, and long-term vitality through science-backed, nature-powered practices.'}
            </motion.p>
            

            <motion.div 
              className={`${styles.heroCTA} cta-container`}
              variants={reducedMotion ? {} : fadeInUp}
              transition={{ delay: 0.4 }}
            >
              {(homeData?.hero?.ctas || [
                { label: 'For Individuals', pathOrUrl: '/individuals', external: false },
                { label: 'For Organizations', pathOrUrl: '/organizations', external: false }
              ]).map((cta: any, idx: number) => (
                <motion.a
                  key={idx}
                  href={cta.pathOrUrl}
                  className={`btn ${idx === 0 ? 'btn--primary' : 'btn--secondary'} btn--large`}
                  whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
                  whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  target={cta.external ? '_blank' : undefined}
                  rel={cta.external ? 'noopener noreferrer' : undefined}
                >
                  {cta.label}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars Section - Staggered reveal like Positive Intelligence */}
      <section className="section section--lg">
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            {...useInViewAnimation()}
          >
            <h2 className={styles.sectionTitle}>Our Three Pillars</h2>
            <p className={styles.sectionDescription}>Resilience. Clarity. Transformation.</p>
          </motion.div>

          <motion.div 
            className={styles.pillarsGrid}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {homeData?.pillars?.map((pillar, index) => (
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
                      {pillar.icon || pillar.title.charAt(0)}
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
                      {program.ctaText || 'Learn More'}
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
                      {experience.ctaText || 'Experience Now'}
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
            <h2 className={styles.sectionTitle}>{homeData?.sections?.testimonials?.headline || 'What People Are Saying'}</h2>
            <p className={styles.sectionDescription}>{homeData?.sections?.testimonials?.subtext || 'Our clients—from entrepreneurs to teams—consistently highlight the power of resilience, clarity, and transformation.'}</p>
          </div>

          {/* Senja Testimonials Widget */}
          <div className={styles.senjaContainer}>
            <div 
              className="senja-embed" 
              data-id="81b3e80e-4b5d-4110-9928-fff9a187aa48" 
              data-mode="shadow" 
              data-lazyload="false" 
              style={{ display: 'block', width: '100%' }}
            ></div>
          </div>
        </div>
      </section>

      {/* Organization Preview Cards */}
      {homeData?.sections?.organizations?.cards && homeData.sections.organizations.cards.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{homeData?.sections?.organizations?.headline || 'For Organizations'}</h2>
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
              <h2 className={styles.sectionTitle}>{homeData?.sections?.community?.headline || 'Join Our Community'}</h2>
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

