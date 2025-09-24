import { useParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'

export function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <>
      <SEO 
        data={{
          title: `${slug?.replace(/-/g, ' ')} - Breathing Flame Resources`,
          description: `Read our article: ${slug?.replace(/-/g, ' ')}.`,
        }}
      />
      <div className="container">
        <h1>Resource: {slug?.replace(/-/g, ' ')}</h1>
        {/* Placeholder content now moved to dedicated pages */}
        <p>Detailed resource content will appear here.</p>
      </div>
    </>
  )
}

