import { SEO } from '@/components/SEO'
import { usePageTestimonials } from '@/hooks/useFirestore'
import { TestimonialsRail } from '@/components/TestimonialsRail'
import { HeroSection } from '@/components/HeroSection'
import { getTestimonialsJSONLD } from '@/seo/aggregate'
import { useContent } from '@/hooks/useContent'
import { Testimonial } from '@/lib/testimonials'
import styles from './Testimonials.module.css'

export function Testimonials() {
  const { data: page } = usePageTestimonials()
  const { data: contentData } = useContent()

  if (!page) return null

  // Convert testimonials data to our interface for JSON-LD
  const allTestimonials: Testimonial[] = (contentData?.testimonials || []).map((testimonial: any) => ({
    id: testimonial.id,
    author: {
      name: testimonial.author?.name || 'Anonymous',
      role: testimonial.author?.title || testimonial.author?.role,
      avatar: testimonial.author?.avatar
    },
    text: testimonial.text || '',
    rating: testimonial.rating || 5,
    tags: Array.isArray(testimonial.tags) ? testimonial.tags : [],
    refs: {
      programSlugs: testimonial.refs?.programSlugs || [],
      experienceSlugs: testimonial.refs?.experienceSlugs || [],
      solutionSlugs: testimonial.refs?.solutionSlugs || []
    },
    featured: testimonial.featured || false,
    createdAt: testimonial.createdAt || new Date().toISOString(),
    updatedAt: testimonial.updatedAt || new Date().toISOString()
  }))

  const jsonLD = getTestimonialsJSONLD(allTestimonials)

  return (
    <>
      <SEO data={{ title: page.seo.title, description: page.seo.description, image: page.seo.ogImage }} />
      
      {/* JSON-LD */}
      {jsonLD.map((ld, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      
      {/* Hero */}
      <HeroSection
        title={page.hero.headline}
        subtitle={page.hero.subtext}
        media={page.hero.media}
      />

      {/* Intro */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 'var(--spacing-6)' }}>
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)' }}>{page.intro.title}</h2>
            <p className="text--md" style={{ color: 'var(--color-text-secondary)' }}>{page.intro.body}</p>
          </div>
        </div>
      </section>

      {/* Testimonial Blocks */}
      {page.blocks?.map((block, index) => (
        <TestimonialsRail
          key={index}
          title={block.title}
          subtext={block.subtext}
          context={block.widget?.context}
          maxCount={block.widget?.maxCount}
          minRating={block.widget?.minRating}
          className={styles.testimonialBlock}
        />
      ))}

      {/* CTA Band */}
      <section className="section" style={{ background: 'var(--color-primary)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="heading heading--xl" style={{ color: 'white', marginBottom: 'var(--spacing-4)' }}>
              {page.ctaBand.headline}
            </h2>
            {page.ctaBand.subtext && (
              <p className="text--lg" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 'var(--spacing-8)' }}>
                {page.ctaBand.subtext}
              </p>
            )}
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {page.ctaBand.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.url}
                  className={`btn ${index === 0 ? 'btn--primary' : 'btn--secondary'} btn--large btn--on-accent`}
                  target={button.external ? '_blank' : undefined}
                  rel={button.external ? 'noopener noreferrer' : undefined}
                >
                  {button.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Review CTA */}
      {page.reviewCTA && (
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <a 
              className="btn btn--secondary" 
              href={page.reviewCTA.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {page.reviewCTA.label}
            </a>
          </div>
        </section>
      )}
    </>
  )
}

