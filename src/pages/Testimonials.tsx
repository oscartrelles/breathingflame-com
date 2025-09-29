import { SEO } from '@/components/SEO'
import { usePageTestimonials } from '@/hooks/useFirestore'
import { TestimonialDisplay } from '@/components/TestimonialDisplay'
import testimonialsData from '@/content/testimonials.json'
import styles from './Testimonials.module.css'

export function Testimonials() {
  const { data: page } = usePageTestimonials()

  if (!page) return null

  // Get all testimonials for the testimonials page
  const allTestimonials = testimonialsData.testimonials || []
  
  // Organize testimonials by tags
  const testimonialsByTag: Record<string, any[]> = {}
  
  allTestimonials.forEach(testimonial => {
    testimonial.tags.forEach(tag => {
      if (!testimonialsByTag[tag]) {
        testimonialsByTag[tag] = []
      }
      testimonialsByTag[tag].push(testimonial)
    })
  })
  
  // Sort tags by number of testimonials
  const sortedTags = Object.keys(testimonialsByTag).sort((a, b) => 
    testimonialsByTag[b].length - testimonialsByTag[a].length
  )

  return (
    <>
      <SEO data={{ title: page.seo.title, description: page.seo.description, image: page.seo.ogImage }} />
      
      {/* Debug info */}
      <div style={{ background: 'red', color: 'white', padding: '10px', margin: '10px' }}>
        DEBUG: Testimonials component loaded. Total: {allTestimonials.length}, Tags: {sortedTags.length}
      </div>

      {/* Hero */}
      <section className="section">
        <div className="container">
          <h1 className="heading heading--xl" style={{ color: 'var(--color-primary)' }}>{page.hero.headline}</h1>
          <p className="text--lg" style={{ color: 'var(--color-text-secondary)' }}>{page.hero.subtext}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 'var(--spacing-6)' }}>
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)' }}>{page.intro.title}</h2>
            <p className="text--md" style={{ color: 'var(--color-text-secondary)' }}>{page.intro.body}</p>
          </div>
        </div>
      </section>

      {/* Testimonials by Tag */}
      <section className="section">
        <div className="container">
          {allTestimonials.length > 0 ? (
            <div>
              {sortedTags.map(tag => (
                <div key={tag} style={{ marginBottom: 'var(--spacing-8)' }}>
                  <h3 className="heading heading--lg" style={{ 
                    color: 'var(--color-primary)', 
                    marginBottom: 'var(--spacing-4)',
                    textTransform: 'capitalize'
                  }}>
                    {tag} ({testimonialsByTag[tag].length})
                  </h3>
                  <TestimonialDisplay 
                    testimonials={testimonialsByTag[tag]} 
                    layout="grid" 
                    showRating={true}
                    showTags={false}
                    showSource={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
              <h3 className="heading heading--md" style={{ color: 'var(--color-text-secondary)' }}>
                Loading testimonials...
              </h3>
              <p className="text--sm" style={{ color: 'var(--color-text-secondary)' }}>
                Available: {allTestimonials.length}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

