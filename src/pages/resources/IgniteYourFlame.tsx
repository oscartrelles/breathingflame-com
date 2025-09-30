import { useState } from 'react'
import { SEO } from '@/components/SEO'
import { HeroSection } from '@/components/HeroSection'
import { AssessmentOverlay } from '@/components/AssessmentOverlay'
import { useResourceIgniteYourFlame } from '@/hooks/useFirestore'

export function IgniteYourFlame() {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const { data: pageData } = useResourceIgniteYourFlame()

  return (
    <>
      <SEO
        data={{
          title: pageData?.seo?.title,
          description: pageData?.seo?.description,
        }}
      />
      <HeroSection
        title={pageData?.hero?.headline}
        subtitle={pageData?.hero?.subtext}
        videoId={pageData?.hero?.videoId || ""}
        videoEmbed={pageData?.hero?.videoEmbed || ""}
        imageUrl={pageData?.hero?.imageUrl || ""}
        ctas={pageData?.hero?.ctas?.map((cta: any) => ({
          ...cta,
          onClick: cta.label === 'Start Assessment' ? () => setIsAssessmentOpen(true) : undefined
        }))}
        className="ignite-your-flame-hero"
      />
      
      <AssessmentOverlay
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        assessmentUrl={pageData?.assessmentUrl}
        title={pageData?.assessmentTitle}
      />
    </>
  )
}


