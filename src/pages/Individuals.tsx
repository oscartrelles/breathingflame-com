import { useSettings } from '@/hooks/useFirestore'
import { SEO } from '@/components/SEO'
import styles from './Individuals.module.css'

/**
 * Individuals Page - B2C focused content
 * 
 * Features:
 * - Hero section for individuals
 * - Pillars (B2C messaging)
 * - Programs and experiences
 * - Testimonials
 * - Resources and community
 * - CTA band
 */
export function Individuals() {
  const { data: settings } = useSettings()

  return (
    <>
      <SEO 
        data={{
          title: 'For Individuals - Breathing Flame',
          description: 'Perform at your best. Live with clarity. Transform your life through breathwork, mindfulness, and transformative experiences.',
          image: '/og-individuals.jpg'
        }}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Transform Your Life
            </h1>
            
            <p className={styles.heroSubtitle}>
              Perform at your best. Live with clarity. Transform your life.
            </p>
            
            <p className={styles.heroDescription}>
              Discover the power of breathwork, mindfulness, and transformative experiences 
              that help you build resilience, gain clarity, and create lasting positive change 
              in your personal and professional life.
            </p>

            <div className={styles.heroCTA}>
              <a href="/contact" className="btn btn--primary btn--large">
                Start Your Journey
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Transformation Journey</h2>
            <p className={styles.sectionDescription}>
              Three pillars that form the foundation of your personal growth
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <div className={styles.pillarIconInner}>
                  <span>R</span>
                </div>
              </div>
              
              <h3 className={styles.pillarTitle}>Resilience</h3>
              <p className={styles.pillarDescription}>
                Build unshakeable mental and emotional strength through breathwork 
                and mindfulness practices that help you navigate life's challenges 
                with grace and determination.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <div className={styles.pillarIconInner}>
                  <span>C</span>
                </div>
              </div>
              
              <h3 className={styles.pillarTitle}>Clarity</h3>
              <p className={styles.pillarDescription}>
                Cut through mental fog and emotional noise to gain crystal-clear 
                insight into your values, goals, and the path forward. Discover 
                what truly matters to you.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <div className={styles.pillarIconInner}>
                  <span>T</span>
                </div>
              </div>
              
              <h3 className={styles.pillarTitle}>Transformation</h3>
              <p className={styles.pillarDescription}>
                Experience profound personal change that goes beyond surface-level 
                improvements. Create lasting shifts in how you think, feel, and 
                show up in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Signature Programs</h2>
            <p className={styles.sectionDescription}>
              Comprehensive programs designed to accelerate your personal transformation
            </p>
          </div>

          <div className={styles.programsGrid}>
            <div className={styles.programCard}>
              <div className={styles.programImage}>
                <img src="/programs/reverse-aging-challenge.jpg" alt="Reverse Aging Challenge" />
              </div>
              
              <div className={styles.programContent}>
                <h3 className={styles.programTitle}>Reverse Aging Challenge</h3>
                <p className={styles.programSubtitle}>10-Week Transformation</p>
                <p className={styles.programDescription}>
                  Turn back the clock on aging through breathwork, cold therapy, 
                  and mindfulness practices that activate your body's natural 
                  healing and rejuvenation systems.
                </p>
                
                <div className={styles.programMeta}>
                  <span className={styles.programDuration}>10 Weeks</span>
                  <span className={styles.programFormat}>Online + In-Person</span>
                </div>

                <a href="/programs/reverse-aging-challenge" className="btn btn--secondary">
                  Learn More
                </a>
              </div>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programImage}>
                <img src="/programs/unblocked.jpg" alt="Unblocked in 10 Weeks" />
              </div>
              
              <div className={styles.programContent}>
                <h3 className={styles.programTitle}>Unblocked in 10 Weeks</h3>
                <p className={styles.programSubtitle}>Break Through Barriers</p>
                <p className={styles.programDescription}>
                  Identify and overcome the mental, emotional, and energetic 
                  blocks that are holding you back from living your fullest life.
                </p>
                
                <div className={styles.programMeta}>
                  <span className={styles.programDuration}>10 Weeks</span>
                  <span className={styles.programFormat}>Online</span>
                </div>

                <a href="/programs/unblocked-in-ten-weeks" className="btn btn--secondary">
                  Learn More
                </a>
              </div>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programImage}>
                <img src="/programs/unstoppable.jpg" alt="Unstoppable" />
              </div>
              
              <div className={styles.programContent}>
                <h3 className={styles.programTitle}>Unstoppable</h3>
                <p className={styles.programSubtitle}>Peak Performance</p>
                <p className={styles.programDescription}>
                  Achieve unstoppable momentum in all areas of your life through 
                  advanced breathwork techniques and peak performance strategies.
                </p>
                
                <div className={styles.programMeta}>
                  <span className={styles.programDuration}>12 Weeks</span>
                  <span className={styles.programFormat}>Hybrid</span>
                </div>

                <a href="/programs/unstoppable" className="btn btn--secondary">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Transformative Experiences</h2>
            <p className={styles.sectionDescription}>
              Deep dive into powerful breathwork and mindfulness practices
            </p>
          </div>

          <div className={styles.experiencesGrid}>
            <div className={styles.experienceCard}>
              <div className={styles.experienceImage}>
                <img src="/experiences/wim-hof.jpg" alt="Wim Hof Method" />
              </div>
              
              <div className={styles.experienceContent}>
                <h3 className={styles.experienceTitle}>Wim Hof Method</h3>
                <p className={styles.experienceSubtitle}>Cold & Breathwork</p>
                <p className={styles.experienceDescription}>
                  Master the powerful combination of cold exposure and breathing 
                  techniques that boost immunity, reduce stress, and increase energy.
                </p>
                
                <div className={styles.experienceMeta}>
                  <span className={styles.experienceDuration}>2-4 Hours</span>
                  <span className={styles.experienceFormat}>In-Person</span>
                </div>

                <a href="/experiences/wim-hof-method" className="btn btn--secondary">
                  Experience Now
                </a>
              </div>
            </div>

            <div className={styles.experienceCard}>
              <div className={styles.experienceImage}>
                <img src="/experiences/9d-breathwork.jpg" alt="9D Breathwork" />
              </div>
              
              <div className={styles.experienceContent}>
                <h3 className={styles.experienceTitle}>9D Breathwork</h3>
                <p className={styles.experienceSubtitle}>Deep Healing</p>
                <p className={styles.experienceDescription}>
                  Experience profound healing and transformation through this 
                  powerful breathwork practice that combines music, guidance, 
                  and deep breathing.
                </p>
                
                <div className={styles.experienceMeta}>
                  <span className={styles.experienceDuration}>90 Minutes</span>
                  <span className={styles.experienceFormat}>In-Person</span>
                </div>

                <a href="/experiences/9d-breathwork" className="btn btn--secondary">
                  Experience Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Community */}
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Resources & Community</h2>
            <p className={styles.sectionDescription}>
              Continue your journey with our resources and connect with like-minded individuals
            </p>
          </div>

          <div className={styles.resourcesGrid}>
            <div className={styles.resourceCard}>
              <h3 className={styles.resourceTitle}>Blog & Articles</h3>
              <p className={styles.resourceDescription}>
                Deep dive into breathwork, mindfulness, and transformation topics 
                with our comprehensive guides and insights.
              </p>
              <a href="/resources" className="btn btn--outline">
                Explore Articles
              </a>
            </div>

            <div className={styles.resourceCard}>
              <h3 className={styles.resourceTitle}>Community</h3>
              <p className={styles.resourceDescription}>
                Join our supportive community of individuals on their transformation 
                journey. Share experiences and learn from others.
              </p>
              <a href="/events" className="btn btn--outline">
                Join Events
              </a>
            </div>

            <div className={styles.resourceCard}>
              <h3 className={styles.resourceTitle}>Free Resources</h3>
              <p className={styles.resourceDescription}>
                Access free breathing exercises, meditation guides, and assessment 
                tools to start your transformation today.
              </p>
              <a href="/#ignite-your-flame" className="btn btn--outline">
                Take Assessment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className={styles.ctaBand}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Transform Your Life?</h2>
            <p className={styles.ctaDescription}>
              Take the first step on your transformation journey. Book a consultation 
              to discover which program or experience is right for you.
            </p>
            
            <div className={styles.ctaButtons}>
              <a href="/contact" className="btn btn--primary btn--large">
                Book Consultation
              </a>
              <a href="/#peak-energy-profiler" className="btn btn--secondary btn--large">
                Take Assessment
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

