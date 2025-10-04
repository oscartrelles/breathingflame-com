import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { FinalCTABand } from '@/components/FinalCTABand'
import { HeroSection } from '@/components/HeroSection'
import { TestimonialComponent } from '@/components/TestimonialComponent'
import { ProductDetailGrid, createProductGridItems } from '@/components/ProductDetailGrid'
import { usePrograms, useExperiences, useSolutions } from '@/hooks/useFirestore'
import { useContent } from '@/hooks/useContent'

type ProductType = 'program' | 'experience' | 'solution'

interface ProductDetailProps {
  productType: ProductType
}

export function ProductDetail({ productType }: ProductDetailProps) {
  const { slug } = useParams()
  const { data: content } = useContent('en')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Load collections
  const { data: programs } = usePrograms()
  const { data: experiences } = useExperiences()
  const { data: solutions } = useSolutions()

  // Select item by type/slug
  const product: any | null = useMemo(() => {
    if (!slug) return null
    if (productType === 'program') return (programs || []).find((p: any) => p.slug === slug) || null
    if (productType === 'experience') return (experiences || []).find((e: any) => e.slug === slug) || null
    if (productType === 'solution') return (solutions || []).find((s: any) => s.slug === slug) || null
    return null
  }, [productType, slug, programs, experiences, solutions])

  // Labels from item.ui or global defaults (no hardcoded fallback text)
  const ui = {
    outcomesTitle: product?.ui?.outcomesTitle,
    howItWorksTitle: product?.ui?.howItWorksTitle,
    includesTitle: product?.ui?.includesTitle,
    detailsTitle: product?.ui?.detailsTitle,
  }

  if (!product) {
    return <div className="container" style={{ padding: 'var(--spacing-24) 0' }}>Not found</div>
  }

  // Normalize testimonial refs shape
  const testimonialRefs: string[] | undefined = Array.isArray(product?.testimonials)
    ? product.testimonials
    : product?.testimonials?.testimonialRefs

  // Normalize CTAs for FinalCTABand
  const productCTAs = Array.isArray(product?.ctas)
    ? product.ctas
    : Object.values(product?.ctas || {})

  return (
    <>
      <SEO data={{
        title: product?.seo?.title || product.title,
        description: product?.seo?.description || product.summary || product.title,
        image: product?.seo?.ogImage
      }} />

      {/* Hero */}
      {product?.hero && (
        <HeroSection
          title={product.title}
          subtitle={product.hero?.subtext || ''}
          media={{ imageUrl: product.hero?.image, videoEmbed: product.hero?.videoEmbed }}
        />
      )}

      {/* 2x2 Grid: Outcomes, How It Works, Includes, Details */}
      <section className="section">
        <div className="container">
          <ProductDetailGrid 
            items={createProductGridItems(product, ui)}
          />
        </div>
      </section>

      {/* Testimonials */}
      {(testimonialRefs && testimonialRefs.length > 0) && (
        <section className="section">
          <div className="container">
            <TestimonialComponent
              mode="grid"
              testimonialRefs={testimonialRefs}
              context={{ 
                [`${productType}Slug`]: product.slug 
              }}
              title={product?.testimonials?.headline}
              subtext={product?.testimonials?.subtext}
            />
          </div>
        </section>
      )}

      {/* FAQ */}
      {product.faq?.items && product.faq.items.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
              {product.faq.title || ui.faqTitle || "Frequently Asked Questions"}
            </h2>
            {product.faq.subtitle && (
              <p className="text--md" style={{ color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: 800, margin: '0 auto var(--spacing-6)' }}>
                {product.faq.subtitle}
              </p>
            )}
            <div className="faq-list" style={{ maxWidth: 800, margin: '0 auto' }}>
              {product.faq.items.map((faq: any, index: number) => (
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
                      {faq.question || faq.q}
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
                        {faq.answer || faq.a}
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
        headline={product.finalCTA?.headline}
        subtext={product.finalCTA?.subtext}
        buttons={(product.finalCTA?.buttons || productCTAs || []).map((b: any) => ({
          label: b.label,
          url: b.pathOrUrl || b.url,
          external: b.external || false
        }))}
      />
    </>
  )
}

export default ProductDetail


