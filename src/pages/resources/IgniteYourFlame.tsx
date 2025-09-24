import { SEO } from '@/components/SEO'
import { TypeformButton } from '@/components/TypeformButton'

export function IgniteYourFlame() {
  return (
    <>
      <SEO
        data={{
          title: 'Ignite Your Flame - Self Assessment',
          description: 'Take the Ignite Your Flame self-assessment to begin your transformation.',
        }}
      />
      <section className="section">
        <div className="container">
          <div>
            <h1>Ignite Your Flame</h1>
            <p>
              Discover your inner fire and unlock your potential with our comprehensive assessment. 
              This personalized evaluation will help you identify your strengths, challenges, and 
              the path to transformation.
            </p>
            <p>
              Take the assessment to begin your transformation journey. Your results will be 
              delivered via email with personalized insights and recommendations.
            </p>
          </div>
        </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
            <a href="/free-consultation" className="btn btn--on-accent btn--primary btn--large">Book Consultation</a>
            <div>
              <TypeformButton liveId="01HN0TAHY7EJPV6HY0GAA6DJ0D" />
              {/* The live script renders a button; ensure it inherits accent style */}
              <style>{`.tf-v1-button, [data-tf-live] .tf-v1-button { border-radius: 16px !important; padding: 16px 32px !important; background:#000 !important; color:#fff !important; border:1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important; }`}</style>
            </div>
          </div>
      </section>
    </>
  )
}


