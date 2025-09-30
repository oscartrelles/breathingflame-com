import { usePageIndividuals, usePrograms, useExperiences, useTestimonials, usePosts } from '@/hooks/useFirestore'
import { HeroSection } from '@/components/HeroSection'
import { TestimonialsRail } from '@/components/TestimonialsRail'
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
  const { data: testimonials } = useTestimonials()
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

  // Get referenced testimonials
  const featuredTestimonials = testimonials?.filter(testimonial => 
    pageData?.testimonials?.testimonialRefs?.includes(testimonial.id)
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
        className="individuals-hero"
      />

      {/* Intro Blocks Section */}
      <section className="section">
        <div className="container">
          <motion.div 
            className={styles.pillarsGrid}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {pageData.introBlocks.map((block, index) => (
              <motion.div 
                key={index}
                className={styles.pillarCard}
                variants={reducedMotion ? {} : staggerChild}
                whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
              >
              <div className={styles.pillarIcon}>
                <div className={styles.pillarIconInner}>
                    <span>{block.title.charAt(0)}</span>
                </div>
              </div>
              
                <h3 className={styles.pillarTitle}>{block.title}</h3>
                <p className={styles.pillarDescription}>{block.copy}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
              
                    <a href={program.ctaHref} className="btn btn--secondary">
                      {program.ctaText}
                </a>
              </div>
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

                    <a href={experience.ctaHref} className="btn btn--secondary">
                      {experience.ctaText}
                </a>
              </div>
                </motion.div>
              ))}
            </motion.div>
            </div>
        </section>
      )}

      {/* Testimonials Section */}
      {featuredTestimonials.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <motion.div 
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>{pageData.testimonials.headline}</h2>
              <p className={styles.sectionDescription}>
                {pageData.testimonials.subtext}
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
            {/* Assessment Links */}
            {pageData.resources.resourceLinks.map((resource, index) => (
              <motion.div 
                key={index}
                className={styles.resourceCard}
                variants={reducedMotion ? {} : staggerChild}
              >
                <h3 className={styles.resourceTitle}>{resource.label}</h3>
              <p className={styles.resourceDescription}>
                  Free assessment to help you understand your current state and next steps.
                </p>
                <a 
                  href={resource.pathOrUrl} 
                  className="btn btn--outline"
                  target={resource.external ? '_blank' : undefined}
                  rel={resource.external ? 'noopener noreferrer' : undefined}
                >
                  Take Assessment
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

      {/* Testimonials */}
      <TestimonialsRail 
        context={{ audience: 'individuals' }}
        title={pageData?.sections?.testimonials?.title}
        subtext={pageData?.sections?.testimonials?.subtext}
        maxCount={6}
        minRating={4}
      />
    </motion.div>
  )
}