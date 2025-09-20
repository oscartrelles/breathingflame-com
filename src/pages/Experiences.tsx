import { useParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'

export function Experiences() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <>
      <SEO 
        data={{
          title: `${slug?.replace(/-/g, ' ')} - Breathing Flame`,
          description: `Experience our ${slug?.replace(/-/g, ' ')} program.`,
        }}
      />
      <div className="container">
        <h1>Experience: {slug?.replace(/-/g, ' ')}</h1>
        <p>Experience details will be implemented here.</p>
      </div>
    </>
  )
}

