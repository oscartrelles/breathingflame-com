import { buildCollection, buildProperty, EntityReference } from 'firecms'
import { 
  Settings, 
  Navigation, 
  Home, 
  Program, 
  Experience, 
  Post, 
  Testimonial, 
  CaseStudy, 
  Event,
  FAQ 
} from '@/types'

// Settings Collection
export const settingsCollection = buildCollection<Settings>({
  name: 'Settings',
  singularName: 'Settings',
  path: 'settings',
  icon: 'Settings',
  description: 'Site-wide configuration and settings',
  permissions: ({ user }) => ({
    read: true,
    write: user?.role === 'admin'
  }),
  properties: {
    siteTitle: buildProperty({
      dataType: 'string',
      name: 'Site Title',
      description: 'Main site title displayed in header and meta tags'
    }),
    masterTagline: buildProperty({
      dataType: 'string',
      name: 'Master Tagline',
      description: 'Primary tagline: "Resilience. Clarity. Transformation."'
    }),
    contact: buildProperty({
      dataType: 'map',
      name: 'Contact Information',
      properties: {
        email: buildProperty({
          dataType: 'string',
          name: 'Email',
          validation: { required: true }
        }),
        phone: buildProperty({
          dataType: 'string',
          name: 'Phone',
          validation: { required: true }
        }),
        address: buildProperty({
          dataType: 'string',
          name: 'Address',
          multiline: true
        })
      }
    }),
    socials: buildProperty({
      dataType: 'map',
      name: 'Social Media Links',
      properties: {
        facebook: buildProperty({
          dataType: 'string',
          name: 'Facebook URL'
        }),
        instagram: buildProperty({
          dataType: 'string',
          name: 'Instagram URL'
        }),
        linkedin: buildProperty({
          dataType: 'string',
          name: 'LinkedIn URL'
        }),
        twitter: buildProperty({
          dataType: 'string',
          name: 'Twitter URL'
        }),
        youtube: buildProperty({
          dataType: 'string',
          name: 'YouTube URL'
        })
      }
    }),
    seoDefaults: buildProperty({
      dataType: 'map',
      name: 'SEO Defaults',
      properties: {
        metaTitle: buildProperty({
          dataType: 'string',
          name: 'Default Meta Title'
        }),
        metaDescription: buildProperty({
          dataType: 'string',
          name: 'Default Meta Description',
          multiline: true
        }),
        ogImage: buildProperty({
          dataType: 'string',
          name: 'Default OG Image URL'
        })
      }
    }),
    brandFlags: buildProperty({
      dataType: 'map',
      name: 'Brand Flags',
      properties: {
        showEvents: buildProperty({
          dataType: 'boolean',
          name: 'Show Events'
        }),
        showTestimonials: buildProperty({
          dataType: 'boolean',
          name: 'Show Testimonials'
        }),
        enableBlog: buildProperty({
          dataType: 'boolean',
          name: 'Enable Blog'
        }),
        enableWhatsApp: buildProperty({
          dataType: 'boolean',
          name: 'Enable WhatsApp'
        })
      }
    })
  }
})

// Navigation Collection
export const navigationCollection = buildCollection<Navigation>({
  name: 'Navigation',
  singularName: 'Navigation (singleton)',
  path: 'navigation',
  icon: 'Navigation',
  description: 'Site navigation configuration',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || ''),
    delete: user?.role === 'admin'
  }),
  properties: {
    headerLinks: buildProperty({
      dataType: 'array',
      name: 'Header Links',
      of: buildProperty({
        dataType: 'map',
        properties: {
          label: buildProperty({
            dataType: 'string',
            name: 'Label',
            validation: { required: true }
          }),
          pathOrUrl: buildProperty({
            dataType: 'string',
            name: 'Path or URL',
            validation: { required: true }
          }),
          external: buildProperty({
            dataType: 'boolean',
            name: 'External Link'
          }),
          order: buildProperty({
            dataType: 'number',
            name: 'Order'
          })
        }
      })
    }),
    primaryCTA: buildProperty({
      dataType: 'map',
      name: 'Primary CTA',
      properties: {
        label: buildProperty({
          dataType: 'string',
          name: 'Label'
        }),
        pathOrUrl: buildProperty({
          dataType: 'string',
          name: 'Path or URL'
        }),
        external: buildProperty({
          dataType: 'boolean',
          name: 'External Link'
        })
      }
    }),
    footerGroups: buildProperty({
      dataType: 'array',
      name: 'Footer Groups',
      of: buildProperty({
        dataType: 'map',
        properties: {
          title: buildProperty({
            dataType: 'string',
            name: 'Title',
            validation: { required: true }
          }),
          order: buildProperty({
            dataType: 'number',
            name: 'Order'
          }),
          links: buildProperty({
            dataType: 'array',
            name: 'Links',
            of: buildProperty({
              dataType: 'map',
              properties: {
                label: buildProperty({
                  dataType: 'string',
                  name: 'Label',
                  validation: { required: true }
                }),
                pathOrUrl: buildProperty({
                  dataType: 'string',
                  name: 'Path or URL',
                  validation: { required: true }
                }),
                external: buildProperty({
                  dataType: 'boolean',
                  name: 'External Link'
                }),
                order: buildProperty({
                  dataType: 'number',
                  name: 'Order'
                }),
                icon: buildProperty({
                  dataType: 'string',
                  name: 'Icon (optional)'
                })
              }
            })
          })
        }
      })
    }),
    anchors: buildProperty({
      dataType: 'array',
      name: 'Anchors',
      of: buildProperty({
        dataType: 'map',
        properties: {
          label: buildProperty({
            dataType: 'string',
            name: 'Label'
          }),
          hash: buildProperty({
            dataType: 'string',
            name: 'Hash'
          }),
          order: buildProperty({
            dataType: 'number',
            name: 'Order'
          })
        }
      })
    })
  }
})

// Home Collection
export const homeCollection = buildCollection<Home>({
  name: 'Home',
  singularName: 'Home',
  path: 'home',
  icon: 'Home',
  description: 'Homepage content configuration',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    hero: buildProperty({
      dataType: 'map',
      name: 'Hero Section',
      properties: {
        title: buildProperty({
          dataType: 'string',
          name: 'Hero Title'
        }),
        subtitle: buildProperty({
          dataType: 'string',
          name: 'Hero Subtitle'
        }),
        description: buildProperty({
          dataType: 'string',
          name: 'Hero Description',
          multiline: true
        }),
        backgroundImage: buildProperty({
          dataType: 'string',
          name: 'Background Image URL'
        }),
        backgroundVideo: buildProperty({
          dataType: 'string',
          name: 'Background Video URL'
        }),
        ctaText: buildProperty({
          dataType: 'string',
          name: 'CTA Button Text'
        }),
        ctaHref: buildProperty({
          dataType: 'string',
          name: 'CTA Button URL'
        }),
        overlayOpacity: buildProperty({
          dataType: 'number',
          name: 'Overlay Opacity',
          validation: { min: 0, max: 1 }
        })
      }
    }),
    pillars: buildProperty({
      dataType: 'array',
      name: 'Pillars',
      of: buildProperty({
        dataType: 'map',
        properties: {
          id: buildProperty({
            dataType: 'string',
            name: 'Pillar ID'
          }),
          title: buildProperty({
            dataType: 'string',
            name: 'Pillar Title'
          }),
          description: buildProperty({
            dataType: 'string',
            name: 'Pillar Description',
            multiline: true
          }),
          icon: buildProperty({
            dataType: 'string',
            name: 'Icon Name'
          }),
          color: buildProperty({
            dataType: 'string',
            name: 'Color'
          })
        }
      })
    }),
    featuredPrograms: buildProperty({
      dataType: 'array',
      name: 'Featured Programs',
      of: buildProperty({
        dataType: 'reference',
        path: 'programs',
        name: 'Program Reference'
      })
    }),
    featuredExperiences: buildProperty({
      dataType: 'array',
      name: 'Featured Experiences',
      of: buildProperty({
        dataType: 'reference',
        path: 'experiences',
        name: 'Experience Reference'
      })
    }),
    testimonialRefs: buildProperty({
      dataType: 'array',
      name: 'Featured Testimonials',
      of: buildProperty({
        dataType: 'reference',
        path: 'testimonials',
        name: 'Testimonial Reference'
      })
    }),
    orgPreviewCards: buildProperty({
      dataType: 'array',
      name: 'Organization Preview Cards',
      of: buildProperty({
        dataType: 'map',
        properties: {
          title: buildProperty({
            dataType: 'string',
            name: 'Card Title'
          }),
          description: buildProperty({
            dataType: 'string',
            name: 'Card Description',
            multiline: true
          }),
          image: buildProperty({
            dataType: 'string',
            name: 'Card Image URL'
          }),
          href: buildProperty({
            dataType: 'string',
            name: 'Card Link URL'
          })
        }
      })
    }),
    showEvents: buildProperty({
      dataType: 'boolean',
      name: 'Show Events Section'
    }),
    communityCTAs: buildProperty({
      dataType: 'array',
      name: 'Community CTAs',
      of: buildProperty({
        dataType: 'map',
        properties: {
          title: buildProperty({
            dataType: 'string',
            name: 'CTA Title'
          }),
          description: buildProperty({
            dataType: 'string',
            name: 'CTA Description',
            multiline: true
          }),
          buttonText: buildProperty({
            dataType: 'string',
            name: 'Button Text'
          }),
          buttonHref: buildProperty({
            dataType: 'string',
            name: 'Button URL'
          }),
          type: buildProperty({
            dataType: 'string',
            name: 'CTA Type',
            enumValues: {
              whatsapp: 'WhatsApp',
              email: 'Email',
              link: 'Link'
            }
          })
        }
      })
    }),
    typeforms: buildProperty({
      dataType: 'map',
      name: 'Typeform Configuration',
      description: 'Configure Typeform assessment URLs',
      properties: {
        igniteUrl: buildProperty({
          dataType: 'string',
          name: 'Ignite Your Flame URL',
          description: 'URL for the ignite-your-flame assessment'
        }),
        peakUrl: buildProperty({
          dataType: 'string',
          name: 'Peak Energy Profiler URL',
          description: 'URL for the peak-energy-profiler assessment'
        }),
        enabled: buildProperty({
          dataType: 'boolean',
          name: 'Enable Typeforms',
          description: 'Toggle to show/hide Typeform sections'
        })
      }
    })
  }
})

// Programs Collection
export const programsCollection = buildCollection<Program>({
  name: 'Programs',
  singularName: 'Program',
  path: 'programs',
  icon: 'School',
  description: 'Breathing Flame programs and courses',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    slug: buildProperty({
      dataType: 'string',
      name: 'Slug',
      description: 'URL-friendly identifier',
      validation: { required: true }
    }),
    title: buildProperty({
      dataType: 'string',
      name: 'Title',
      validation: { required: true }
    }),
    subtitle: buildProperty({
      dataType: 'string',
      name: 'Subtitle'
    }),
    description: buildProperty({
      dataType: 'string',
      name: 'Description',
      multiline: true
    }),
    shortDescription: buildProperty({
      dataType: 'string',
      name: 'Short Description',
      multiline: true
    }),
    image: buildProperty({
      dataType: 'string',
      name: 'Featured Image URL'
    }),
    duration: buildProperty({
      dataType: 'string',
      name: 'Duration'
    }),
    format: buildProperty({
      dataType: 'string',
      name: 'Format',
      enumValues: {
        online: 'Online',
        'in-person': 'In-Person',
        hybrid: 'Hybrid'
      }
    }),
    price: buildProperty({
      dataType: 'map',
      name: 'Pricing',
      properties: {
        individual: buildProperty({
          dataType: 'number',
          name: 'Individual Price'
        }),
        organization: buildProperty({
          dataType: 'number',
          name: 'Organization Price'
        })
      }
    }),
    outcomes: buildProperty({
      dataType: 'array',
      name: 'Outcomes',
      of: buildProperty({
        dataType: 'string',
        name: 'Outcome'
      })
    }),
    howItWorks: buildProperty({
      dataType: 'array',
      name: 'How It Works',
      of: buildProperty({
        dataType: 'map',
        properties: {
          step: buildProperty({
            dataType: 'number',
            name: 'Step Number'
          }),
          title: buildProperty({
            dataType: 'string',
            name: 'Step Title'
          }),
          description: buildProperty({
            dataType: 'string',
            name: 'Step Description',
            multiline: true
          })
        }
      })
    }),
    ctaText: buildProperty({
      dataType: 'string',
      name: 'CTA Button Text'
    }),
    ctaHref: buildProperty({
      dataType: 'string',
      name: 'CTA Button URL'
    }),
    faqs: buildProperty({
      dataType: 'array',
      name: 'FAQs',
      of: buildProperty({
        dataType: 'map',
        properties: {
          question: buildProperty({
            dataType: 'string',
            name: 'Question'
          }),
          answer: buildProperty({
            dataType: 'string',
            name: 'Answer',
            multiline: true
          }),
          order: buildProperty({
            dataType: 'number',
            name: 'Order'
          })
        }
      })
    }),
    order: buildProperty({
      dataType: 'number',
      name: 'Display Order'
    }),
    published: buildProperty({
      dataType: 'boolean',
      name: 'Published'
    }),
    featured: buildProperty({
      dataType: 'boolean',
      name: 'Featured'
    })
  }
})

// Testimonials Collection
export const testimonialsCollection = buildCollection<Testimonial>({
  name: 'Testimonials',
  singularName: 'Testimonial',
  path: 'testimonials',
  icon: 'Reviews',
  description: 'Customer testimonials and reviews',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    rating: buildProperty({
      dataType: 'number',
      name: 'Rating',
      validation: { min: 1, max: 5 }
    }),
    text: buildProperty({
      dataType: 'string',
      name: 'Testimonial Text',
      multiline: true,
      validation: { required: true }
    }),
    author: buildProperty({
      dataType: 'map',
      name: 'Author',
      properties: {
        name: buildProperty({
          dataType: 'string',
          name: 'Author Name',
          validation: { required: true }
        }),
        title: buildProperty({
          dataType: 'string',
          name: 'Author Title'
        }),
        company: buildProperty({
          dataType: 'string',
          name: 'Company'
        }),
        avatar: buildProperty({
          dataType: 'string',
          name: 'Avatar URL'
        })
      }
    }),
    sourceUrl: buildProperty({
      dataType: 'string',
      name: 'Source URL'
    }),
    tags: buildProperty({
      dataType: 'array',
      name: 'Tags',
      of: buildProperty({
        dataType: 'string',
        name: 'Tag'
      })
    }),
    featured: buildProperty({
      dataType: 'boolean',
      name: 'Featured'
    }),
    verified: buildProperty({
      dataType: 'boolean',
      name: 'Verified'
    }),
    createdAt: buildProperty({
      dataType: 'timestamp',
      name: 'Created At',
      autoValue: 'on_create'
    })
  }
})

// Posts Collection
export const postsCollection = buildCollection<Post>({
  name: 'Posts',
  singularName: 'Post',
  path: 'posts',
  icon: 'Article',
  description: 'Blog posts and articles',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    slug: buildProperty({
      dataType: 'string',
      name: 'Slug',
      description: 'URL-friendly identifier',
      validation: { required: true }
    }),
    title: buildProperty({
      dataType: 'string',
      name: 'Title',
      validation: { required: true }
    }),
    excerpt: buildProperty({
      dataType: 'string',
      name: 'Excerpt',
      multiline: true
    }),
    content: buildProperty({
      dataType: 'string',
      name: 'Content',
      multiline: true,
      markdown: true
    }),
    featuredImage: buildProperty({
      dataType: 'string',
      name: 'Featured Image URL'
    }),
    author: buildProperty({
      dataType: 'map',
      name: 'Author',
      properties: {
        name: buildProperty({
          dataType: 'string',
          name: 'Author Name',
          validation: { required: true }
        }),
        bio: buildProperty({
          dataType: 'string',
          name: 'Author Bio',
          multiline: true
        }),
        avatar: buildProperty({
          dataType: 'string',
          name: 'Avatar URL'
        })
      }
    }),
    tags: buildProperty({
      dataType: 'array',
      name: 'Tags',
      of: buildProperty({
        dataType: 'string',
        name: 'Tag'
      })
    }),
    published: buildProperty({
      dataType: 'boolean',
      name: 'Published'
    }),
    publishedAt: buildProperty({
      dataType: 'timestamp',
      name: 'Published At'
    }),
    updatedAt: buildProperty({
      dataType: 'timestamp',
      name: 'Updated At',
      autoValue: 'on_update'
    }),
    readingTime: buildProperty({
      dataType: 'number',
      name: 'Reading Time (minutes)'
    }),
    seo: buildProperty({
      dataType: 'map',
      name: 'SEO',
      properties: {
        metaTitle: buildProperty({
          dataType: 'string',
          name: 'Meta Title'
        }),
        metaDescription: buildProperty({
          dataType: 'string',
          name: 'Meta Description',
          multiline: true
        }),
        ogImage: buildProperty({
          dataType: 'string',
          name: 'OG Image URL'
        })
      }
    })
  }
})

// Experiences Collection (similar to Programs but for experiences)
export const experiencesCollection = buildCollection<Experience>({
  name: 'Experiences',
  singularName: 'Experience',
  path: 'experiences',
  icon: 'Spa',
  description: 'Breathing Flame experiences and workshops',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    slug: buildProperty({
      dataType: 'string',
      name: 'Slug',
      description: 'URL-friendly identifier',
      validation: { required: true }
    }),
    title: buildProperty({
      dataType: 'string',
      name: 'Title',
      validation: { required: true }
    }),
    subtitle: buildProperty({
      dataType: 'string',
      name: 'Subtitle'
    }),
    description: buildProperty({
      dataType: 'string',
      name: 'Description',
      multiline: true
    }),
    shortDescription: buildProperty({
      dataType: 'string',
      name: 'Short Description',
      multiline: true
    }),
    image: buildProperty({
      dataType: 'string',
      name: 'Featured Image URL'
    }),
    duration: buildProperty({
      dataType: 'string',
      name: 'Duration'
    }),
    format: buildProperty({
      dataType: 'string',
      name: 'Format',
      enumValues: {
        online: 'Online',
        'in-person': 'In-Person',
        hybrid: 'Hybrid'
      }
    }),
    price: buildProperty({
      dataType: 'map',
      name: 'Pricing',
      properties: {
        individual: buildProperty({
          dataType: 'number',
          name: 'Individual Price'
        }),
        organization: buildProperty({
          dataType: 'number',
          name: 'Organization Price'
        })
      }
    }),
    benefits: buildProperty({
      dataType: 'array',
      name: 'Benefits',
      of: buildProperty({
        dataType: 'string',
        name: 'Benefit'
      })
    }),
    whatToExpect: buildProperty({
      dataType: 'array',
      name: 'What to Expect',
      of: buildProperty({
        dataType: 'map',
        properties: {
          step: buildProperty({
            dataType: 'number',
            name: 'Step Number'
          }),
          title: buildProperty({
            dataType: 'string',
            name: 'Step Title'
          }),
          description: buildProperty({
            dataType: 'string',
            name: 'Step Description',
            multiline: true
          })
        }
      })
    }),
    ctaText: buildProperty({
      dataType: 'string',
      name: 'CTA Button Text'
    }),
    ctaHref: buildProperty({
      dataType: 'string',
      name: 'CTA Button URL'
    }),
    faqs: buildProperty({
      dataType: 'array',
      name: 'FAQs',
      of: buildProperty({
        dataType: 'map',
        properties: {
          question: buildProperty({
            dataType: 'string',
            name: 'Question'
          }),
          answer: buildProperty({
            dataType: 'string',
            name: 'Answer',
            multiline: true
          }),
          order: buildProperty({
            dataType: 'number',
            name: 'Order'
          })
        }
      })
    }),
    order: buildProperty({
      dataType: 'number',
      name: 'Display Order'
    }),
    published: buildProperty({
      dataType: 'boolean',
      name: 'Published'
    }),
    featured: buildProperty({
      dataType: 'boolean',
      name: 'Featured'
    })
  }
})

// Case Studies Collection
export const caseStudiesCollection = buildCollection<CaseStudy>({
  name: 'Case Studies',
  singularName: 'Case Study',
  path: 'caseStudies',
  icon: 'Business',
  description: 'B2B case studies and success stories',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    client: buildProperty({
      dataType: 'string',
      name: 'Client Name',
      validation: { required: true }
    }),
    industry: buildProperty({
      dataType: 'string',
      name: 'Industry'
    }),
    problem: buildProperty({
      dataType: 'string',
      name: 'Problem',
      multiline: true
    }),
    intervention: buildProperty({
      dataType: 'string',
      name: 'Intervention',
      multiline: true
    }),
    results: buildProperty({
      dataType: 'array',
      name: 'Results',
      of: buildProperty({
        dataType: 'map',
        properties: {
          metric: buildProperty({
            dataType: 'string',
            name: 'Metric'
          }),
          value: buildProperty({
            dataType: 'string',
            name: 'Value'
          }),
          description: buildProperty({
            dataType: 'string',
            name: 'Description'
          })
        }
      })
    }),
    quote: buildProperty({
      dataType: 'map',
      name: 'Client Quote',
      properties: {
        text: buildProperty({
          dataType: 'string',
          name: 'Quote Text',
          multiline: true
        }),
        author: buildProperty({
          dataType: 'string',
          name: 'Quote Author'
        }),
        title: buildProperty({
          dataType: 'string',
          name: 'Author Title'
        })
      }
    }),
    assetUrl: buildProperty({
      dataType: 'string',
      name: 'Asset URL'
    }),
    order: buildProperty({
      dataType: 'number',
      name: 'Display Order'
    }),
    featured: buildProperty({
      dataType: 'boolean',
      name: 'Featured'
    })
  }
})

// Events Collection (for pinned/manual events)
export const eventsCollection = buildCollection<Event>({
  name: 'Events',
  singularName: 'Event',
  path: 'eventsPinned',
  icon: 'Event',
  description: 'Manual event overrides and featured events',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    title: buildProperty({
      dataType: 'string',
      name: 'Event Title',
      validation: { required: true }
    }),
    description: buildProperty({
      dataType: 'string',
      name: 'Description',
      multiline: true
    }),
    startDate: buildProperty({
      dataType: 'timestamp',
      name: 'Start Date',
      validation: { required: true }
    }),
    endDate: buildProperty({
      dataType: 'timestamp',
      name: 'End Date',
      validation: { required: true }
    }),
    location: buildProperty({
      dataType: 'map',
      name: 'Location',
      properties: {
        name: buildProperty({
          dataType: 'string',
          name: 'Location Name'
        }),
        address: buildProperty({
          dataType: 'string',
          name: 'Address'
        }),
        city: buildProperty({
          dataType: 'string',
          name: 'City'
        }),
        country: buildProperty({
          dataType: 'string',
          name: 'Country'
        }),
        online: buildProperty({
          dataType: 'boolean',
          name: 'Online Event'
        })
      }
    }),
    price: buildProperty({
      dataType: 'map',
      name: 'Pricing',
      properties: {
        earlyBird: buildProperty({
          dataType: 'number',
          name: 'Early Bird Price'
        }),
        regular: buildProperty({
          dataType: 'number',
          name: 'Regular Price'
        }),
        currency: buildProperty({
          dataType: 'string',
          name: 'Currency',
          enumValues: {
            USD: 'USD',
            EUR: 'EUR',
            GBP: 'GBP'
          }
        })
      }
    }),
    capacity: buildProperty({
      dataType: 'number',
      name: 'Capacity'
    }),
    registrationUrl: buildProperty({
      dataType: 'string',
      name: 'Registration URL'
    }),
    image: buildProperty({
      dataType: 'string',
      name: 'Event Image URL'
    }),
    tags: buildProperty({
      dataType: 'array',
      name: 'Tags',
      of: buildProperty({
        dataType: 'string',
        name: 'Tag'
      })
    }),
    type: buildProperty({
      dataType: 'string',
      name: 'Event Type',
      enumValues: {
        individual: 'Individual',
        organization: 'Organization',
        retreat: 'Retreat'
      }
    }),
    featured: buildProperty({
      dataType: 'boolean',
      name: 'Featured'
    }),
    active: buildProperty({
      dataType: 'boolean',
      name: 'Active'
    })
  }
})

// Export all collections
export const collections = [
  settingsCollection,
  navigationCollection,
  homeCollection,
  programsCollection,
  experiencesCollection,
  postsCollection,
  testimonialsCollection,
  caseStudiesCollection,
  eventsCollection
]

