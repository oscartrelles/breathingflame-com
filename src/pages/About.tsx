import { useAbout } from '@/hooks/useFirestore'
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
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": aboutData.founder.name,
    "jobTitle": aboutData.founder.title,
    "url": "https://breathingflame.com/about",
    "affiliation": {
      "@type": "Organization",
      "name": "Breathing Flame"
    },
    "sameAs": aboutData.founder.socials?.map(social => social.url) || []
  }

  // JSON-LD Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Breathing Flame",
    "url": "https://breathingflame.com",
    "description": "Science-backed, nature-powered practices for resilience, clarity, and transformation",
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
      />

      {/* Hero Section */}
      <HeroSection
        title={aboutData.hero.headline}
        subtitle={aboutData.hero.subtext}
        videoId={aboutData.hero.videoId}
        videoEmbed={aboutData.hero.videoEmbed}
        imageUrl={aboutData.hero.image}
        ctas={aboutData.hero.ctas?.map(cta => ({
          label: cta.label,
          pathOrUrl: cta.url,
          external: cta.external
        }))}
        className="about-hero"
      />

      {/* Story Section */}
      <motion.section 
        className={`section ${styles.story}`}
        {...useInViewAnimation()}
      >
        <div className="container">
          <div className={styles.storyContent}>
            <h2 className={styles.sectionTitle}>{aboutData.story.title}</h2>
            <div className={styles.storyBody}>
              {aboutData.story.body.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Founder Section */}
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
                  <h3 className={styles.founderName}>{aboutData.founder.name}</h3>
                  <p className={styles.founderTitle}>{aboutData.founder.title}</p>
                  <div className={styles.founderBio}>
                    {aboutData.founder.bio.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className={styles.credentials}>
                    <h4>Credentials</h4>
                    <ul>
                      {aboutData.founder.credentials.map((credential, index) => (
                        <li key={index}>{credential}</li>
                      ))}
                    </ul>
                  </div>

                  {aboutData.founder.socials && aboutData.founder.socials.length > 0 && (
                    <div className={styles.socials}>
                      <h4>Connect</h4>
                      <div className={styles.socialLinks}>
                        {aboutData.founder.socials.map((social, index) => (
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
                
                {aboutData.founder.headshot && (
                  <div className={styles.founderImage}>
                    <img 
                      src={aboutData.founder.headshot} 
                      alt={aboutData.founder.name}
                      className={styles.headshot}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Approach Section */}
      <motion.section 
        className={`section ${styles.approach}`}
        {...useInViewAnimation()}
      >
        <div className="container">
          <div className={styles.approachContent}>
            <h2 className={styles.sectionTitle}>Our Approach</h2>
            <p className={styles.approachIntro}>{aboutData.approach.intro}</p>
            
            <div className={styles.pillars}>
              {aboutData.approach.pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  className={styles.pillar}
                  variants={reducedMotion ? {} : staggerChild}
                >
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarCopy}>{pillar.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Collaborators Section */}
      {aboutData.collaborators && aboutData.collaborators.length > 0 && (
        <motion.section 
          className={`section ${styles.collaborators}`}
          {...useInViewAnimation()}
        >
          <div className="container">
            <div className={styles.collaboratorsContent}>
              <h2 className={styles.sectionTitle}>Our Collaborators</h2>
              <div className={styles.collaboratorsGrid}>
                {aboutData.collaborators.map((collaborator, index) => (
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

      {/* Proof Section */}
      {aboutData.proof && (aboutData.proof.ratingText || (aboutData.proof.logos && aboutData.proof.logos.length > 0)) && (
        <motion.section 
          className={`section ${styles.proof}`}
          {...useInViewAnimation()}
        >
          <div className="container">
            <div className={styles.proofContent}>
              {aboutData.proof.ratingText && (
                <div className={styles.rating}>
                  <p className={styles.ratingText}>{aboutData.proof.ratingText}</p>
                </div>
              )}
              
              {aboutData.proof.logos && aboutData.proof.logos.length > 0 && (
                <div className={styles.logos}>
                  <h3>Trusted by</h3>
                  <div className={styles.logosGrid}>
                    {aboutData.proof.logos.map((logoUrl, index) => (
                      <img 
                        key={index}
                        src={logoUrl} 
                        alt="Client logo"
                        className={styles.logo}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Final CTA Section */}
      <motion.section 
        className={`section ${styles.finalCTA}`}
        {...useInViewAnimation()}
      >
        <div className="container">
          <div className={styles.finalCTAContent}>
            <h2 className={styles.finalCTAHeadline}>{aboutData.finalCTA.headline}</h2>
            {aboutData.finalCTA.subtext && (
              <p className={styles.finalCTASubtext}>{aboutData.finalCTA.subtext}</p>
            )}
            <div className={styles.finalCTAButtons}>
              {aboutData.finalCTA.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.url}
                  className={`btn ${button.external ? 'btn--secondary' : 'btn--primary'}`}
                  target={button.external ? '_blank' : undefined}
                  rel={button.external ? 'noopener noreferrer' : undefined}
                >
                  {button.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}