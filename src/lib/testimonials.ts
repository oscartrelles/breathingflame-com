export type Testimonial = {
  id: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  text: string;
  rating?: number;
  tags?: string[];
  featured?: boolean;
  refs?: {
    programSlugs?: string[];
    experienceSlugs?: string[];
    solutionSlugs?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
};

export type TestimonialSelectionOptions = {
  route: string;
  context?: {
    audience?: "individuals" | "organizations";
    programSlug?: string;
    experienceSlug?: string;
    solutionSlug?: string;
  };
  minRating?: number;
  maxCount?: number;
  preferFeatured?: boolean;
  diversity?: {
    byAuthor?: boolean;
    byTag?: boolean;
  };
};

export function selectTestimonials(
  allTestimonials: Testimonial[], 
  opts: TestimonialSelectionOptions
): Testimonial[] {
  let filtered = [...allTestimonials];

  // Filter by rating
  if (opts.minRating) {
    filtered = filtered.filter(t => (t.rating || 5) >= opts.minRating!);
  }

  // Filter by context
  if (opts.context) {
    if (opts.context.audience) {
      // Filter by audience tags or refs
      filtered = filtered.filter(t => {
        const tags = t.tags || [];
        const refs = t.refs || {};
        
        if (opts.context!.audience === 'individuals') {
          return tags.includes('individuals') || 
                 tags.includes('personal') || 
                 refs.programSlugs?.length > 0;
        } else if (opts.context!.audience === 'organizations') {
          return tags.includes('organizations') || 
                 tags.includes('teams') || 
                 tags.includes('leadership') ||
                 refs.solutionSlugs?.length > 0;
        }
        return true;
      });
    }

    if (opts.context.programSlug) {
      filtered = filtered.filter(t => 
        t.refs?.programSlugs?.includes(opts.context!.programSlug!)
      );
    }

    if (opts.context.experienceSlug) {
      filtered = filtered.filter(t => 
        t.refs?.experienceSlugs?.includes(opts.context!.experienceSlug!)
      );
    }

    if (opts.context.solutionSlug) {
      filtered = filtered.filter(t => 
        t.refs?.solutionSlugs?.includes(opts.context!.solutionSlug!)
      );
    }
  }

  // Sort by featured status if preferFeatured is true
  if (opts.preferFeatured) {
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }

  // Apply diversity rules
  if (opts.diversity?.byAuthor) {
    const seenAuthors = new Set();
    filtered = filtered.filter(t => {
      if (seenAuthors.has(t.author.name)) return false;
      seenAuthors.add(t.author.name);
      return true;
    });
  }

  // Limit to maxCount
  if (opts.maxCount) {
    filtered = filtered.slice(0, opts.maxCount);
  }

  return filtered;
}