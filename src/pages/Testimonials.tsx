import { useEffect } from 'react'
import { SEO } from '@/components/SEO'
import { usePageTestimonials } from '@/hooks/useFirestore'

export function Testimonials() {
  const { data: page } = usePageTestimonials()
  const senjaId = '8491a872-ea22-420d-b7cc-0f2a1d9d042a'

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widget.senja.io/widget/8491a872-ea22-420d-b7cc-0f2a1d9d042a/platform.js'
    script.async = true
    script.onerror = () => showFallback()
    document.body.appendChild(script)

    const timeout = setTimeout(() => showFallback(), 5000)
    function showFallback() {
      const container = document.getElementById('senja-fallback')
      if (container && page?.fallbackCTA) {
        container.innerHTML = `<a class="btn" href="${page.fallbackCTA.url}" target="_blank" rel="noopener noreferrer">${page.fallbackCTA.label}</a>`
      }
    }
    return () => { clearTimeout(timeout); document.body.removeChild(script) }
  }, [page?.fallbackCTA?.url])

  if (!page) return null

  return (
    <>
      <SEO data={{ title: page.seo.title, description: page.seo.description, image: page.seo.ogImage }} />

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

      {/* Senja Embed */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 'var(--spacing-4)' }}>
            <div className="senja-embed" data-id={senjaId} data-mode="shadow" data-lazyload="false" style={{ display: 'block', width: '100%' }} />
            <div id="senja-fallback" style={{ textAlign: 'center', marginTop: 'var(--spacing-6)' }} />
          </div>
        </div>
      </section>
    </>
  )
}

