import { SEO } from '@/components/SEO'
import { usePageTestimonials } from '@/hooks/useFirestore'
import { TestimonialComponent } from '@/components/TestimonialComponent'
import { HeroSection } from '@/components/HeroSection'
import { FinalCTABand } from '@/components/FinalCTABand'
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
      <SEO data={{ 
        title: page.seo.title, 
        description: page.seo.description, 
        image: page.seo.ogImage,
        structuredData: jsonLD
      }} />
      
      {/* Hero Section */}
      {(page.sections?.hero?.visible !== false) && page.sections?.hero && (
        <HeroSection
          title={page.sections.hero.headline}
          subtitle={page.sections.hero.subtext}
          media={page.sections.hero.media}
          ctas={page.sections.hero.ctas}
        />
      )}

      {/* Intro Section */}
      {(page.sections?.intro?.visible !== false) && page.sections?.intro && (
        <section className="section">
          <div className="container">
            <div className="sectionHeader">
              <h2 className="sectionTitle">{page.sections.intro.title}</h2>
              <p className="sectionDescription">{page.sections.intro.body}</p>
            </div>
          </div>
        </section>
      )}

      {/* Highlights Section */}
      {(page.sections?.highlights?.visible !== false) && page.sections?.highlights && (
        <section className="section">
          <div className="container">
            <TestimonialComponent
              mode="grid"
              title={page.sections.highlights.title}
              subtext={page.sections.highlights.subtext}
              context={page.sections.highlights.widget?.context}
              maxCount={page.sections.highlights.widget?.maxCount}
              minRating={page.sections.highlights.widget?.minRating}
              className={styles.testimonialBlock}
            />
          </div>
        </section>
      )}

      {/* Individuals Section */}
      {(page.sections?.individuals?.visible !== false) && page.sections?.individuals && (
        <section className="section">
          <div className="container">
            <TestimonialComponent
              mode="grid"
              title={page.sections.individuals.title}
              subtext={page.sections.individuals.subtext}
              context={page.sections.individuals.widget?.context}
              maxCount={page.sections.individuals.widget?.maxCount}
              minRating={page.sections.individuals.widget?.minRating}
              className={styles.testimonialBlock}
            />
          </div>
        </section>
      )}

      {/* Organizations Section */}
      {(page.sections?.organizations?.visible !== false) && page.sections?.organizations && (
        <section className="section">
          <div className="container">
            <TestimonialComponent
              mode="grid"
              title={page.sections.organizations.title}
              subtext={page.sections.organizations.subtext}
              context={page.sections.organizations.widget?.context}
              maxCount={page.sections.organizations.widget?.maxCount}
              minRating={page.sections.organizations.widget?.minRating}
              className={styles.testimonialBlock}
            />
          </div>
        </section>
      )}

      {/* Review CTA */}
      {(page.sections?.reviewCTA?.visible !== false) && page.sections?.reviewCTA && (
        <section className="section">
          <div className="container">
            <div className={styles.reviewCTA}>
              <a 
                className="btn btn--secondary" 
                href={page.sections.reviewCTA.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {page.sections.reviewCTA.label}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Band */}
      {(page.sections?.finalCTA?.visible !== false) && page.sections?.finalCTA && (
        <FinalCTABand
          headline={page.sections.finalCTA.headline}
          subtext={page.sections.finalCTA.subtext}
          buttons={page.sections.finalCTA.buttons}
        />
      )}
    </>
  )
}

