import { useState } from 'react'
import { SEO } from '@/components/SEO'
import { HeroSection } from '@/components/HeroSection'
import { AssessmentOverlay } from '@/components/AssessmentOverlay'

export function PeakEnergyProfiler() {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)

  return (
    <>
      <SEO
        data={{
          title: 'Peak Energy Profiler - Self Assessment',
          description: 'Take the Peak Energy Profiler to understand and optimize your energy.',
        }}
      />
      <HeroSection
        title="Peak Energy Profiler"
        subtitle="Understand your energy patterns and optimize your performance"
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
        className="peak-energy-profiler-hero"
      />
      
      <AssessmentOverlay
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        assessmentUrl="https://l8ndje95gwz.typeform.com/to/UeisAiij"
        title="Peak Energy Profiler Assessment"
      />
    </>
  )
}


