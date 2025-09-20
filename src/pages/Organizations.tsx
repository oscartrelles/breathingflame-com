import { useSettings } from '@/hooks/useFirestore'
import { SEO } from '@/components/SEO'
import styles from './Organizations.module.css'

/**
 * Organizations Page - B2B focused content
 * 
 * Features:
 * - Hero section for organizations
 * - Business drivers and challenges
 * - Solutions grid
 * - Case studies and testimonials
 * - Resources (whitepaper)
 * - Formats and pricing
 * - CTA band
 */
export function Organizations() {
  const { data: settings } = useSettings()

  return (
    <>
      <SEO 
        data={{
          title: 'For Organizations - Breathing Flame',
          description: 'Resilient teams. Clear leaders. Transformative cultures. Build high-performance organizations through breathwork and mindfulness.',
          image: '/og-organizations.jpg'
        }}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Transform Your Organization
            </h1>
            
            <p className={styles.heroSubtitle}>
              Resilient teams. Clear leaders. Transformative cultures.
            </p>
            
            <p className={styles.heroDescription}>
              Build high-performance organizations through breathwork, mindfulness, 
              and transformative leadership practices. Create resilient teams that 
              thrive under pressure and lead with clarity and purpose.
            </p>

            <div className={styles.heroCTA}>
              <a href="/contact" className="btn btn--primary btn--large">
                Schedule Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Business Drivers Section */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The Challenges You Face</h2>
            <p className={styles.sectionDescription}>
              Modern organizations struggle with these critical issues
            </p>
          </div>

          <div className={styles.challengesGrid}>
            <div className={styles.challengeCard}>
              <h3 className={styles.challengeTitle}>Burnout & Stress</h3>
              <p className={styles.challengeDescription}>
                Teams overwhelmed by constant pressure, leading to decreased 
                productivity, higher turnover, and declining mental health.
              </p>
            </div>

            <div className={styles.challengeCard}>
              <h3 className={styles.challengeTitle}>Poor Decision Making</h3>
              <p className={styles.challengeDescription}>
                Leaders making reactive decisions under stress, lacking clarity 
                and strategic thinking when it matters most.
              </p>
            </div>

            <div className={styles.challengeCard}>
              <h3 className={styles.challengeTitle}>Toxic Culture</h3>
              <p className={styles.challengeDescription}>
                Environments characterized by fear, competition, and lack of 
                psychological safety, hindering innovation and collaboration.
              </p>
            </div>

            <div className={styles.challengeCard}>
              <h3 className={styles.challengeTitle}>Low Engagement</h3>
              <p className={styles.challengeDescription}>
                Disconnected employees who lack purpose and motivation, 
                resulting in poor performance and retention issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Solutions</h2>
            <p className={styles.sectionDescription}>
              Evidence-based programs that transform organizational culture and performance
            </p>
          </div>

          <div className={styles.solutionsGrid}>
            <div className={styles.solutionCard}>
              <div className={styles.solutionIcon}>
                <div className={styles.solutionIconInner}>
                  <span>R</span>
                </div>
              </div>
              
              <h3 className={styles.solutionTitle}>Resilient Teams</h3>
              <p className={styles.solutionDescription}>
                Build teams that bounce back from setbacks, maintain high performance 
                under pressure, and support each other through challenges.
              </p>
              
              <ul className={styles.solutionBenefits}>
                <li>Stress reduction techniques</li>
                <li>Emotional regulation skills</li>
                <li>Peer support systems</li>
                <li>Recovery protocols</li>
              </ul>
            </div>

            <div className={styles.solutionCard}>
              <div className={styles.solutionIcon}>
                <div className={styles.solutionIconInner}>
                  <span>C</span>
                </div>
              </div>
              
              <h3 className={styles.solutionTitle}>Clear Leaders</h3>
              <p className={styles.solutionDescription}>
                Develop leaders who make decisions with clarity, communicate 
                effectively, and inspire their teams to achieve extraordinary results.
              </p>
              
              <ul className={styles.solutionBenefits}>
                <li>Mindful decision making</li>
                <li>Present-moment awareness</li>
                <li>Authentic communication</li>
                <li>Strategic thinking</li>
              </ul>
            </div>

            <div className={styles.solutionCard}>
              <div className={styles.solutionIcon}>
                <div className={styles.solutionIconInner}>
                  <span>T</span>
                </div>
              </div>
              
              <h3 className={styles.solutionTitle}>Transformative Cultures</h3>
              <p className={styles.solutionDescription}>
                Create cultures of psychological safety, innovation, and continuous 
                growth where people thrive and organizations flourish.
              </p>
              
              <ul className={styles.solutionBenefits}>
                <li>Psychological safety</li>
                <li>Innovation mindset</li>
                <li>Growth orientation</li>
                <li>Purpose alignment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Proven Results</h2>
            <p className={styles.sectionDescription}>
              Real organizations achieving measurable transformation
            </p>
          </div>

          <div className={styles.caseStudiesGrid}>
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyHeader}>
                <h3 className={styles.caseStudyTitle}>Tech Startup</h3>
                <p className={styles.caseStudyIndustry}>Technology</p>
              </div>
              
              <div className={styles.caseStudyChallenge}>
                <h4>Challenge</h4>
                <p>High-pressure environment leading to 40% turnover and burnout crisis.</p>
              </div>
              
              <div className={styles.caseStudySolution}>
                <h4>Solution</h4>
                <p>6-month resilience program with breathwork and mindfulness training.</p>
              </div>
              
              <div className={styles.caseStudyResults}>
                <h4>Results</h4>
                <ul>
                  <li>60% reduction in turnover</li>
                  <li>35% increase in productivity</li>
                  <li>90% employee satisfaction score</li>
                </ul>
              </div>
              
              <blockquote className={styles.caseStudyQuote}>
                "The transformation in our team's resilience and performance has been 
                remarkable. We're now a stronger, more focused organization."
              </blockquote>
              
              <cite className={styles.caseStudyAttribution}>
                — Sarah Chen, CEO
              </cite>
            </div>

            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyHeader}>
                <h3 className={styles.caseStudyTitle}>Financial Services</h3>
                <p className={styles.caseStudyIndustry}>Finance</p>
              </div>
              
              <div className={styles.caseStudyChallenge}>
                <h4>Challenge</h4>
                <p>Leadership team struggling with decision fatigue and poor communication.</p>
              </div>
              
              <div className={styles.caseStudySolution}>
                <h4>Solution</h4>
                <p>Executive leadership program focused on clarity and mindful leadership.</p>
              </div>
              
              <div className={styles.caseStudyResults}>
                <h4>Results</h4>
                <ul>
                  <li>50% faster decision making</li>
                  <li>25% improvement in team collaboration</li>
                  <li>Significant reduction in workplace conflicts</li>
                </ul>
              </div>
              
              <blockquote className={styles.caseStudyQuote}>
                "Our leadership team is now more aligned, decisive, and effective. 
                The clarity we've gained is invaluable."
              </blockquote>
              
              <cite className={styles.caseStudyAttribution}>
                — Michael Rodriguez, Managing Director
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Formats Section */}
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Program Formats</h2>
            <p className={styles.sectionDescription}>
              Flexible delivery options to meet your organization's needs
            </p>
          </div>

          <div className={styles.formatsGrid}>
            <div className={styles.formatCard}>
              <h3 className={styles.formatTitle}>Workshop Series</h3>
              <p className={styles.formatDuration}>2-4 hours per session</p>
              <p className={styles.formatDescription}>
                Interactive workshops that introduce breathwork and mindfulness 
                practices to your teams.
              </p>
              
              <ul className={styles.formatFeatures}>
                <li>Hands-on practice</li>
                <li>Group exercises</li>
                <li>Take-home resources</li>
                <li>Follow-up support</li>
              </ul>
              
              <div className={styles.formatPrice}>
                <span className={styles.priceLabel}>Starting at</span>
                <span className={styles.priceAmount}>$2,500</span>
                <span className={styles.pricePeriod}>per session</span>
              </div>
            </div>

            <div className={styles.formatCard}>
              <h3 className={styles.formatTitle}>Intensive Retreats</h3>
              <p className={styles.formatDuration}>1-3 days</p>
              <p className={styles.formatDescription}>
                Deep dive experiences that create lasting transformation and 
                build strong team bonds.
              </p>
              
              <ul className={styles.formatFeatures}>
                <li>Immersive experience</li>
                <li>Team building</li>
                <li>Personal transformation</li>
                <li>Customized content</li>
              </ul>
              
              <div className={styles.formatPrice}>
                <span className={styles.priceLabel}>Starting at</span>
                <span className={styles.priceAmount}>$15,000</span>
                <span className={styles.pricePeriod}>per retreat</span>
              </div>
            </div>

            <div className={styles.formatCard}>
              <h3 className={styles.formatTitle}>Ongoing Programs</h3>
              <p className={styles.formatDuration}>3-12 months</p>
              <p className={styles.formatDescription}>
                Comprehensive programs that embed mindfulness and resilience 
                into your organizational culture.
              </p>
              
              <ul className={styles.formatFeatures}>
                <li>Regular sessions</li>
                <li>Progress tracking</li>
                <li>Cultural integration</li>
                <li>Continuous support</li>
              </ul>
              
              <div className={styles.formatPrice}>
                <span className={styles.priceLabel}>Starting at</span>
                <span className={styles.priceAmount}>$50,000</span>
                <span className={styles.pricePeriod}>per program</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="section section--sm">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Resources</h2>
            <p className={styles.sectionDescription}>
              Download our comprehensive guide to organizational transformation
            </p>
          </div>

          <div className={styles.resourceCard}>
            <div className={styles.resourceContent}>
              <h3 className={styles.resourceTitle}>The Complete Guide to Building Resilient Organizations</h3>
              <p className={styles.resourceDescription}>
                A comprehensive whitepaper covering the science behind organizational 
                resilience, practical implementation strategies, and case studies from 
                leading companies.
              </p>
              
              <ul className={styles.resourceFeatures}>
                <li>Evidence-based research</li>
                <li>Implementation roadmap</li>
                <li>ROI calculations</li>
                <li>Success metrics</li>
              </ul>
            </div>
            
            <div className={styles.resourceDownload}>
              <a href="/resources/whitepaper" className="btn btn--primary btn--large">
                Download Whitepaper
              </a>
              <p className={styles.downloadNote}>Free 40-page guide</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className={styles.ctaBand}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Transform Your Organization?</h2>
            <p className={styles.ctaDescription}>
              Schedule a consultation to discuss how we can help build resilience, 
              clarity, and transformation in your organization.
            </p>
            
            <div className={styles.ctaButtons}>
              <a href="/contact" className="btn btn--primary btn--large">
                Schedule Consultation
              </a>
              <a href="/resources/whitepaper" className="btn btn--secondary btn--large">
                Download Guide
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

