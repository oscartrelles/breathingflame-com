import { useState } from 'react'
import { SEO } from '@/components/SEO'
import { usePageContact } from '@/hooks/useFirestore'

export function Contact() {
  const { data: page } = usePageContact()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', type: 'General', message: '' })

  if (!page) return null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return setStatus('error')
    try {
      setLoading(true)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const json = await res.json()
      if (json.ok) {
        setStatus('success')
        setForm({ name: '', email: '', type: 'General', message: '' })
        // @ts-ignore
        if (window?.gtag) window.gtag('event','contact_submit',{ type: form.type })
      } else {
        setStatus('error')
        // @ts-ignore
        if (window?.gtag) window.gtag('event','contact_error',{ type: form.type })
      }
    } catch {
      setStatus('error')
      // @ts-ignore
      if (window?.gtag) window.gtag('event','contact_error',{ type: form.type })
    } finally {
      setLoading(false)
    }
  }

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

      {/* Form */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 'var(--spacing-6)', maxWidth: 760, margin: '0 auto' }}>
            <h3 className="heading heading--md" style={{ color: 'var(--color-primary)' }}>{page.form.headline}</h3>
            {page.form.subtext && <p className="text--sm" style={{ color: 'var(--color-text-secondary)' }}>{page.form.subtext}</p>}
            
            {status === 'success' && <div role="status" className="alert alert--success" style={{ marginTop: 'var(--spacing-4)' }}>{page.form.successMessage}</div>}
            {status === 'error' && <div role="alert" className="alert alert--error" style={{ marginTop: 'var(--spacing-4)' }}>{page.form.errorMessage}</div>}

            <form onSubmit={onSubmit} style={{ marginTop: 'var(--spacing-6)', display: 'grid', gap: 'var(--spacing-4)' }}>
              <div>
                <label htmlFor="name" className="label">Name</label>
                <input id="name" className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input id="email" type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="type" className="label">Inquiry type</label>
                <select id="type" className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option>Individual</option>
                  <option>Organization</option>
                  <option>General</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="label">Message</label>
                <textarea id="message" className="input" rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button className="btn" disabled={loading} aria-busy={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
            </form>

            <div className="text--sm" style={{ marginTop: 'var(--spacing-6)' }}>
              Or email us at <a href="mailto:hello@breathingflame.com">hello@breathingflame.com</a> · WhatsApp community: <a href={import.meta.env.VITE_WHATSAPP_INDIVIDUALS || '#'} target="_blank" rel="noopener noreferrer">Join</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

