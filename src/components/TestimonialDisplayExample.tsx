import { TestimonialDisplay } from './TestimonialDisplay'

/**
 * Example usage of the updated TestimonialDisplay component
 * This shows how to use the component with the new data structure and features
 */
export function TestimonialDisplayExample() {
  return (
    <div>
      {/* Basic grid layout */}
      <TestimonialDisplay
        layout="grid"
        maxItems={6}
        title="What People Say"
        subtext="Real testimonials from our clients"
        showRating={true}
        showLanguage={true}
      />

      {/* Carousel with touch navigation */}
      <TestimonialDisplay
        layout="carousel"
        maxItems={4}
        title="Featured Reviews"
        subtext="Hand-picked testimonials"
        showRating={true}
        showTags={true}
        showLanguage={true}
        context={{ audience: 'individuals' }}
      />

      {/* List layout for specific program */}
      <TestimonialDisplay
        layout="list"
        maxItems={3}
        title="Program Testimonials"
        subtext="What participants say about our programs"
        showRating={true}
        showSource={true}
        context={{ programSlug: 'reverse-aging-challenge' }}
      />

      {/* Experience-specific testimonials */}
      <TestimonialDisplay
        layout="grid"
        maxItems={4}
        title="Experience Reviews"
        subtext="Feedback from our workshop participants"
        showRating={true}
        showLanguage={true}
        context={{ experienceSlug: 'wim-hof-method' }}
      />
    </div>
  )
}

