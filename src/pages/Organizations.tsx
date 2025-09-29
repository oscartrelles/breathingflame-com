import { usePageOrganizations, useTestimonials, usePosts, useSolutions } from '@/hooks/useFirestore'
import { HeroSection } from '@/components/HeroSection'
import { SEO } from '@/components/SEO'
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
        videoId={pageData.hero.videoId}
        videoEmbed={pageData.hero.videoEmbed}
        imageUrl={pageData.hero.image}
        ctas={pageData.hero.ctas}
        className="organizations-hero"
      />

      {/* Business Drivers Section */}
      <section className="section">
        <div className="container">
          <motion.div 
            className={styles.businessDriversGrid}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {pageData.businessDrivers.map((driver, index) => (
              <motion.div 
                key={index}
                className={styles.driverCard}
                variants={reducedMotion ? {} : staggerChild}
                whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
              >
                <div className={styles.driverIcon}>
                  <div className={styles.driverIconInner}>
                    <span>{driver.title.charAt(0)}</span>
          </div>
            </div>

                <h3 className={styles.driverTitle}>{driver.title}</h3>
                <p className={styles.driverDescription}>{driver.copy}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions Section (from CMS solutions collection) */}
      <section className="section section--sm">
        <div className="container">
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
                <div className={styles.solutionEyebrow}>Solution</div>
                <h3 className={styles.solutionTitle}>{solution.title}</h3>
                <p className={styles.solutionDescription}>{solution.summary || solution.hero?.subtext}</p>
                
                <a 
                  href={`/solutions/${solution.slug}`} 
                  className="btn btn--outline"
                >
                  Learn more
                </a>
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

      {/* Resources Section */}
      <section className="section section--sm">
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            {...useInViewAnimation()}
          >
            <h2 className={styles.sectionTitle}>{pageData.resources.headline}</h2>
            <p className={styles.sectionDescription}>
              {pageData.resources.subtext}
            </p>
          </motion.div>

          <motion.div 
            className={styles.resourcesGrid}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Resource Links */}
            {pageData.resources.resourceLinks.map((resource, index) => (
              <motion.div 
                key={index}
                className={styles.resourceCard}
                variants={reducedMotion ? {} : staggerChild}
              >
                <h3 className={styles.resourceTitle}>{resource.label}</h3>
                <p className={styles.resourceDescription}>
                  Comprehensive guide for leaders and HR teams.
                </p>
                <a 
                  href={resource.pathOrUrl} 
                  className="btn btn--outline"
                  target={resource.external ? '_blank' : undefined}
                  rel={resource.external ? 'noopener noreferrer' : undefined}
                >
                  Download Guide
                </a>
              </motion.div>
            ))}

            {/* Featured Blog Post */}
            {featuredPost && (
              <motion.div 
                className={styles.resourceCard}
                variants={reducedMotion ? {} : staggerChild}
              >
                <h3 className={styles.resourceTitle}>Latest Article</h3>
                <p className={styles.resourceDescription}>
                  {featuredPost.excerpt}
                </p>
                <a href={`/blog/${featuredPost.slug}`} className="btn btn--outline">
                  Read Article
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Formats Section */}
      <section className="section section--sm">
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            {...useInViewAnimation()}
          >
            <h2 className={styles.sectionTitle}>Program Formats</h2>
            <p className={styles.sectionDescription}>
              Flexible delivery options to meet your organization's needs
            </p>
          </motion.div>

          <motion.div 
            className={styles.formatsList}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {pageData.formats.map((format, index) => (
              <motion.div 
                key={index}
                className={styles.formatItem}
                variants={reducedMotion ? {} : staggerChild}
              >
                <div className={styles.formatIcon}>
                  <span>✓</span>
              </div>
                <span className={styles.formatText}>{format}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.ctaBand}>
        <div className="container">
          <motion.div 
            className={styles.ctaContent}
            {...useInViewAnimation()}
          >
            <h2 className={styles.ctaTitle}>{pageData.finalCTA.headline}</h2>
            <p className={styles.ctaDescription}>
              {pageData.finalCTA.subtext}
            </p>
            
            <div className={`${styles.ctaButtons} cta-container`}>
              {pageData.finalCTA.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.pathOrUrl}
                  className={`btn ${index === 0 ? 'btn--primary' : 'btn--secondary'} btn--large`}
                  target={button.external ? '_blank' : undefined}
                  rel={button.external ? 'noopener noreferrer' : undefined}
                >
                  {button.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}