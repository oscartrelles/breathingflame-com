import { usePageIndividuals, usePrograms, useExperiences, usePosts } from '@/hooks/useFirestore'
import { HeroSection } from '@/components/HeroSection'
import { TestimonialComponent } from '@/components/TestimonialComponent'
import { SEO } from '@/components/SEO'
import { OfferingCard } from '@/components/OfferingCard'
import { PillarsGrid } from '@/components/PillarsGrid'
import { ResourcesGrid } from '@/components/ResourcesGrid'
import { FinalCTABand } from '@/components/FinalCTABand'
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
import styles from './Individuals.module.css'

/**
 * Individuals Page - B2C focused content
 * 
 * Features:
 * - Hero section with dual CTAs
 * - Intro blocks (Resilience, Clarity, Transformation)
 * - Programs section with CMS refs
 * - Experiences section with CMS refs
 * - Testimonials section with CMS refs
 * - Resources section with assessments and blog
 * - Final CTA with dual buttons
 */
export function Individuals() {
  const { data: pageData } = usePageIndividuals()
  const { data: programs } = usePrograms()
  const { data: experiences } = useExperiences()
  const { data: posts } = usePosts()
  const reducedMotion = useReducedMotion()

  // Get referenced programs
  const featuredPrograms = programs?.filter(program => 
    pageData?.sections?.programs?.programRefs?.includes(program.id)
  ) || []

  // Get referenced experiences
  const featuredExperiences = experiences?.filter(experience => 
    pageData?.sections?.experiences?.experienceRefs?.includes(experience.id)
  ) || []


  // Get featured blog post
  const featuredPost = posts?.find(post => 
    post.id === pageData?.sections?.resources?.featuredPostRef
  )

  if (!pageData) {
    return (
      <div className="container">
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={reducedMotion ? {} : pageTransition}
    >
      <SEO 
        data={{
          title: pageData.seo.title,
          description: pageData.seo.description,
          image: pageData.seo.ogImage
        }}
        pageData={pageData}
      />

      {/* Hero Section */}
      {pageData.sections?.hero?.visible !== false && (
        <HeroSection
          title={pageData.sections.hero.headline}
          subtitle={pageData.sections.hero.subtext}
          media={pageData.sections.hero.media}
          ctas={pageData.sections.hero.ctas}
          className="individuals-hero"
        />
      )}

      {/* Pillars Section */}
      {pageData.sections?.pillars?.visible !== false && (
      <PillarsGrid
        pillars={
          (pageData.sections.pillars.pillars as any[]).map((p: any) => ({
            id: p.title?.toLowerCase() || '',
            title: p.title,
            copy: p.copy,
            icon: p.title?.charAt(0),
            color: '#ffb332'
          }))
        }
        title={pageData.sections.pillars.headline}
        subtitle={pageData.sections.pillars.subtext}
        reducedMotion={reducedMotion}
      />
      )}

      {/* Programs Section */}
      {(pageData.sections?.programs?.visible !== false) && featuredPrograms.length > 0 && (
      <section className="section section--sm">
        <div className="container">
            <motion.div 
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>{pageData.sections.programs.headline}</h2>
            <p className={styles.sectionDescription}>
                {pageData.sections.programs.subtext}
              </p>
            </motion.div>

            <motion.div 
              className={styles.programsGrid}
              variants={reducedMotion ? {} : staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredPrograms.map((program) => (
                <motion.div 
                  key={program.id}
                  className={styles.programCard}
                  variants={reducedMotion ? {} : staggerChild}
                >
                  <OfferingCard 
                    offering={{
                      ...program,
                      kind: 'program' as const
                    }} 
                    pageData={pageData}
                  />
                </motion.div>
              ))}
            </motion.div>
        </div>
      </section>
      )}

      {/* Experiences Section */}
      {(pageData.sections?.experiences?.visible !== false) && featuredExperiences.length > 0 && (
      <section className="section section--sm">
        <div className="container">
            <motion.div 
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>{pageData.sections.experiences.headline}</h2>
            <p className={styles.sectionDescription}>
                {pageData.sections.experiences.subtext}
              </p>
            </motion.div>

            <motion.div 
              className={styles.experiencesGrid}
              variants={reducedMotion ? {} : staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredExperiences.map((experience) => (
                <motion.div 
                  key={experience.id}
                  className={styles.experienceCard}
                  variants={reducedMotion ? {} : staggerChild}
                >
                  <OfferingCard 
                    offering={{
                      ...experience,
                      kind: 'experience' as const
                    }} 
                    pageData={pageData}
                  />
                </motion.div>
              ))}
            </motion.div>
            </div>
        </section>
      )}

      {/* Testimonials */}
      {(pageData.sections?.testimonials?.visible !== false) && (
      <TestimonialComponent 
        mode="grid"
        testimonialRefs={pageData.sections.testimonials.testimonialRefs}
        context={{ audience: 'individuals' }}
        title={pageData.sections.testimonials.headline}
        subtext={pageData.sections.testimonials.subtext}
        maxCount={6}
        minRating={4}
      />
      )}

      {/* Resources Section */}
      {(pageData.sections?.resources?.visible !== false) && (
      <ResourcesGrid
        resources={[
          // Assessment Links
          ...(pageData.sections.resources.resourceLinks?.map((resource: any) => ({
            id: resource.id,
            title: resource.label,
            description: 'Free assessment to help you understand your current state and next steps.',
            ctaText: 'Take Assessment',
            ctaHref: resource.pathOrUrl,
            external: resource.external,
            type: 'assessment' as const
          })) || []),
          // Featured Blog Post
          ...(featuredPost ? [{
            id: 'featured-post',
            title: 'Latest Article',
            description: featuredPost.excerpt,
            ctaText: 'Read Article',
            ctaHref: `/blog/${featuredPost.slug}`,
            external: false,
            type: 'article' as const
          }] : [])
        ]}
        title={pageData.sections.resources.headline}
        subtitle={pageData.sections.resources.subtext}
        reducedMotion={reducedMotion}
      />
      )}

      {/* Final CTA Section */}
      {(pageData.sections?.finalCTA?.visible !== false) && (
      <FinalCTABand
        headline={pageData.sections.finalCTA.headline}
        subtext={pageData.sections.finalCTA.subtext}
        buttons={pageData.sections.finalCTA.buttons?.map(button => ({
          label: button.label,
          url: button.pathOrUrl,
          external: button.external || false
        }))}
        fallbackHeadline="Ready to Transform Your Life?"
        fallbackSubtext="Start your journey to greater energy, resilience, and vitality."
        fallbackButtons={[
          { label: "Get Started", url: "/programs", external: false },
          { label: "Learn More", url: "/about", external: false }
        ]}
      />
      )}
    </motion.div>
  )
}