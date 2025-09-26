import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { useSolutionBySlug } from '@/hooks/useFirestore'

export function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: solution } = useSolutionBySlug(slug || '')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  useEffect(() => {
    if (solution) {
      // @ts-ignore
      if (window?.gtag) window.gtag('event','solution_detail_view',{ slug: solution.slug })
    }
  }, [solution])

  const handleCtaClick = (label: string, url: string, external?: boolean) => {
    // @ts-ignore
    if (window?.gtag) window.gtag('event','solution_cta_click',{ slug: solution?.slug, label })
    if (external) window.open(url, '_blank', 'noopener,noreferrer')
    else navigate(url)
  }

  if (!solution) return null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": solution.title,
    "description": solution.hero.subtext,
    "areaServed": "Worldwide",
    "provider": { "@type":"Organization","name":"Breathing Flame","url":"https://breathingflame.com" }
  }

  return (
    <>
      <SEO data={{ title: solution.seo.title, description: solution.seo.description, image: solution.seo.ogImage }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            <h1 className="heading heading--xl" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-family-primary)', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 'var(--spacing-4)' }}>
              {solution.hero.headline}
            </h1>
            <p className="text--lg" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
              {solution.hero.subtext}
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {solution.ctas.map((cta, i) => (
                <button key={i} className={i === 0 ? 'btn' : 'btn btn--secondary'} onClick={() => handleCtaClick(cta.label, cta.url, cta.external)}>
                  {cta.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      {solution.outcomes?.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Business Outcomes</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              {solution.outcomes.map((item, idx) => (
                <div key={idx} className="card" style={{ padding: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                    <div style={{ color: 'var(--color-accent)', fontSize: '1.5rem', lineHeight: 1, marginTop: '0.25rem' }}>✓</div>
                    <p className="text--md" style={{ color: 'var(--color-text-primary)' }}>{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {solution.modules?.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>How It Works</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              {solution.modules.map((item, idx) => (
                <div key={idx} className="card" style={{ padding: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                    <div style={{ color: 'var(--color-accent)', fontWeight: 'var(--font-weight-bold)' }}>{idx + 1}</div>
                    <p className="text--md" style={{ color: 'var(--color-text-primary)' }}>{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Formats + Includes */}
      {(solution.formats?.length || solution.includes?.length) && (
        <section className="section">
          <div className="container">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--spacing-6)' }}>
              {solution.formats?.length ? (
                <div className="card" style={{ padding: 'var(--spacing-6)' }}>
                  <h3 className="heading heading--md" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-4)' }}>Formats</h3>
                  <ul style={{ margin: 0 }}>
                    {solution.formats.map((f, i) => (<li key={i} className="text--md">{f}</li>))}
                  </ul>
                </div>
              ) : null}
              {solution.includes?.length ? (
                <div className="card" style={{ padding: 'var(--spacing-6)' }}>
                  <h3 className="heading heading--md" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-4)' }}>What's Included</h3>
                  <ul style={{ margin: 0 }}>
                    {solution.includes.map((f, i) => (<li key={i} className="text--md">{f}</li>))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* Audience */}
      {solution.audience && (
        <section className="section">
          <div className="container">
            <div className="card" style={{ padding: 'var(--spacing-6)', maxWidth: 900, margin: '0 auto' }}>
              <h3 className="heading heading--md" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-4)' }}>Who It's For</h3>
              <p className="text--md" style={{ color: 'var(--color-text-primary)' }}>{solution.audience}</p>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - placeholder refs */}
      {solution.testimonials && solution.testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Results</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              {solution.testimonials.map((t, i) => (
                <div key={i} className="card" style={{ padding: 'var(--spacing-4)' }}>
                  <p className="text--md" style={{ color: 'var(--color-text-secondary)' }}>Testimonial #{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {solution.faq && solution.faq.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>FAQ</h2>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              {solution.faq.map((faq, idx) => (
                <div key={idx} className="card" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    aria-expanded={expandedFaq === idx}
                    style={{ width: '100%', padding: 'var(--spacing-4)', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <h3 className="heading heading--sm" style={{ color: 'var(--color-text-primary)' }}>{faq.q}</h3>
                    <span style={{ color: 'var(--color-accent)', fontSize: '1.5rem', transform: expandedFaq === idx ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform var(--transition-fast)' }}>+</span>
                  </button>
                  {expandedFaq === idx && (
                    <div style={{ padding: '0 var(--spacing-4) var(--spacing-4)' }}>
                      <p className="text--md" style={{ color: 'var(--color-text-secondary)' }}>{faq.a}</p>
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
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-4)' }}>Ready to get started?</h2>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {solution.ctas.map((cta, i) => (
                <button key={i} className={i === 0 ? 'btn' : 'btn btn--secondary'} onClick={() => handleCtaClick(cta.label, cta.url, cta.external)}>
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


