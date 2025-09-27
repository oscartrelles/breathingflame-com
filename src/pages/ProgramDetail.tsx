import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { usePrograms } from '@/hooks/useFirestore'

export function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: programs, loading, error } = usePrograms()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const program = programs?.find(p => p.slug === slug)

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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading program</div>
  if (!program) return <div>Program not found</div>

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": program.title,
    "description": program.hero.subtext,
    "provider": {
      "@type": "Organization",
      "name": "Breathing Flame",
      "url": "https://breathingflame.com"
    },
    "hasCourseInstance": [{
      "@type": "CourseInstance",
      "courseMode": "Online",
      "location": {
        "@type": "VirtualLocation",
        "url": program.ctas.find(cta => cta.external)?.url || "https://breathingflame.com"
      }
    }]
  }

  return (
    <>
      <SEO data={{ 
        title: program.seo.title, 
        description: program.seo.description, 
        image: program.seo.ogImage,
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
              {program.hero.headline}
            </h1>
            <p className="text--lg" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
              {program.hero.subtext}
            </p>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {program.ctas.map((cta, index) => (
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
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-4)' }}>
              Ready to Transform Your Healthspan?
            </h2>
            <p className="text--md" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
              Join the Reverse Aging Challenge and start your journey to greater energy, resilience, and vitality.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {program.ctas.map((cta, index) => (
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
    </>
  )
}
