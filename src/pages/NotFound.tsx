import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { useAllOfferingsLite, useLatestPostsLite } from '@/hooks/useFirestore'
import { formatDate } from '@/utils/format'

const KNOWN_ROUTES = [
  { label: "Home", path: "/" },
  { label: "For Individuals", path: "/individuals" },
  { label: "For Organizations", path: "/organizations" },
  { label: "Programs", path: "/programs" },
  { label: "Events", path: "/events" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Resources", path: "/resources" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Reverse Aging Challenge", path: "/programs/reverse-aging-challenge" },
  { label: "Unblocked in Ten Weeks", path: "/programs/unblocked-in-ten-weeks" },
  { label: "Unstoppable", path: "/programs/unstoppable" },
  { label: "Wim Hof Method", path: "/experiences/wim-hof-method" },
  { label: "9D Breathwork", path: "/experiences/9d-breathwork" }
]

export function NotFound() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{label: string, path: string, type: 'route' | 'post'}>>([])
  
  const { data: offerings } = useAllOfferingsLite()
  const { data: latestPosts } = useLatestPostsLite(3)

  // GA4 event on mount
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('event', '404_view', { path: location.pathname })
    }
  }, [location.pathname])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 150)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Search logic
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = debouncedQuery.toLowerCase()
    const results: Array<{label: string, path: string, type: 'route' | 'post'}> = []

    // Search known routes
    KNOWN_ROUTES.forEach(route => {
      if (route.label.toLowerCase().includes(query) || route.path.toLowerCase().includes(query)) {
        results.push({ ...route, type: 'route' })
      }
    })

    // Search latest posts
    latestPosts.forEach(post => {
      if (post.title.toLowerCase().includes(query) || post.excerpt?.toLowerCase().includes(query)) {
        results.push({ 
          label: post.title, 
          path: `/resources/${post.slug}`, 
          type: 'post' 
        })
      }
    })

    setSearchResults(results.slice(0, 8)) // Limit to 8 results
  }, [debouncedQuery, latestPosts])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      navigate(searchResults[0].path)
      // @ts-ignore
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        // @ts-ignore
        window.gtag('event', '404_search', { query: debouncedQuery, resultsCount: searchResults.length })
      }
    }
  }

  const handleQuickLinkClick = (label: string, path: string) => {
    navigate(path)
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('event', '404_quicklink_click', { label, path })
    }
  }

  const handleOfferingClick = (title: string, kind: string, slug: string) => {
    const path = kind === 'program' ? `/programs/${slug}` : `/experiences/${slug}`
    navigate(path)
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('event', '404_program_click', { title, kind, slug })
    }
  }

  const handleArticleClick = (slug: string) => {
    navigate(`/resources/${slug}`)
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('event', '404_article_click', { slug })
    }
  }

  return (
    <>
      <SEO data={{ 
        title: 'Page Not Found - Breathing Flame', 
        description: 'The page you\'re looking for doesn\'t exist. Explore our programs, resources, and experiences.' 
      }} />

      {/* Hero */}
      <section className="section">
        <div className="container">
          <h1 className="heading heading--xl" style={{ 
            color: 'var(--color-primary)', 
            fontFamily: 'var(--font-family-primary)',
            textTransform: 'uppercase',
            fontStyle: 'italic'
          }}>
            Page not found
          </h1>
          <p className="text--lg" style={{ color: 'var(--color-text-secondary)' }}>
            We can't find "{location.pathname}". Try one of these popular pages or search below.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 'var(--spacing-6)', maxWidth: 600, margin: '0 auto' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <label htmlFor="404-search" className="label">Search the site</label>
              <input
                id="404-search"
                type="text"
                className="input"
                placeholder="Search pages and articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-describedby="search-results-count"
              />
              <div id="search-results-count" aria-live="polite" className="sr-only">
                {searchResults.length > 0 ? `${searchResults.length} results found` : 'No results found'}
              </div>
              
              {searchResults.length > 0 && (
                <div className="search-results" style={{ marginTop: 'var(--spacing-2)' }}>
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      className="search-result-item"
                      onClick={() => navigate(result.path)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: 'var(--spacing-2)',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{result.label}</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        {result.path} • {result.type === 'route' ? 'Page' : 'Article'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section">
        <div className="container">
          <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)' }}>
            Popular Pages
          </h2>
          <div className="grid" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 'var(--spacing-4)' 
          }}>
            {[
              { label: 'For Individuals', path: '/individuals' },
              { label: 'For Organizations', path: '/organizations' },
              { label: 'Programs', path: '/programs' },
              { label: 'Events', path: '/events' },
              { label: 'Contact', path: '/contact' }
            ].map((link) => (
              <button
                key={link.path}
                className="card"
                onClick={() => handleQuickLinkClick(link.label, link.path)}
                style={{ 
                  padding: 'var(--spacing-4)', 
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-background)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                aria-label={`Go to ${link.label}`}
              >
                <h3 className="heading heading--sm" style={{ color: 'var(--color-text-primary)' }}>
                  {link.label}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs & Workshops */}
      {offerings.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)' }}>
              Programs & Workshops
            </h2>
            <div className="grid" style={{ 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 'var(--spacing-4)' 
            }}>
              {offerings.map((offering) => (
                <button
                  key={`${offering.kind}-${offering.slug}`}
                  className="card"
                  onClick={() => handleOfferingClick(offering.title, offering.kind, offering.slug)}
                  style={{ 
                    padding: 'var(--spacing-4)', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-background)',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  aria-label={`Open ${offering.title} ${offering.kind}`}
                >
                  <div className="eyebrow" style={{ color: 'var(--color-primary)' }}>
                    {offering.kind === 'program' ? 'Program' : 'Experience'}
                  </div>
                  <h3 className="heading heading--sm" style={{ color: 'var(--color-text-primary)' }}>
                    {offering.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      {latestPosts && latestPosts.length > 0 && latestPosts.some(post => post && post.slug) && (
        <section className="section">
          <div className="container">
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)' }}>
              Latest from Resources
            </h2>
            <div className="grid" style={{ 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 'var(--spacing-4)' 
            }}>
              {latestPosts?.filter(post => post && post.slug).map((post) => (
                <button
                  key={post.slug}
                  className="card"
                  onClick={() => handleArticleClick(post.slug)}
                  style={{ 
                    padding: 'var(--spacing-4)', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-background)',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  aria-label={`Read article ${post.title}`}
                >
                  <h3 className="heading heading--sm" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text--sm" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                      {post.excerpt}
                    </p>
                  )}
                  <div className="text--xs" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(post.publishedAt)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Assessments */}
      <section className="section">
        <div className="container">
          <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)' }}>
            Quick Assessments
          </h2>
          <div className="card" style={{ padding: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              <a 
                href="/#ignite-your-flame" 
                className="btn btn--secondary"
                style={{ textDecoration: 'none' }}
              >
                Ignite Your Flame
              </a>
              <a 
                href="/#peak-energy-profiler" 
                className="btn btn--secondary"
                style={{ textDecoration: 'none' }}
              >
                Peak Energy Profiler
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>
            <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-4)' }}>
              Still need help?
            </h2>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/individuals" className="btn">For Individuals</a>
              <a href="/organizations" className="btn">For Organizations</a>
              <a href="/contact" className="btn btn--secondary">Contact</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}