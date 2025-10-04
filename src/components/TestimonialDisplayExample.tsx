import { TestimonialComponent } from './TestimonialComponent'

/**
 * Example usage of the unified TestimonialComponent
 * This shows how to use the component with different modes and configurations
 */
export function TestimonialDisplayExample() {
  return (
    <div>
      {/* Basic grid layout */}
      <TestimonialComponent
        mode="grid"
        maxCount={6}
        title="What People Say"
        subtext="Real testimonials from our clients"
        showRating={true}
        showLanguage={true}
      />

      {/* Carousel with touch navigation */}
      <TestimonialComponent
        mode="carousel"
        maxCount={4}
        title="Featured Reviews"
        subtext="Hand-picked testimonials"
        showRating={true}
        showTags={true}
        showLanguage={true}
        context={{ audience: 'individuals' }}
      />

      {/* List layout for specific program */}
      <TestimonialComponent
        mode="grid"
        maxCount={3}
        title="Program Testimonials"
        subtext="What participants say about our programs"
        showRating={true}
        showSource={true}
        context={{ programSlug: 'reverse-aging-challenge' }}
      />

      {/* Experience-specific testimonials */}
      <TestimonialComponent
        mode="grid"
        maxCount={4}
        title="Experience Reviews"
        subtext="Feedback from our workshop participants"
        showRating={true}
        showLanguage={true}
        context={{ experienceSlug: 'wim-hof-method' }}
      />
    </div>
  )
}


