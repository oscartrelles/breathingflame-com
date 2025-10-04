import { useHome, usePrograms, useExperiences, useSolutions } from '@/hooks/useFirestore'
import { HeroSection } from '@/components/HeroSection'
import { SEO } from '@/components/SEO'
import { TestimonialComponent } from '@/components/TestimonialComponent'
import { OfferingCard } from '@/components/OfferingCard'
import { PillarsGrid } from '@/components/PillarsGrid'

import { motion } from 'framer-motion'
import { 
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
  const { data: homeData, loading: homeLoading } = useHome()
  const { data: programs } = usePrograms()
  const { data: experiences } = useExperiences()
  const { data: solutions } = useSolutions()
  
  // Testimonials are now handled by TestimonialComponent
  
  const reducedMotion = useReducedMotion()

  // Show loading state if homeData is not yet loaded
  if (homeLoading || !homeData) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-16) 0', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // Source pillars strictly from pages.home.sections.pillars
  const pillars: any[] = Array.isArray(homeData?.sections?.pillars?.pillars) ? homeData!.sections.pillars.pillars : []

  // Get featured programs and experiences
  const featuredPrograms = programs?.filter(program => 
    homeData?.sections?.featured?.featuredPrograms?.includes(program.id)
  ) || []

  const featuredExperiences = experiences?.filter(experience => 
    homeData?.sections?.featured?.featuredExperiences?.includes(experience.id)
  ) || []

  // Get featured solutions for organizations section
  const featuredSolutions = solutions?.filter(solution => 
    solution.featured || solution.tags?.includes('Organizations')
  ).slice(0, 3) || []

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
          image: homeData?.seo?.ogImage,
          structuredData: [
            // WebSite schema with search action
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Breathing Flame',
              url: 'https://breathingflame.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://breathingflame.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            },
            // Organization schema
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Breathing Flame',
              url: 'https://breathingflame.com',
              logo: 'https://breathingflame.com/logo.png',
              description: 'Resilience. Clarity. Transformation.',
              sameAs: [
                'https://www.instagram.com/breathing.flame',
                'https://www.youtube.com/@BreathingFlameTV',
                'https://www.linkedin.com/company/breathingflame/',
                'https://www.tiktok.com/@breathingflame'
              ]
            },
            // Service schemas for featured programs
            ...featuredPrograms.map(program => ({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: program.title,
              description: program.summary || program.description,
              provider: {
                '@type': 'Organization',
                name: 'Breathing Flame'
              },
              url: `https://breathingflame.com/programs/${program.slug}`,
              ...(program.faq && program.faq.length > 0 && {
                mainEntity: program.faq.map((faq: any) => ({
                  '@type': 'Question',
                  name: faq.question || faq.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer || faq.a
                  }
                }))
              })
            })),
            // Service schemas for featured experiences
            ...featuredExperiences.map(experience => ({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: experience.title,
              description: experience.summary || experience.description,
              provider: {
                '@type': 'Organization',
                name: 'Breathing Flame'
              },
              url: `https://breathingflame.com/experiences/${experience.slug}`,
              ...(experience.faq && experience.faq.length > 0 && {
                mainEntity: experience.faq.map((faq: any) => ({
                  '@type': 'Question',
                  name: faq.question || faq.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer || faq.a
                  }
                }))
              })
            }))
          ]
        }}
      />

      {/* Hero Section */}
      {homeData?.sections?.hero?.visible !== false && homeData?.sections?.hero && (
        <HeroSection
          title={homeData?.sections?.hero?.headline}
          subtitle={homeData?.sections?.hero?.subtext}
          media={homeData?.sections?.hero?.media}
          ctas={homeData?.sections?.hero?.ctas}
          className="home-hero"
        />
      )}

      {/* Pillars Section - Staggered reveal like Positive Intelligence */}
      {homeData?.sections?.pillars?.visible !== false && homeData?.sections?.pillars && (
        <PillarsGrid
          pillars={pillars}
          title={homeData?.sections?.pillars?.headline || 'Resilience. Clarity. Transformation.'}
          subtitle={homeData?.sections?.pillars?.subtext || 'Three pillars that guide every program and experience we offer.'}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Featured Programs */}
      {(homeData?.sections?.featured?.visible !== false) && featuredPrograms.length > 0 && (
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
                  <OfferingCard 
                    offering={{
                      ...program,
                      kind: 'program' as const
                    }} 
                    pageData={null}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Experiences */}
      {(homeData?.sections?.featured?.visible !== false) && featuredExperiences.length > 0 && (
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
                  <OfferingCard 
                    offering={{
                      ...experience,
                      kind: 'experience' as const
                    }} 
                    pageData={null}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {homeData?.sections?.testimonials?.visible !== false && (
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{homeData?.sections?.testimonials?.headline}</h2>
            <p className={styles.sectionDescription}>{homeData?.sections?.testimonials?.subtext}</p>
          </div>

          {/* Home Page Testimonials */}
          <TestimonialComponent 
            mode="carousel" 
            showRating={true}
            showTags={false}
            showSource={false}
            maxCount={10}
          />
        </div>
      </section>
      )}

      {/* Solutions for Organizations */}
      {(homeData?.sections?.organizations?.visible !== false) && featuredSolutions.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{homeData?.sections?.organizations?.headline || 'Organizations'}</h2>
              <p className={styles.sectionDescription}>
                Build resilient teams and transformative cultures
              </p>
            </div>

            <div className={styles.solutionsGrid}>
              {featuredSolutions.map((solution) => (
                <div key={solution.id} className={styles.solutionCard}>
                  <OfferingCard 
                    offering={{
                      ...solution,
                      kind: 'solution' as const
                    }} 
                    pageData={null}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community CTA */}
      {(homeData?.sections?.community?.visible !== false) && homeData?.sections?.community?.ctas && homeData?.sections?.community?.ctas?.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{homeData?.sections?.community?.headline}</h2>
            </div>
            <div className={styles.communityCTAs}>
              {homeData?.sections?.community?.ctas?.map((cta: any, index: number) => (
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

