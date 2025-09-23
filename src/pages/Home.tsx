import { useHome, usePrograms, useExperiences } from '@/hooks/useFirestore'
import { TypeformEmbed } from '@/components/TypeformEmbed'
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
    homeData?.featuredPrograms?.includes(program.id)
  ) || []

  const featuredExperiences = experiences?.filter(experience => 
    homeData?.featuredExperiences?.includes(experience.id)
  ) || []

  // Handle Typeform interactions
  const handleTypeformOpen = (type: 'ignite' | 'peak') => {
    trackTypeformInteraction(type, 'opened')
  }

  const handleTypeformComplete = (type: 'ignite' | 'peak') => {
    trackTypeformInteraction(type, 'completed')
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={reducedMotion ? {} : pageTransition}
    >
      <SEO 
        data={{
          title: homeData?.hero?.title || 'Breathing Flame - Resilience. Clarity. Transformation.',
          description: homeData?.hero?.description || 'Perform at your best. Live with clarity. Transform your life through breathwork, mindfulness, and transformative experiences.',
          image: homeData?.hero?.backgroundImage || '/og-image.jpg'
        }}
      />

      {/* Hero Section with YouTube Video Background */}
      <section className={styles.hero}>
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
              {homeData?.hero?.title || 'Resilience. Clarity. Transformation.'}
            </motion.h1>
            
            <motion.p 
              className={styles.heroSubtitle}
              variants={reducedMotion ? {} : fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {homeData?.hero?.subtitle || 'Perform at your best. Live with clarity. Transform your life.'}
            </motion.p>
            
            <motion.p 
              className={styles.heroDescription}
              variants={reducedMotion ? {} : fadeInUp}
              transition={{ delay: 0.3 }}
            >
              {homeData?.hero?.description || 'Discover the power of breathwork, mindfulness, and transformative experiences that help you build resilience, gain clarity, and create lasting positive change in your life.'}
            </motion.p>

            <motion.div 
              className={styles.heroCTA}
              variants={reducedMotion ? {} : fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <motion.a
                href={homeData?.hero?.ctaHref || '/contact'}
                className="btn btn--primary btn--large"
                whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {homeData?.hero?.ctaText || 'Start Your Journey'}
              </motion.a>
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
            <p className={styles.sectionDescription}>
              The foundation of transformation through breathwork and mindfulness
            </p>
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
                <p className={styles.pillarDescription}>{pillar.description}</p>
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
                      <span className={styles.programFormat}>{program.format}</span>
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
                      <span className={styles.experienceFormat}>{experience.format}</span>
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
            <h2 className={styles.sectionTitle}>What People Say</h2>
            <p className={styles.sectionDescription}>
              Real stories from our community
            </p>
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
      {homeData?.orgPreviewCards && homeData.orgPreviewCards.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>For Organizations</h2>
              <p className={styles.sectionDescription}>
                Build resilient teams and transformative cultures
              </p>
            </div>

            <div className={styles.orgCardsGrid}>
              {homeData.orgPreviewCards.map((card, index) => (
                <div key={index} className={styles.orgCard}>
                  <div className={styles.orgCardImage}>
                    <img src={card.image} alt={card.title} />
                  </div>
                  
                  <div className={styles.orgCardContent}>
                    <h3 className={styles.orgCardTitle}>{card.title}</h3>
                    <p className={styles.orgCardDescription}>{card.description}</p>
                    
                    <a
                      href={card.href}
                      className="btn btn--outline"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community CTAs */}
      {homeData?.communityCTAs && homeData.communityCTAs.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.communityCTAs}>
              {homeData.communityCTAs.map((cta, index) => (
                <div key={index} className={styles.communityCTA}>
                  <h3 className={styles.communityCTATitle}>{cta.title}</h3>
                  <p className={styles.communityCTADescription}>{cta.description}</p>
                  
                  <a
                    href={cta.buttonHref}
                    className="btn btn--primary"
                  >
                    {cta.buttonText}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CRITICAL: Typeform Sections with Hash Anchors */}
      {homeData?.typeforms?.enabled && (
        <>
          {/* Ignite Your Flame Section */}
          <section 
            id="ignite-your-flame" 
            className={`section ${styles.typeformSection}`}
          >
            <div className="container">
              <div className={styles.typeformHeader}>
                <h2 className={styles.typeformTitle}>Ignite Your Flame</h2>
                <p className={styles.typeformDescription}>
                  Discover your inner fire and unlock your potential with our comprehensive assessment. 
                  This personalized evaluation will help you identify your strengths, challenges, and 
                  the path to transformation.
                </p>
              </div>

              <TypeformEmbed
                src={homeData.typeforms.igniteUrl || import.meta.env.VITE_TYPEFORM_IGNITE_URL || ''}
                title="Ignite Your Flame Assessment"
                height={800}
                className={styles.typeformEmbed}
              />

              <div className={styles.typeformFooter}>
                <p className={styles.typeformFooterText}>
                  Take the assessment to begin your transformation journey. Your results will be 
                  delivered via email with personalized insights and recommendations.
                </p>
              </div>
            </div>
          </section>

          {/* Peak Energy Profiler Section */}
          <section 
            id="peak-energy-profiler" 
            className={`section ${styles.typeformSection}`}
          >
            <div className="container">
              <div className={styles.typeformHeader}>
                <h2 className={styles.typeformTitle}>Peak Energy Profiler</h2>
                <p className={styles.typeformDescription}>
                  Understand your energy patterns and optimize your performance. This assessment 
                  reveals your peak energy times, stress triggers, and the strategies that work 
                  best for your unique energy profile.
                </p>
              </div>

              <TypeformEmbed
                src={homeData.typeforms.peakUrl || import.meta.env.VITE_TYPEFORM_PEAK_URL || ''}
                title="Peak Energy Profiler Assessment"
                height={800}
                className={styles.typeformEmbed}
              />

              <div className={styles.typeformFooter}>
                <p className={styles.typeformFooterText}>
                  Complete the profiler to discover your energy blueprint and learn how to 
                  harness your natural rhythms for peak performance.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </motion.div>
  )
}

