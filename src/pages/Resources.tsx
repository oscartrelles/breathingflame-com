import { SEO } from '@/components/SEO'
import { LoadingWrapper } from '@/components/LoadingWrapper'
import { ErrorState } from '@/components/ErrorState'
import { FinalCTABand } from '@/components/FinalCTABand'
import { useEffect, useState } from 'react'
import { usePageResources, usePostsFiltered } from '@/hooks/useFirestore'
import { formatDate, getReadTime } from '@/utils/format'
import styles from './Resources.module.css'

export function Resources() {
  const { data: page, loading: pageLoading, error: pageError } = usePageResources()
  const [activeTag, setActiveTag] = useState<string>('All')
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [visible, setVisible] = useState(12)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 150)
    return () => clearTimeout(t)
  }, [query])

  const { data: posts, total, loading: postsLoading, error: postsError } = usePostsFiltered({ 
    tag: activeTag, 
    search: debounced, 
    limit: visible, 
    offset: 0 
  })

  const tags = page?.sections?.filters?.tags ? ['All', ...page.sections.filters.tags] : ['All']
  
  // Function to capitalize tag for display
  const capitalizeTag = (tag: string) => {
    if (tag === 'All') return tag
    return tag.charAt(0).toUpperCase() + tag.slice(1)
  }


  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page?.seo?.title || 'Resources',
    description: page?.seo?.description,
    about: page?.sections?.filters?.tags || [],
    url: 'https://breathingflame.com/resources',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total || 0,
      itemListElement: posts?.slice(0, visible).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          author: {
            '@type': 'Person',
            name: post.author?.name || 'Oscar Trelles',
            ...(post.author?.avatar && { image: post.author.avatar })
          },
          publisher: {
            '@type': 'Organization',
            name: 'Breathing Flame',
            logo: 'https://breathingflame.com/logo.png'
          },
          datePublished: post.publishedAt,
          url: `https://breathingflame.com/article/${post.slug}`,
          ...(post.tags && { keywords: post.tags.join(', ') }),
          ...(post.readingTime && { timeRequired: `PT${post.readingTime}M` })
        }
      })) || []
    }
  }

  function onTagClick(tag: string) {
    setActiveTag(tag)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'resources_filter', { tag })
    }
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'resources_search', { query, resultsCount: total })
    }
  }

  if (pageLoading) {
    return <LoadingWrapper />
  }

  if (pageError || !page) {
    return <ErrorState message="Failed to load resources page" />
  }

  return (
    <>
      <SEO data={{ 
        title: page.seo?.title, 
        description: page.seo?.description, 
        image: page.seo?.ogImage, 
        structuredData: [collectionLd] 
      }} />

      {/* Hero Section */}
      {(page.sections?.hero?.visible !== false) && page.sections?.hero && (
        <section className={`section ${styles.heroSection}`}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>{page.sections.hero.headline}</h1>
              <p className={styles.heroSubtext}>{page.sections.hero.subtext}</p>
            </div>
          </div>
        </section>
      )}

      {/* Intro Section */}
      {(page.sections?.intro?.visible !== false) && page.sections?.intro && (
        <section className={`section ${styles.introSection}`}>
          <div className="container">
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>{page.sections.intro.title}</h2>
              <p className={styles.introBody}>{page.sections.intro.body}</p>
            </div>
          </div>
        </section>
      )}

      {/* Articles Intro Section */}
      {(page.sections?.articlesIntro?.visible !== false) && page.sections?.articlesIntro && (
        <section className={`section ${styles.articlesIntroSection}`}>
          <div className="container">
            <div className={styles.articlesIntroContent}>
              <h2 className={styles.articlesIntroTitle}>{page.sections.articlesIntro.headline}</h2>
              <p className={styles.articlesIntroSubtext}>{page.sections.articlesIntro.subtext}</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Post Section */}
      {(page.sections?.featuredPostRef?.visible !== false) && page.sections?.featuredPostRef?.postRef && posts && (
        <section className={`section ${styles.featuredSection}`}>
          <div className="container">
            {posts.filter(p => p.id === page.sections.featuredPostRef.postRef).map(p => (
              <a key={p.id} href={`/article/${p.slug}`} className={styles.featuredCard}>
                {p.cover && <img src={p.cover} alt={p.title} className={styles.featuredImage} />}
                <div className={styles.featuredContent}>
                  <div className={styles.featuredEyebrow}>{p.tags?.[0]}</div>
                  <h3 className={styles.featuredTitle}>{p.title}</h3>
                  <p className={styles.featuredExcerpt}>{p.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Controls Section */}
      <div className="container" style={{ paddingTop: 'var(--spacing-2)', paddingBottom: 'var(--spacing-2)' }}>
        <div className={styles.controlsContainer}>
            {(page.sections?.filters?.visible !== false) && page.sections?.filters?.enabled !== false && (
              <div role="tablist" aria-label={page.sections?.filters?.ariaLabel || 'Filter articles'} className={styles.filterTabs}>
                {tags.map(tag => (
                  <button
                    key={tag}
                    role="tab"
                    aria-selected={activeTag === tag}
                    className={`${styles.filterTab} ${activeTag === tag ? styles.active : ''}`}
                    onClick={() => onTagClick(tag)}
                  >
                    {capitalizeTag(tag)}
                  </button>
                ))}
              </div>
            )}
            {(page.sections?.search?.visible !== false) && page.sections?.search?.enabled !== false && (
              <form onSubmit={onSearchSubmit} aria-label={page.sections?.search?.ariaLabel || 'Search resources'} className={styles.searchForm}>
                <label htmlFor="resources-search" className="sr-only">{page.sections?.search?.label || 'Search articles'}</label>
                <input 
                  id="resources-search" 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  placeholder={page.sections?.search?.placeholder} 
                  className={styles.searchInput}
                />
              </form>
            )}
        </div>
      </div>

      {/* Articles Grid Section */}
      <section className={`section ${styles.articlesSection}`}>
        <div className="container">
          {postsLoading ? (
            <LoadingWrapper />
          ) : postsError ? (
            <ErrorState message="Failed to load articles" />
          ) : posts && posts.length > 0 ? (
            <>
              <div className={styles.articlesGrid}>
                {posts.map(p => (
                  <a key={p.id} href={`/article/${p.slug}`} className={styles.articleCard} aria-label={`Open article ${p.title}`}>
                    {p.cover && <img src={p.cover} alt={p.title} className={styles.articleImage} />}
                    <div className={styles.articleContent}>
                      <div className={styles.articleEyebrow}>{p.tags?.[0]}</div>
                      <h3 className={styles.articleTitle}>{p.title}</h3>
                      <p className={styles.articleExcerpt}>{p.excerpt}</p>
                      <div className={styles.articleMeta}>
                        <span>{formatDate(p.publishedAt)}</span>
                        <span>·</span>
                        <span>{getReadTime(p.content)} min read</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {visible < (total || 0) && (
                <div className={styles.loadMoreSection}>
                  <button className={styles.loadMoreButton} onClick={() => setVisible(v => v + 12)}>
                    Load more
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyStateTitle}>{page.sections?.emptyState?.title || 'No posts found'}</h3>
              <p className={styles.emptyStateSubtext}>{page.sections?.emptyState?.subtext || 'Try a different tag or clear the search.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      {(page.sections?.newsletter?.visible !== false) && page.sections?.newsletter?.enabled !== false && (
        <section id={page.sections?.newsletter?.idAnchor || 'newsletter'} className={`section ${styles.newsletterSection}`}>
      <div className="container">
            <div className={styles.newsletterCard}>
              <h2 className={styles.newsletterTitle}>{page.sections.newsletter.headline}</h2>
              <p className={styles.newsletterSubtext}>{page.sections.newsletter.subtext}</p>
              <a 
                className={styles.newsletterButton} 
                href={page.sections.newsletter.ctaUrl} 
                onClick={() => { 
                  if (window?.gtag) window.gtag('event','newsletter_click',{ location:'resources' }) 
                }}
              >
                {page.sections.newsletter.ctaLabel}
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

