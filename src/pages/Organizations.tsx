import { usePageOrganizations, useTestimonials, usePosts, useSolutions } from '@/hooks/useFirestore'
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
    pageData?.results?.testimonialRefs?.includes(testimonial.id)
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
        className="organizations-hero"
      />

      {/* Business Drivers Section */}
      <PillarsGrid
        pillars={pageData.businessDrivers?.map((driver: any) => ({
          id: driver.id,
          title: driver.title,
          copy: driver.copy,
          icon: driver.title?.charAt(0),
          color: '#ffb332'
        })) || []}
        title="Why It Matters"
        subtitle="Real outcomes that impact your bottom line"
        reducedMotion={reducedMotion}
      />

      {/* Solutions Section (from CMS solutions collection) */}
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

      {/* Results Section */}
      {featuredTestimonials.length > 0 && (
      <section className="section section--sm">
        <div className="container">
            <motion.div 
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>{pageData.results.headline}</h2>
            <p className={styles.sectionDescription}>
                {pageData.results.subtext}
              </p>
            </motion.div>

            <motion.div 
              className={styles.testimonialsGrid}
              variants={reducedMotion ? {} : staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredTestimonials.map((testimonial) => (
                <motion.div 
                  key={testimonial.id}
                  className={styles.testimonialCard}
                  variants={reducedMotion ? {} : staggerChild}
                >
                  <div className={styles.testimonialContent}>
                    <p className={styles.testimonialText}>"{testimonial.text}"</p>
                    
                    <div className={styles.testimonialAuthor}>
                      {testimonial.author.avatar && (
                        <img 
                          src={testimonial.author.avatar} 
                          alt={testimonial.author.name}
                          className={styles.testimonialAvatar}
                        />
                      )}
                      <div className={styles.testimonialAuthorInfo}>
                        <h4 className={styles.testimonialAuthorName}>{testimonial.author.name}</h4>
                        <p className={styles.testimonialAuthorTitle}>{testimonial.author.title}</p>
                        {testimonial.author.company && (
                          <p className={styles.testimonialAuthorCompany}>{testimonial.author.company}</p>
                        )}
            </div>
              </div>
            </div>
                </motion.div>
              ))}
            </motion.div>
        </div>
      </section>
      )}

      {/* Testimonials */}
      <TestimonialsRail 
        testimonialRefs={pageData?.testimonials?.testimonialRefs}
        context={{ audience: 'organizations' }}
        title={pageData?.testimonials?.headline}
        subtext={pageData?.testimonials?.subtext}
        maxCount={6}
        minRating={4}
      />

      {/* Resources Section */}
      <ResourcesGrid
        resources={[
          // Resource Links
          ...(pageData.resources?.resourceLinks?.map((resource: any) => ({
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
        fallbackHeadline="Ready to Transform Your Organization?"
        fallbackSubtext="Empower your team with resilience and peak performance."
        fallbackButtons={[
          { label: "Get Started", url: "/contact", external: false },
          { label: "Learn More", url: "/organizations", external: false }
        ]}
      />
    </motion.div>
  )
}