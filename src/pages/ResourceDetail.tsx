import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { usePost } from '@/hooks/useFirestore'
import { formatDate, getReadTime } from '@/utils/format'

export function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post } = usePost(slug || '')
  if (!post) return null

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      window.gtag('event','article_view',{ slug: post.slug, title: post.title, tags: post.tags })
    }
  }, [post.slug])

  const seoTitle = post.og?.title || post.seo?.metaTitle || post.title
  const seoDesc = post.og?.description || post.seo?.metaDescription || post.excerpt
  const seoImage = post.og?.image || post.seo?.ogImage || post.cover || post.featuredImage

  const articleLd = {
    '@context':'https://schema.org',
    '@type':'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type':'Person', name: post.author?.name || 'Oscar Trelles' },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: seoImage,
    mainEntityOfPage: { '@type':'WebPage', '@id': post.canonicalUrl || `https://breathingflame.com/resources/${post.slug}` }
  }
  const videoLd = post.videoId ? {
    '@context':'https://schema.org',
    '@type':'VideoObject',
    name: post.title,
    description: post.excerpt,
    thumbnailUrl: seoImage,
    uploadDate: post.publishedAt,
    publisher: { '@type':'Organization', name:'Breathing Flame' }
  } : null

  return (
    <>
      <SEO data={{ title: seoTitle, description: seoDesc, image: seoImage, canonical: post.canonicalUrl, structuredData: videoLd ? [articleLd, videoLd] : [articleLd] }} />

      <div className="container">
        <h1 className="heading heading--xl" style={{ color: 'var(--color-primary)' }}>{post.title}</h1>
        <div className="text--sm" style={{ color: 'var(--color-text-muted)' }}>
          {post.author?.name} · {formatDate(post.publishedAt)} · {getReadTime(post.content)} min read
        </div>
        {post.cover && (
          <img src={post.cover} alt={post.title} style={{ width:'100%', height: 380, objectFit:'cover', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0' }} />
        )}
        {post.videoId && (
          <div className="card" style={{ padding: 0, overflow:'hidden', marginBottom: 'var(--spacing-6)' }}>
            <iframe
              src={`https://www.youtube.com/embed/${post.videoId}`}
              title={post.title}
              width="100%"
              height={420}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
        <div className="prose">
          {post.content.split('\n\n').map((p, i) => (<p key={i}>{p}</p>))}
        </div>
        
        {/* Simple in-article CTA heuristic */}
        <div className="card" style={{ padding: 'var(--spacing-6)', marginTop: 'var(--spacing-8)' }}>
          {post.tags?.includes('Longevity') ? (
            <a className="btn" href="/programs/reverse-aging-challenge">Explore the Reverse Aging Challenge</a>
          ) : post.tags?.includes('Resilience') ? (
            <a className="btn" href="/events">See upcoming experiences</a>
          ) : (
            <a className="btn" href="/programs">Explore programs</a>
          )}
        </div>
      </div>
    </>
  )
}

