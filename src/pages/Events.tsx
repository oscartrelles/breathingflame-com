import { SEO } from '@/components/SEO'
import { usePageEvents } from '@/hooks/useFirestore'
import { LumaEmbed } from '@/components/LumaEmbed'

export function Events() {
  const { data: page } = usePageEvents()
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
          <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)' }}>{page.intro.title}</h2>
          <div className="prose">
            {page.intro.body.split('\n\n').map((p, i) => (<p key={i}>{p}</p>))}
          </div>
        </div>
      </section>

      {/* Pinned */}
      {page.pinned && page.pinned.length > 0 && (
        <section className="section">
          <div className="container grid" style={{ gap: 'var(--spacing-6)', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            {page.pinned.map((evt, i) => (
              <div key={i} className="card" style={{ padding: 'var(--spacing-6)' }}>
                <h3 className="heading heading--md" style={{ color: 'var(--color-text-primary)' }}>{evt.title}</h3>
                {(evt.date || evt.location) && (
                  <p className="text--sm" style={{ color: 'var(--color-text-muted)' }}>
                    {evt.date}{evt.date && evt.location ? ' · ' : ''}{evt.location}
                  </p>
                )}
                {evt.summary && <p style={{ marginTop: 'var(--spacing-3)' }}>{evt.summary}</p>}
                <a className="btn" href={evt.url} target="_blank" rel="noopener noreferrer" aria-label={`${page.cta?.learnMoreAriaLabel || 'Learn more about'} ${evt.title}`} style={{ marginTop: 'var(--spacing-4)' }}>{page.cta?.learnMoreLabel || 'Learn more'}</a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Embed */}
      <section className="section">
        <div className="container">
          <LumaEmbed
            src={page.embed.url}
            height={page.embed.height ?? 900}
            border={page.embed.border ?? '1px solid #bfcbda88'}
            borderRadius={page.embed.borderRadius ?? '8px'}
            title={page.embed?.title || "Breathing Flame Events"}
          />
          {page.fallbackCTA && (
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-6)' }}>
              <a className="btn" href={page.fallbackCTA.url} target="_blank" rel="noopener noreferrer" aria-label={page.fallbackCTA.label}>{page.fallbackCTA.label}</a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

