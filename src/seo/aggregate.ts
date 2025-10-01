import { Testimonial } from '@/lib/testimonials'

export function getAggregateFromTestimonials(
  all: Testimonial[], 
  filter?: (t: Testimonial) => boolean
) {
  const pool = filter ? all.filter(filter) : all;
  const rated = pool.filter(t => typeof t.rating === "number");
  
  if (!rated.length) return null;
  
  const ratingValue = (rated.reduce((s, t) => s + (t.rating as number), 0) / rated.length).toFixed(2);
  
  return { 
    ratingValue: parseFloat(ratingValue), 
    reviewCount: rated.length 
  };
}

export function getTestimonialsJSONLD(testimonials: Testimonial[]) {
  const aggregate = getAggregateFromTestimonials(testimonials, t => (t.rating || 5) >= 4);
  
  const baseJSONLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Testimonials",
    "url": "https://breathingflame.com/testimonials",
    "about": ["Resilience", "Clarity", "Transformation"]
  };

  if (aggregate) {
    const aggregateJSONLD = {
      "@context": "https://schema.org",
      "@type": "AggregateRating",
      "itemReviewed": { 
        "@type": "Organization", 
        "name": "Breathing Flame" 
      },
      "ratingValue": aggregate.ratingValue,
      "reviewCount": aggregate.reviewCount
    };

    return [baseJSONLD, aggregateJSONLD];
  }

  return [baseJSONLD];
}
