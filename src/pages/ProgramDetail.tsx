import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { TestimonialDisplay } from '@/components/TestimonialDisplay'
import { FinalCTABand } from '@/components/FinalCTABand'
import { LoadingWrapper } from '@/components/LoadingWrapper'
import { usePrograms } from '@/hooks/useFirestore'
import { motion } from 'framer-motion'
import { useInViewAnimation } from '@/utils/animations'
import testimonialsData from '@/content/testimonials.json'

export function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: programs, loading, error } = usePrograms()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const program = programs?.find(p => p.slug === slug)

  // Helper function to normalize CTAs structure
  const normalizeCTAs = (ctas: any) => {
    if (!ctas) return []
    if (Array.isArray(ctas)) return ctas
    if (typeof ctas === 'object') {
      // Handle object structure with primary/secondary
      const normalized = []
      if (ctas.primary) normalized.push(ctas.primary)
      if (ctas.secondary) normalized.push(ctas.secondary)
      return normalized
    }
    return []
  }

  const programCTAs = normalizeCTAs(program?.ctas)

  // Get testimonials for this program from playlist
  const allTestimonials = testimonialsData.testimonials || []
  const programPlaylist = testimonialsData.playlists?.programs?.[slug || ''] || []
  const programTestimonials = programPlaylist.map(id => 
    allTestimonials.find(t => t.id === id)
  ).filter(Boolean) as any[]

  // GA4 event on mount
  useEffect(() => {
    if (program) {
      // @ts-ignore
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        // @ts-ignore
        window.gtag('event', 'program_detail_view', { slug: program.slug })
      }
    }
  }, [program])

  const handleCtaClick = (label: string, url: string, external: boolean) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('event', 'program_cta_click', { slug: program?.slug, label })
    }
    
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      navigate(url)
    }
  }

  // Handle loading, error, and not found states
  if (loading) {
    return (
      <LoadingWrapper
        loading={true}
        loadingMessage="Loading program details..."
        variant="page"
        loadingVariant="spinner"
        loadingSize="lg"
      />
    )
  }

  if (error) {
    return (
      <LoadingWrapper
        loading={false}
        error={error}
        errorTitle="Failed to load program"
        errorMessage="We couldn't load the program details. Please try again."
        onRetry={() => window.location.reload()}
        retryText="Reload Page"
        variant="page"
        showErrorDetails={process.env.NODE_ENV === 'development'}
      />
    )
  }

  if (!program) {
    return (
      <LoadingWrapper
        loading={false}
        error="Program not found"
        errorTitle="Program Not Found"
        errorMessage="The program you're looking for doesn't exist or has been removed."
        onRetry={() => navigate('/programs')}
        retryText="View All Programs"
        variant="page"
      />
    )
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": program.title,
    "description": program.hero?.subtext || program.summary || program.title,
    "provider": {
      "@type": "Organization",
      "name": program.seo?.providerName || "Breathing Flame",
      "url": "https://breathingflame.com"
    },
    "hasCourseInstance": [{
      "@type": "CourseInstance",
      "courseMode": "Online",
      "location": {
        "@type": "VirtualLocation",
        "url": programCTAs.find(cta => cta.external)?.url || "https://breathingflame.com"
      }
    }]
  }

  return (
    <>
      <SEO data={{ 
        title: program.seo?.title || program.title, 
        description: program.seo?.description || program.summary || program.title, 
        image: program.seo?.ogImage,
        canonical: `https://breathingflame.com/programs/${program.slug}`
      }} />
      
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="section">
        <div className="container">
          <div className="hero-content" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            <h1 
              className="heading heading--xl" 
              style={{ 
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-family-primary)',
                textTransform: 'uppercase',
                fontStyle: 'italic',
                marginBottom: 'var(--spacing-4)'
              }}
            >
              {program.hero?.headline || program.title}
            </h1>
            <p className="text--lg" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
              {program.hero?.subtext || program.summary}
            </p>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {programCTAs.map((cta, index) => (
                <button
                  key={index}
                  className={index === 0 ? 'btn' : 'btn btn--secondary'}
                  onClick={() => handleCtaClick(cta.label, cta.url, cta.external || false)}
                  style={{ textDecoration: 'none' }}
                >
                  {cta.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="section">
        <div className="container">
          <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
            What You'll Achieve
          </h2>
          <div className="grid" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--spacing-4)' 
          }}>
            {program.outcomes.map((outcome, index) => (
              <div key={index} className="card" style={{ padding: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
                  <div style={{ 
                    color: 'var(--color-accent)', 
                    fontSize: '1.5rem',
                    lineHeight: 1,
                    marginTop: '0.25rem'
                  }}>
                    ✓
                  </div>
                  <p className="text--md" style={{ color: 'var(--color-text-primary)' }}>
                    {outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Modules) */}
      <section className="section">
        <div className="container">
          <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
            How It Works
          </h2>
          <div className="grid" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--spacing-4)' 
          }}>
            {program.modules.map((module, index) => (
              <div key={index} className="card" style={{ padding: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
                  <div style={{ 
                    color: 'var(--color-accent)', 
                    fontSize: '1.25rem',
                    fontWeight: 'var(--font-weight-bold)',
                    minWidth: '2rem',
                    textAlign: 'center'
                  }}>
                    {index + 1}
                  </div>
                  <p className="text--md" style={{ color: 'var(--color-text-primary)' }}>
                    {module}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      {program.includes && program.includes.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
              What's Included
            </h2>
            <div className="card" style={{ padding: 'var(--spacing-6)', maxWidth: 600, margin: '0 auto' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {program.includes.map((item, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-3)',
                    padding: 'var(--spacing-2) 0',
                    borderBottom: index < program.includes!.length - 1 ? '1px solid var(--color-border)' : 'none'
                  }}>
                    <div style={{ 
                      color: 'var(--color-accent)', 
                      fontSize: '1.25rem',
                      lineHeight: 1
                    }}>
                      ✓
                    </div>
                    <span className="text--md" style={{ color: 'var(--color-text-primary)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Format */}
      {program.format && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
              Program Details
            </h2>
            <div className="card" style={{ padding: 'var(--spacing-6)', maxWidth: 600, margin: '0 auto' }}>
              <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
                {program.format.duration && (
                  <div>
                    <h3 className="heading heading--sm" style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-1)' }}>
                      Duration
                    </h3>
                    <p className="text--md" style={{ color: 'var(--color-text-primary)' }}>
                      {program.format.duration}
                    </p>
                  </div>
                )}
                {program.format.delivery && (
                  <div>
                    <h3 className="heading heading--sm" style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-1)' }}>
                      Delivery
                    </h3>
                    <p className="text--md" style={{ color: 'var(--color-text-primary)' }}>
                      {program.format.delivery}
                    </p>
                  </div>
                )}
                {program.format.location && (
                  <div>
                    <h3 className="heading heading--sm" style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-1)' }}>
                      Location
                    </h3>
                    <p className="text--md" style={{ color: 'var(--color-text-primary)' }}>
                      {program.format.location}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {program.testimonials && program.testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
              What Participants Say
            </h2>
            <div className="grid" style={{ 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 'var(--spacing-4)' 
            }}>
              {program.testimonials.map((testimonial, index) => (
                <div key={index} className="card" style={{ padding: 'var(--spacing-4)' }}>
                  <p className="text--md" style={{ color: 'var(--color-text-primary)', fontStyle: 'italic', marginBottom: 'var(--spacing-3)' }}>
                    "{testimonial}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="section">
        <div className="container">
          <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
            Upcoming Events
          </h2>
          <div className="card" style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
            {program.relatedEventsMode === 'manual' && program.relatedEvents && program.relatedEvents.length > 0 ? (
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                {program.relatedEvents.map((eventUrl, index) => (
                  <a
                    key={index}
                    href={eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--secondary"
                    style={{ textDecoration: 'none' }}
                  >
                    View Event {index + 1}
                  </a>
                ))}
              </div>
            ) : (
              <div>
                <p className="text--md" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                  See upcoming cohorts and workshops
                </p>
                <a href="/events" className="btn">
                  View All Events
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {programTestimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
              What Our Clients Say
            </h2>
            <TestimonialDisplay 
              testimonials={programTestimonials} 
              layout="grid" 
              showRating={true}
              showTags={false}
              showSource={false}
            />
          </div>
        </section>
      )}

      {/* FAQ */}
      {program.faq && program.faq.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            <div className="faq-list" style={{ maxWidth: 800, margin: '0 auto' }}>
              {program.faq.map((faq, index) => (
                <div key={index} className="card" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <button
                    className="faq-question"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-4)',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    aria-expanded={expandedFaq === index}
                  >
                    <h3 className="heading heading--sm" style={{ color: 'var(--color-text-primary)' }}>
                      {faq.q}
                    </h3>
                    <span style={{ 
                      color: 'var(--color-accent)', 
                      fontSize: '1.5rem',
                      transform: expandedFaq === index ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform var(--transition-fast)'
                    }}>
                      +
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="faq-answer" style={{ padding: '0 var(--spacing-4) var(--spacing-4)' }}>
                      <p className="text--md" style={{ color: 'var(--color-text-secondary)' }}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <FinalCTABand
        headline={program.finalCTA?.headline || `Ready to Transform Your ${program.title}?`}
        subtext={program.finalCTA?.subtext || `Join ${program.title} and start your journey to greater energy, resilience, and vitality.`}
        buttons={programCTAs.map(cta => ({
          label: cta.label,
          url: cta.url,
          external: cta.external || false
        }))}
        onButtonClick={handleCtaClick}
      />
    </>
  )
}
