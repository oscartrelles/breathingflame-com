import { useParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'

export function Programs() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <>
      <SEO 
        data={{
          title: `${slug?.replace(/-/g, ' ')} - Breathing Flame`,
          description: `Learn more about our ${slug?.replace(/-/g, ' ')} program.`,
        }}
      />
      <div className="container">
        <h1>Program: {slug?.replace(/-/g, ' ')}</h1>
        <p>Program details will be implemented here.</p>
      </div>
    </>
  )
}

