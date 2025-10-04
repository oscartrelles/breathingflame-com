import { useAbout } from '@/hooks/useFirestore'
import { HeroSection } from '@/components/HeroSection'
import { SEO } from '@/components/SEO'
import { PillarsGrid } from '@/components/PillarsGrid'
import { FinalCTABand } from '@/components/FinalCTABand'
import { TestimonialComponent } from '@/components/TestimonialComponent'
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
import styles from './About.module.css'

export function About() {
  const { data: aboutData } = useAbout()
  const reducedMotion = useReducedMotion()

  if (!aboutData) {
    return (
      <div className="container">
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // JSON-LD Person schema for founder
  const founder = aboutData.sections?.founder
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": founder.name,
    "jobTitle": founder.title,
    "url": "https://breathingflame.com/about",
    "affiliation": {
      "@type": "Organization",
      "name": founder.affiliation?.name || "Breathing Flame"
    },
    "sameAs": (founder.socials || []).map((social: any) => social.url) || []
  }

  // JSON-LD Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": aboutData.organization?.name || "Breathing Flame",
    "url": "https://breathingflame.com",
    "description": aboutData.organization?.description || "Science-backed, nature-powered practices for resilience, clarity, and transformation",
    "sameAs": [
      "https://www.youtube.com/@BreathingFlameTV",
      "https://www.instagram.com/breathing.flame",
      "https://www.linkedin.com/company/breathingflame/",
      "https://www.tiktok.com/@breathingflame",
      import.meta.env.VITE_MEDIUM_URL || '',
      import.meta.env.VITE_SUBSTACK_URL || ''
    ].filter(Boolean)
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={reducedMotion ? {} : pageTransition}
    >
      <SEO 
        data={{
          title: aboutData.seo.title,
          description: aboutData.seo.description,
          image: aboutData.seo.ogImage,
          structuredData: [personSchema, organizationSchema]
        }}
        pageData={aboutData}
      />

      {/* Hero Section */}
      <HeroSection
        title={aboutData.sections.hero.headline}
        subtitle={aboutData.sections.hero.subtext}
        media={aboutData.sections.hero.media}
        ctas={aboutData.sections.hero.ctas?.map((cta: any) => ({
          label: cta.label,
          pathOrUrl: cta.url,
          external: cta.external
        }))}
        className="about-hero"
      />

      {/* Story Section */}
      {(aboutData?.sections?.story?.visible !== false) && (
      <motion.section 
        className={`section ${styles.story}`}
        {...useInViewAnimation()}
      >
        <div className="container">
          <div className={styles.storyContent}>
            <h2 className={styles.sectionTitle}>{aboutData.sections?.story?.title || aboutData.story.title}</h2>
            <div className={styles.storyBody}>
              {(aboutData.sections?.story?.body || aboutData.story.body).split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      )}

      {/* Founder Section */}
      {aboutData.sections?.founder?.visible !== false && (
      <motion.section 
        className={`section ${styles.founder}`}
        {...useInViewAnimation()}
      >
        <div className="container">
          <div className={styles.founderContent}>
            <div className={styles.founderInfo}>
              <h2 className={styles.sectionTitle}>Meet the Founder</h2>
              <div className={styles.founderDetails}>
                <div className={styles.founderText}>
                  <h3 className={styles.founderName}>{aboutData.sections.founder.name}</h3>
                  <p className={styles.founderTitle}>{aboutData.sections.founder.title}</p>
                  <div className={styles.founderBio}>
                    {aboutData.sections.founder.bio.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className={styles.credentials}>
                    <h4>Credentials</h4>
                    <ul>
                      {aboutData.sections.founder.credentials.map((credential: string, index: number) => (
                        <li key={index}>{credential}</li>
                      ))}
                    </ul>
                  </div>

                  {aboutData.sections.founder.socials && aboutData.sections.founder.socials.length > 0 && (
                    <div className={styles.socials}>
                      <h4>Connect</h4>
                      <div className={styles.socialLinks}>
                        {aboutData.sections.founder.socials.map((social: any, index: number) => (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                          >
                            {social.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {aboutData.sections.founder.headshot && (
                  <div className={styles.founderImage}>
                    <img 
                      src={aboutData.sections.founder.headshot} 
                      alt={aboutData.sections.founder.name}
                      className={styles.headshot}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      )}

      {/* Approach Section */}
      {(aboutData?.sections?.approach?.visible !== false) && (
      <PillarsGrid
        pillars={(aboutData.sections?.approach?.pillars || aboutData.approach?.pillars || []).map((pillar: any) => ({
          id: pillar.id,
          title: pillar.title,
          copy: pillar.copy,
          icon: pillar.title?.charAt(0),
          color: '#ffb332'
        })) || []}
        title={aboutData.sections?.approach?.title || 'Our Approach'}
        subtitle={aboutData.sections?.approach?.intro || aboutData.approach?.intro}
        reducedMotion={reducedMotion}
      />
      )}

      {/* Collaborators Section */}
      {(aboutData.sections?.collaborators?.visible !== false) && (aboutData.sections?.collaborators?.items || aboutData.collaborators) && ((aboutData.sections?.collaborators?.items || aboutData.collaborators).length > 0) && (
        <motion.section 
          className={`section ${styles.collaborators}`}
          {...useInViewAnimation()}
        >
          <div className="container">
            <div className={styles.collaboratorsContent}>
              <h2 className={styles.sectionTitle}>Our Collaborators</h2>
              <div className={styles.collaboratorsGrid}>
                {(aboutData.sections?.collaborators?.items || aboutData.collaborators).map((collaborator: any, index: number) => (
                  <div key={index} className={styles.collaborator}>
                    {collaborator.logoUrl && (
                      <img 
                        src={collaborator.logoUrl} 
                        alt={collaborator.name}
                        className={styles.collaboratorLogo}
                      />
                    )}
                    <h4 className={styles.collaboratorName}>{collaborator.name}</h4>
                    <p className={styles.collaboratorRole}>{collaborator.role}</p>
                    {collaborator.url && (
                      <a 
                        href={collaborator.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.collaboratorLink}
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Proof Section - Now using unified TestimonialComponent */}
      {(aboutData?.sections?.proof?.visible !== false) && (
        <motion.section 
          className="section"
          {...useInViewAnimation()}
        >
          <div className="container">
            <TestimonialComponent
              mode="proof"
              title={aboutData?.sections?.proof?.headline}
              subtext={aboutData?.sections?.proof?.subtext}
              showRating={true}
              showTags={false}
              showSource={false}
              showLanguage={false}
              maxTextLength={300}
              showReadMore={false}
              className={styles.proof}
            />
          </div>
        </motion.section>
      )}

      {/* Final CTA Section */}
      {(aboutData?.sections?.finalCTA?.visible !== false) && (
      <FinalCTABand
        headline={aboutData.finalCTA?.headline}
        subtext={aboutData.finalCTA?.subtext}
        buttons={aboutData.finalCTA?.buttons?.map(button => ({
          label: button.label,
          url: button.url,
          external: button.external || false
        }))}
        fallbackHeadline="Ready to Work Together?"
        fallbackSubtext="Let's discuss how we can help you achieve your goals."
        fallbackButtons={[
          { label: "Get Started", url: "/contact", external: false },
          { label: "Learn More", url: "/programs", external: false }
        ]}
      />
      )}
    </motion.div>
  )
}