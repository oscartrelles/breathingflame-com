import { SEO } from '@/components/SEO'

export function FreeConsultation() {
  return (
    <>
      <SEO 
        data={{
          title: 'Free Consultation - Breathing Flame',
          description: 'Book your free consultation to get started with Unblocked in Ten Weeks.',
        }}
      />
      <div className="container">
        <h1>Free Consultation</h1>
        <div style={{ position: 'relative', width: '100%', minHeight: 800 }}>
          <iframe
            src="https://koalendar.com/e/free-consultation-unblocked?embed=true"
            width="100%"
            height="800px"
            frameBorder={0}
          />
        </div>
      </div>
    </>
  )
}


