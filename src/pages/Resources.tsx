import { SEO } from '@/components/SEO'
import { useEffect, useMemo, useState } from 'react'
import { usePageResources, usePostsFiltered } from '@/hooks/useFirestore'
import { formatDate, getReadTime } from '@/utils/format'

export function Resources() {
  const { data: page } = usePageResources()
  const [activeTag, setActiveTag] = useState<string>('All')
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [visible, setVisible] = useState(12)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 150)
    return () => clearTimeout(t)
  }, [query])

  const { data: posts, total } = usePostsFiltered({ tag: activeTag, search: debounced, limit: visible, offset: 0 })

  if (!page) return null

  const tags = ['All', ...(page.filters?.tags || [])]

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Resources',
    about: page.filters?.tags || ['Performance', 'Resilience', 'Longevity'],
    url: 'https://breathingflame.com/resources'
  }

  function onTagClick(tag: string) {
    setActiveTag(tag)
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('event', 'resources_filter', { tag })
    }
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('event', 'resources_search', { query, resultsCount: total })
    }
  }

  return (
    <>
      <SEO data={{ title: page.seo.title, description: page.seo.description, image: page.seo.ogImage, structuredData: [collectionLd] }} />

      {/* Hero */}
      <section className="section">
        <div className="container">
          <h1 className="heading heading--xl" style={{ color: 'var(--color-primary)' }}>{page.hero.headline}</h1>
          <p className="text--lg" style={{ color: 'var(--color-text-secondary)' }}>{page.hero.subtext}</p>
        </div>
      </section>

      {/* Controls */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
          {page.filters?.enabled !== false && (
            <div role="tablist" aria-label="Filter articles">
              {tags.map(tag => (
                <button
                  key={tag}
                  role="tab"
                  aria-selected={activeTag === tag}
                  className={`chip ${activeTag === tag ? 'chip--active' : ''}`}
                  onClick={() => onTagClick(tag)}
                  style={{ marginRight: 'var(--spacing-2)' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          {page.search?.enabled !== false && (
            <form onSubmit={onSearchSubmit} aria-label="Search resources">
              <label htmlFor="resources-search" className="sr-only">Search articles</label>
              <input id="resources-search" value={query} onChange={e => setQuery(e.target.value)} placeholder={page.search?.placeholder || 'Search articles…'} className="input" />
            </form>
          )}
        </div>
      </section>

      {/* Featured */}
      {page.featuredPostRef && (
        <section className="section">
          <div className="container">
            {posts.filter(p => p.id === page.featuredPostRef).map(p => (
              <a key={p.id} className="card" href={`/resources/${p.slug}`} style={{ display: 'block', padding: '0' }}>
                {p.cover && <img src={p.cover} alt={p.title} style={{ width: '100%', height: 280, objectFit: 'cover', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }} />}
                <div style={{ padding: 'var(--spacing-6)' }}>
                  <div className="eyebrow">{p.tags?.[0]}</div>
                  <h3 className="heading heading--lg" style={{ color: 'var(--color-primary)' }}>{p.title}</h3>
                  <p className="text--md" style={{ color: 'var(--color-text-secondary)' }}>{p.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="section">
        <div className="container grid" style={{ gap: 'var(--spacing-6)', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
          {posts.map(p => (
            <a key={p.id} href={`/resources/${p.slug}`} className="card" style={{ display: 'block', padding: 0 }} aria-label={`Open article ${p.title}`}>
              {p.cover && <img src={p.cover} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }} />}
              <div style={{ padding: 'var(--spacing-4)' }}>
                <div className="eyebrow">{p.tags?.[0]}</div>
                <h3 className="heading heading--md" style={{ color: 'var(--color-text-primary)' }}>{p.title}</h3>
                <p className="text--sm" style={{ color: 'var(--color-text-secondary)' }}>{p.excerpt}</p>
                <div className="text--xs" style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-2)' }}>
                  {formatDate(p.publishedAt)} · {getReadTime(p.content)} min read
                </div>
              </div>
            </a>
          ))}
        </div>
        {visible < (total || 0) && (
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-8)' }}>
            <button className="btn" onClick={() => setVisible(v => v + 12)}>Load more</button>
          </div>
        )}
      </section>

      {/* Newsletter */}
      {page.newsletter?.enabled !== false && (
        <section id={page.newsletter.idAnchor || 'newsletter'} className="section">
          <div className="container">
            <div className="card" style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
              <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)' }}>{page.newsletter.headline}</h2>
              <p className="text--md" style={{ color: 'var(--color-text-secondary)' }}>{page.newsletter.subtext}</p>
              <a className="btn" href={page.newsletter.ctaUrl} onClick={() => { /* @ts-ignore */ if (window?.gtag) window.gtag('event','newsletter_click',{ location:'resources' }) }}>{page.newsletter.ctaLabel}</a>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

