import { usePageOrganizations, useTestimonials, usePosts, useSolutions } from '@/hooks/useFirestore'
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
import styles from './Organizations.module.css'

/**
 * Organizations Page - B2B focused content
 * 
 * Features:
 * - Hero section with dual CTAs
 * - Business drivers (Performance, Resilience, Wellbeing)
 * - Solutions grid with 4 key offerings
 * - Results section with testimonials
 * - Resources section with whitepaper and blog
 * - Formats list
 * - Final CTA with dual buttons
 */
export function Organizations() {
  const { data: pageData } = usePageOrganizations()
  const { data: testimonials } = useTestimonials()
  const { data: posts } = usePosts()
  const { data: solutions } = useSolutions()
  const reducedMotion = useReducedMotion()

  // Get referenced testimonials
  const featuredTestimonials = testimonials?.filter(testimonial => 
    pageData?.sections?.testimonials?.testimonialRefs?.includes(testimonial.id)
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
          className="organizations-hero"
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
      />)}

      {/* Solutions Section */}
      {(pageData.sections?.solutions?.visible !== false) && (
      <section className="section section--sm">
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            {...useInViewAnimation()}
          >
            <h2 className={styles.sectionTitle}>Our Solutions</h2>
            <p className={styles.sectionDescription}>
              Proven programs designed to build resilience, clarity, and performance
            </p>
          </motion.div>

          <motion.div 
            className={styles.solutionsGrid}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[...solutions].sort((a,b) => (a.order||999)-(b.order||999) || a.title.localeCompare(b.title)).map((solution, index) => (
              <motion.div 
                key={index}
                className={styles.solutionCard}
                variants={reducedMotion ? {} : staggerChild}
                whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
              >
                <OfferingCard 
                  offering={{
                    ...solution,
                    kind: 'solution' as const,
                    ctaText: 'Learn More',
                    ctaHref: `/solutions/${solution.slug}`
                  }} 
                  pageData={pageData}
                  customEyebrow="Solution"
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
        context={{ audience: 'organizations' }}
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
          // Resource Links
          ...(pageData.sections.resources.resourceLinks?.map((resource: any) => ({
            id: resource.id,
            title: resource.label,
            description: 'Comprehensive guide for leaders and HR teams.',
            ctaText: 'Download Guide',
            ctaHref: resource.pathOrUrl,
            external: resource.external,
            type: 'guide' as const
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
        fallbackHeadline="Ready to Transform Your Organization?"
        fallbackSubtext="Empower your team with resilience and peak performance."
        fallbackButtons={[
          { label: "Get Started", url: "/contact", external: false },
          { label: "Learn More", url: "/organizations", external: false }
        ]}
      />
      )}
    </motion.div>
  )
}