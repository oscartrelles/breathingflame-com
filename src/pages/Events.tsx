import { SEO } from '@/components/SEO'
import { usePageEvents } from '@/hooks/useFirestore'
import { LumaEmbed } from '@/components/LumaEmbed'
import { HeroSection } from '@/components/HeroSection'

export function Events() {
  const { data: page } = usePageEvents()
  if (!page) return null

  return (
    <>
      <SEO data={{ title: page.seo.title, description: page.seo.description, image: page.seo.ogImage }} />

      {/* Hero */}
      {page.sections?.hero?.visible !== false && (
        <HeroSection
          title={page.sections.hero.headline}
          subtitle={page.sections.hero.subtext}
          media={page.sections.hero.media}
          ctas={page.sections.hero.ctas}
          className="events-hero"
        />
      )}

      {/* Intro */}
      {(page.sections?.intro?.visible !== false) && page.sections?.intro && (
      <section className="section">
        <div className="container">
          <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)' }}>{page.sections.intro.title}</h2>
          <div className="prose">
            {page.sections.intro.body.split('\n\n').map((p: string, i: number) => (<p key={i}>{p}</p>))}
          </div>
        </div>
      </section>
      )}

      {/* Pinned */}
      {page.pinned && page.pinned.length > 0 && (
        <section className="section">
          <div className="container grid" style={{ gap: 'var(--spacing-6)', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            {page.pinned.map((evt: any, i: number) => (
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
      {(page.sections?.embed?.visible !== false) && page.sections?.embed && (
      <section className="section">
        <div className="container">
          <LumaEmbed
            src={page.sections.embed.url}
            height={page.sections.embed.height ?? 900}
            border={page.sections.embed.border ?? '1px solid #bfcbda88'}
            borderRadius={page.sections.embed.borderRadius ?? '8px'}
            title={page.sections.embed?.title || "Breathing Flame Events"}
          />
          {(page.sections?.fallbackCTA?.visible !== false) && page.sections?.fallbackCTA && (
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-6)' }}>
              <a className="btn" href={page.sections.fallbackCTA.url} target="_blank" rel="noopener noreferrer" aria-label={page.sections.fallbackCTA.label}>{page.sections.fallbackCTA.label}</a>
            </div>
          )}
        </div>
      </section>
      )}
    </>
  )
}

