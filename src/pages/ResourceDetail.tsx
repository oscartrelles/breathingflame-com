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
        <p>Resource detail page will be implemented here.</p>
      </div>
    </>
  )
}

