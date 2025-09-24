import { SEO } from '@/components/SEO'
import { TypeformButton } from '@/components/TypeformButton'

export function PeakEnergyProfiler() {
  return (
    <>
      <SEO
        data={{
          title: 'Peak Energy Profiler - Self Assessment',
          description: 'Take the Peak Energy Profiler to understand and optimize your energy.',
        }}
      />
      <section className="section">
        <div className="container">
          <div>
            <h1>Peak Energy Profiler</h1>
            <p>
              Understand your energy patterns and optimize your performance. This assessment 
              reveals your peak energy times, stress triggers, and the strategies that work 
              best for your unique energy profile.
            </p>
            <p>
              Complete the profiler to discover your energy blueprint and learn how to 
              harness your natural rhythms for peak performance.
            </p>
          </div>
        </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
            <a href="/free-consultation" className="btn btn--on-accent btn--primary btn--large">Book Consultation</a>
            <div>
              <TypeformButton liveId="01HYANYSX08GPWMJVX3S9HX5N2" />
              <style>{`.tf-v1-button, [data-tf-live] .tf-v1-button { border-radius: 16px !important; padding: 16px 32px !important; background:#000 !important; color:#fff !important; border:1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important; }`}</style>
            </div>
          </div>
      </section>
    </>
  )
}


