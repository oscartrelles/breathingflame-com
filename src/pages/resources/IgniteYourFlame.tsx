import { useState } from 'react'
import { SEO } from '@/components/SEO'
import { HeroSection } from '@/components/HeroSection'
import { AssessmentOverlay } from '@/components/AssessmentOverlay'

export function IgniteYourFlame() {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)

  return (
    <>
      <SEO
        data={{
          title: 'Ignite Your Flame - Self Assessment',
          description: 'Take the Ignite Your Flame self-assessment to begin your transformation.',
        }}
      />
      <HeroSection
        title="Ignite Your Flame"
        subtitle="Discover your inner fire and unlock your potential with our comprehensive assessment"
        videoId=""
        videoEmbed=""
        imageUrl=""
        ctas={[
          {
            label: "Start Assessment",
            pathOrUrl: "#",
            external: false,
            onClick: () => setIsAssessmentOpen(true)
          },
          {
            label: "Book Consultation",
            pathOrUrl: "/contact",
            external: false
          }
        ]}
        className="ignite-your-flame-hero"
      />
      
      <AssessmentOverlay
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        assessmentUrl="https://l8ndje95gwz.typeform.com/to/SGtc6uuL"
        title="Ignite Your Flame Assessment"
      />
    </>
  )
}


