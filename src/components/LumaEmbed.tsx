import { useEffect, useRef } from 'react'

type Props = {
  src: string
  height?: number
  border?: string
  borderRadius?: string
  title?: string
}

export function LumaEmbed({ src, height = 900, border = '1px solid #bfcbda88', borderRadius = '8px', title = 'Breathing Flame Events' }: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const hasFiredRef = useRef(false)

  useEffect(() => {
    const el = iframeRef.current
    if (!el || hasFiredRef.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasFiredRef.current) {
          hasFiredRef.current = true
          try {
            // Fire GA4 event if gtag is available
            // @ts-ignore
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
              // @ts-ignore
              window.gtag('event', 'events_iframe_view', { src })
            }
          } catch {}
          observer.disconnect()
        }
      })
    }, { threshold: 0.2 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [src])

  const style: React.CSSProperties = {
    width: '100%',
    height,
    minHeight: 600,
    border,
    borderRadius,
    background: 'var(--color-background)',
  }

  return (
    <div className="card" style={{ padding: 'var(--spacing-4)' }}>
      <iframe
        ref={iframeRef}
        src={src}
        style={style}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        aria-label={title}
        width="100%"
      />
      <noscript>
        <p>
          JavaScript is required to view the embedded calendar.{' '}
          <a href={src} target="_blank" rel="noopener noreferrer">Open on Luma</a>.
        </p>
      </noscript>
    </div>
  )
}


