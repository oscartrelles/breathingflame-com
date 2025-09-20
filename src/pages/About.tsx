import { SEO } from '@/components/SEO'

export function About() {
  return (
    <>
      <SEO 
        data={{
          title: 'About - Breathing Flame',
          description: 'Learn about our mission, approach, and the team behind Breathing Flame. Discover how we help individuals and organizations transform through breathwork and mindfulness.',
        }}
      />
      <div className="container">
        <h1>About</h1>
        <p>About page will be implemented here.</p>
      </div>
    </>
  )
}

