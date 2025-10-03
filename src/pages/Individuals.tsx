import { usePageIndividuals, usePrograms, useExperiences, usePosts } from '@/hooks/useFirestore'
import { HeroSection } from '@/components/HeroSection'
import { TestimonialsRail } from '@/components/TestimonialsRail'
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
    pageData?.programs?.programRefs?.includes(program.id)
  ) || []

  // Get referenced experiences
  const featuredExperiences = experiences?.filter(experience => 
    pageData?.experiences?.experienceRefs?.includes(experience.id)
  ) || []


  // Get featured blog post
  const featuredPost = posts?.find(post => 
    post.id === pageData?.resources?.featuredPostRef
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
      <HeroSection
        title={pageData.hero.headline}
        subtitle={pageData.hero.subtext}
        media={pageData.hero.media ?? {
          imageUrl: pageData.hero.imageUrl,
          videoEmbed: pageData.hero.videoEmbed,
          videoId: pageData.hero.videoId,
        }}
        ctas={pageData.hero.ctas}
        className="individuals-hero"
      />

      {/* Intro Blocks Section */}
      <PillarsGrid
        pillars={pageData.introBlocks?.map((block: any) => ({
          id: block.id,
          title: block.title,
          copy: block.copy,
          icon: block.title?.charAt(0),
          color: '#ffb332'
        })) || []}
        title="Our Approach"
        subtitle="Three pillars that guide everything we do"
        reducedMotion={reducedMotion}
      />

      {/* Programs Section */}
      {featuredPrograms.length > 0 && (
      <section className="section section--sm">
        <div className="container">
            <motion.div 
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>{pageData.programs.headline}</h2>
            <p className={styles.sectionDescription}>
                {pageData.programs.subtext}
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
      {featuredExperiences.length > 0 && (
      <section className="section section--sm">
        <div className="container">
            <motion.div 
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>{pageData.experiences.headline}</h2>
            <p className={styles.sectionDescription}>
                {pageData.experiences.subtext}
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
      <TestimonialsRail 
        testimonialRefs={pageData?.testimonials?.testimonialRefs}
        context={{ audience: 'individuals' }}
        title={pageData?.testimonials?.headline}
        subtext={pageData?.testimonials?.subtext}
        maxCount={6}
        minRating={4}
      />

      {/* Resources Section */}
      <ResourcesGrid
        resources={[
          // Assessment Links
          ...(pageData.resources?.resourceLinks?.map((resource: any) => ({
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
        title={pageData.resources?.headline}
        subtitle={pageData.resources?.subtext}
        reducedMotion={reducedMotion}
      />

      {/* Final CTA Section */}
      <FinalCTABand
        headline={pageData.finalCTA?.headline}
        subtext={pageData.finalCTA?.subtext}
        buttons={pageData.finalCTA?.buttons?.map(button => ({
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
    </motion.div>
  )
}