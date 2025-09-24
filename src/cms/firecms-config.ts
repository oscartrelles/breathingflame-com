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
  FAQ,
  PageIndividuals,
  PageOrganizations,
  PagePrograms,
  About
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
          name: 'Address'
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
      name: 'Feature Flags',
      properties: {
        showEvents: buildProperty({
          dataType: 'boolean',
          name: 'Show Events Section'
        }),
        showTestimonials: buildProperty({
          dataType: 'boolean',
          name: 'Show Testimonials Section'
        }),
        enableBlog: buildProperty({
          dataType: 'boolean',
          name: 'Enable Blog'
        }),
        enableWhatsApp: buildProperty({
          dataType: 'boolean',
          name: 'Enable WhatsApp Community'
        })
      }
    })
  }
})

// Navigation Collection
export const navigationCollection = buildCollection<Navigation>({
  name: 'Navigation',
  singularName: 'Navigation',
  path: 'navigation',
  icon: 'Menu',
  description: 'Site navigation configuration',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
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
            name: 'Link Label'
          }),
          pathOrUrl: buildProperty({
            dataType: 'string',
            name: 'Link URL'
          }),
          external: buildProperty({
            dataType: 'boolean',
            name: 'External Link'
          }),
          order: buildProperty({
            dataType: 'number',
            name: 'Display Order'
          })
        }
      })
    }),
    primaryCTA: buildProperty({
      dataType: 'map',
      name: 'Primary CTA Button',
      properties: {
        label: buildProperty({
          dataType: 'string',
          name: 'Button Text'
        }),
        pathOrUrl: buildProperty({
          dataType: 'string',
          name: 'Button URL'
        }),
        external: buildProperty({
          dataType: 'boolean',
          name: 'External Link'
        })
      }
    }),
    footerGroups: buildProperty({
      dataType: 'array',
      name: 'Footer Link Groups',
      of: buildProperty({
        dataType: 'map',
        properties: {
          title: buildProperty({
            dataType: 'string',
            name: 'Group Title'
          }),
          order: buildProperty({
            dataType: 'number',
            name: 'Display Order'
          }),
          links: buildProperty({
            dataType: 'array',
            name: 'Group Links',
            of: buildProperty({
              dataType: 'map',
              properties: {
                label: buildProperty({
                  dataType: 'string',
                  name: 'Link Label'
                }),
                pathOrUrl: buildProperty({
                  dataType: 'string',
                  name: 'Link URL'
                }),
                external: buildProperty({
                  dataType: 'boolean',
                  name: 'External Link'
                }),
                icon: buildProperty({
                  dataType: 'string',
                  name: 'Icon Name'
                }),
                order: buildProperty({
                  dataType: 'number',
                  name: 'Display Order'
                })
              }
            })
          })
        }
      })
    })
  }
})

// Home Collection - Updated for new structure
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
    seo: buildProperty({
      dataType: 'map',
      name: 'SEO Settings',
      properties: {
        title: buildProperty({
          dataType: 'string',
          name: 'Page Title',
          description: 'Homepage title for search engines'
        }),
        description: buildProperty({
          dataType: 'string',
          name: 'Meta Description',
          multiline: true,
          description: 'Homepage description for search engines'
        }),
        ogImage: buildProperty({
          dataType: 'string',
          name: 'OG Image URL',
          description: 'Social media preview image'
        })
      }
    }),
    hero: buildProperty({
      dataType: 'map',
      name: 'Hero Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Headline',
          description: 'Main hero headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Subtext',
          multiline: true,
          description: 'Hero subtext/description'
        }),
        media: buildProperty({
          dataType: 'map',
          name: 'Background Media',
          properties: {
            backgroundImage: buildProperty({
              dataType: 'string',
              name: 'Background Image URL'
            }),
            overlayOpacity: buildProperty({
              dataType: 'number',
              name: 'Overlay Opacity',
              validation: { min: 0, max: 1 }
            })
          }
        }),
        ctas: buildProperty({
          dataType: 'array',
          name: 'Call-to-Action Buttons',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              pathOrUrl: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        })
      }
    }),
    pillars: buildProperty({
      dataType: 'array',
      name: 'Three Pillars',
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
          copy: buildProperty({
            dataType: 'string',
            name: 'Pillar Copy',
            multiline: true,
            description: 'Short description of the pillar'
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
    sections: buildProperty({
      dataType: 'map',
      name: 'Page Sections',
      properties: {
        featured: buildProperty({
          dataType: 'map',
          name: 'Featured Programs & Experiences',
          properties: {
            headline: buildProperty({
              dataType: 'string',
              name: 'Section Headline'
            }),
            subtext: buildProperty({
              dataType: 'string',
              name: 'Section Subtext',
              multiline: true
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
            })
          }
        }),
        testimonials: buildProperty({
          dataType: 'map',
          name: 'Testimonials Section',
          properties: {
            headline: buildProperty({
              dataType: 'string',
              name: 'Section Headline'
            }),
            subtext: buildProperty({
              dataType: 'string',
              name: 'Section Subtext',
              multiline: true
            }),
            testimonialsFeatured: buildProperty({
              dataType: 'array',
              name: 'Featured Testimonials',
              of: buildProperty({
                dataType: 'reference',
                path: 'testimonials',
                name: 'Testimonial Reference'
              })
            })
          }
        }),
        featuredContent: buildProperty({
          dataType: 'map',
          name: 'Featured Content Section',
          properties: {
            headline: buildProperty({
              dataType: 'string',
              name: 'Section Headline'
            }),
            subtext: buildProperty({
              dataType: 'string',
              name: 'Section Subtext',
              multiline: true
            }),
            featuredArticleRef: buildProperty({
              dataType: 'reference',
              path: 'posts',
              name: 'Featured Article Reference'
            }),
            videoEmbed: buildProperty({
              dataType: 'string',
              name: 'YouTube Video Embed URL'
            })
          }
        }),
        organizations: buildProperty({
          dataType: 'map',
          name: 'Organizations Preview',
          properties: {
            headline: buildProperty({
              dataType: 'string',
              name: 'Section Headline'
            }),
            cards: buildProperty({
              dataType: 'array',
              name: 'Organization Cards',
              of: buildProperty({
                dataType: 'map',
                properties: {
                  title: buildProperty({
                    dataType: 'string',
                    name: 'Card Title'
                  }),
                  copy: buildProperty({
                    dataType: 'string',
                    name: 'Card Copy',
                    multiline: true
                  }),
                  image: buildProperty({
                    dataType: 'string',
                    name: 'Card Image URL'
                  }),
                  cta: buildProperty({
                    dataType: 'map',
                    name: 'Card CTA',
                    properties: {
                      label: buildProperty({
                        dataType: 'string',
                        name: 'CTA Label'
                      }),
                      url: buildProperty({
                        dataType: 'string',
                        name: 'CTA URL'
                      })
                    }
                  })
                }
              })
            })
          }
        }),
        events: buildProperty({
          dataType: 'map',
          name: 'Events Section',
          properties: {
            headline: buildProperty({
              dataType: 'string',
              name: 'Section Headline'
            }),
            fallbackCTA: buildProperty({
              dataType: 'map',
              name: 'Fallback CTA',
              properties: {
                label: buildProperty({
                  dataType: 'string',
                  name: 'CTA Label'
                }),
                pathOrUrl: buildProperty({
                  dataType: 'string',
                  name: 'CTA URL'
                }),
                external: buildProperty({
                  dataType: 'boolean',
                  name: 'External Link'
                })
              }
            })
          }
        }),
        community: buildProperty({
          dataType: 'map',
          name: 'Community CTA',
          properties: {
            headline: buildProperty({
              dataType: 'string',
              name: 'Section Headline'
            }),
            ctas: buildProperty({
              dataType: 'array',
              name: 'Community CTAs',
              of: buildProperty({
                dataType: 'map',
                properties: {
                  label: buildProperty({
                    dataType: 'string',
                    name: 'CTA Label'
                  }),
                  pathOrUrl: buildProperty({
                    dataType: 'string',
                    name: 'CTA URL'
                  }),
                  external: buildProperty({
                    dataType: 'boolean',
                    name: 'External Link'
                  })
                }
              })
            })
          }
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
    title: buildProperty({
      dataType: 'string',
      name: 'Program Title',
      validation: { required: true }
    }),
    slug: buildProperty({
      dataType: 'string',
      name: 'URL Slug',
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
    summary: buildProperty({
      dataType: 'string',
      name: 'Summary',
      multiline: true,
      description: 'Compelling summary for program cards. Falls back to first outcome if empty.'
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
        in_person: 'In Person',
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
      name: 'Expected Outcomes',
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
          })
        }
      })
    }),
    order: buildProperty({
      dataType: 'number',
      name: 'Display Order'
    }),
    tags: buildProperty({
      dataType: 'array',
      name: 'Tags',
      of: buildProperty({
        dataType: 'string',
        name: 'Tag'
      }),
      description: 'Tags for filtering and search'
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

// Experiences Collection
export const experiencesCollection = buildCollection<Experience>({
  name: 'Experiences',
  singularName: 'Experience',
  path: 'experiences',
  icon: 'Star',
  description: 'Transformative experiences and workshops',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    title: buildProperty({
      dataType: 'string',
      name: 'Experience Title',
      validation: { required: true }
    }),
    slug: buildProperty({
      dataType: 'string',
      name: 'URL Slug',
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
    summary: buildProperty({
      dataType: 'string',
      name: 'Summary',
      multiline: true,
      description: 'Compelling summary for experience cards. Falls back to first highlight if empty.'
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
        in_person: 'In Person',
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
      name: 'Expected Outcomes',
      of: buildProperty({
        dataType: 'string',
        name: 'Outcome'
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
    order: buildProperty({
      dataType: 'number',
      name: 'Display Order'
    }),
    tags: buildProperty({
      dataType: 'array',
      name: 'Tags',
      of: buildProperty({
        dataType: 'string',
        name: 'Tag'
      }),
      description: 'Tags for filtering and search'
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
    title: buildProperty({
      dataType: 'string',
      name: 'Post Title',
      validation: { required: true }
    }),
    slug: buildProperty({
      dataType: 'string',
      name: 'URL Slug',
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
      dataType: 'string',
      name: 'Author'
    }),
    tags: buildProperty({
      dataType: 'array',
      name: 'Tags',
      of: buildProperty({
        dataType: 'string',
        name: 'Tag'
      })
    }),
    publishedAt: buildProperty({
      dataType: 'timestamp',
      name: 'Published Date'
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
  icon: 'Quote',
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
      name: 'Author Information',
      properties: {
        name: buildProperty({
          dataType: 'string',
          name: 'Author Name',
          validation: { required: true }
        }),
        title: buildProperty({
          dataType: 'string',
          name: 'Job Title'
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
      name: 'Created Date'
    })
  }
})

// Case Studies Collection
export const caseStudiesCollection = buildCollection<CaseStudy>({
  name: 'Case Studies',
  singularName: 'Case Study',
  path: 'caseStudies',
  icon: 'Business',
  description: 'Success stories and case studies',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    title: buildProperty({
      dataType: 'string',
      name: 'Case Study Title',
      validation: { required: true }
    }),
    slug: buildProperty({
      dataType: 'string',
      name: 'URL Slug',
      validation: { required: true }
    }),
    client: buildProperty({
      dataType: 'string',
      name: 'Client Name'
    }),
    industry: buildProperty({
      dataType: 'string',
      name: 'Industry'
    }),
    challenge: buildProperty({
      dataType: 'string',
      name: 'Challenge',
      multiline: true
    }),
    solution: buildProperty({
      dataType: 'string',
      name: 'Solution',
      multiline: true
    }),
    results: buildProperty({
      dataType: 'string',
      name: 'Results',
      multiline: true
    }),
    featuredImage: buildProperty({
      dataType: 'string',
      name: 'Featured Image URL'
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

// Events Collection
export const eventsCollection = buildCollection<Event>({
  name: 'Events',
  singularName: 'Event',
  path: 'events',
  icon: 'Event',
  description: 'Events and workshops',
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
      name: 'Start Date'
    }),
    endDate: buildProperty({
      dataType: 'timestamp',
      name: 'End Date'
    }),
    location: buildProperty({
      dataType: 'string',
      name: 'Location'
    }),
    format: buildProperty({
      dataType: 'string',
      name: 'Format',
      enumValues: {
        online: 'Online',
        in_person: 'In Person',
        hybrid: 'Hybrid'
      }
    }),
    price: buildProperty({
      dataType: 'number',
      name: 'Price'
    }),
    maxAttendees: buildProperty({
      dataType: 'number',
      name: 'Max Attendees'
    }),
    registrationUrl: buildProperty({
      dataType: 'string',
      name: 'Registration URL'
    }),
    featuredImage: buildProperty({
      dataType: 'string',
      name: 'Featured Image URL'
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

// Page Programs Collection
export const pageProgramsCollection = buildCollection<PagePrograms>({
  name: 'Page Programs',
  singularName: 'Page Programs',
  path: 'pagePrograms',
  icon: 'List',
  description: 'Programs page content configuration',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    seo: buildProperty({
      dataType: 'map',
      name: 'SEO Settings',
      properties: {
        title: buildProperty({
          dataType: 'string',
          name: 'Page Title',
          description: 'Programs page title for search engines'
        }),
        description: buildProperty({
          dataType: 'string',
          name: 'Meta Description',
          multiline: true,
          description: 'Programs page description for search engines'
        }),
        ogImage: buildProperty({
          dataType: 'string',
          name: 'OG Image URL',
          description: 'Social media preview image'
        })
      }
    }),
    hero: buildProperty({
      dataType: 'map',
      name: 'Hero Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Headline',
          description: 'Main hero headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Subtext',
          multiline: true,
          description: 'Hero subtext/description'
        }),
        ctas: buildProperty({
          dataType: 'array',
          name: 'Call-to-Action Buttons',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              pathOrUrl: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        })
      }
    }),
    filters: buildProperty({
      dataType: 'map',
      name: 'Filter Settings',
      properties: {
        showAll: buildProperty({
          dataType: 'boolean',
          name: 'Show All Tab',
          description: 'Display the "All" filter tab'
        }),
        showPrograms: buildProperty({
          dataType: 'boolean',
          name: 'Show Programs Tab',
          description: 'Display the "Programs" filter tab'
        }),
        showExperiences: buildProperty({
          dataType: 'boolean',
          name: 'Show Experiences Tab',
          description: 'Display the "Experiences" filter tab'
        }),
        defaultTab: buildProperty({
          dataType: 'string',
          name: 'Default Tab',
          enumValues: {
            all: 'All',
            programs: 'Programs',
            experiences: 'Experiences'
          },
          description: 'Default active filter tab'
        })
      }
    }),
    search: buildProperty({
      dataType: 'map',
      name: 'Search Settings',
      properties: {
        enabled: buildProperty({
          dataType: 'boolean',
          name: 'Enable Search',
          description: 'Show search input on programs page'
        }),
        placeholder: buildProperty({
          dataType: 'string',
          name: 'Search Placeholder',
          description: 'Placeholder text for search input'
        })
      }
    })
  }
})

// Page Organizations Collection
export const pageOrganizationsCollection = buildCollection<PageOrganizations>({
  name: 'Page Organizations',
  singularName: 'Page Organizations',
  path: 'pageOrganizations',
  icon: 'Business',
  description: 'Organizations page content configuration',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    seo: buildProperty({
      dataType: 'map',
      name: 'SEO Settings',
      properties: {
        title: buildProperty({
          dataType: 'string',
          name: 'Page Title',
          description: 'Organizations page title for search engines'
        }),
        description: buildProperty({
          dataType: 'string',
          name: 'Meta Description',
          multiline: true,
          description: 'Organizations page description for search engines'
        }),
        ogImage: buildProperty({
          dataType: 'string',
          name: 'OG Image URL',
          description: 'Social media preview image'
        })
      }
    }),
    hero: buildProperty({
      dataType: 'map',
      name: 'Hero Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Headline',
          description: 'Main hero headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Subtext',
          multiline: true,
          description: 'Hero subtext/description'
        }),
        ctas: buildProperty({
          dataType: 'array',
          name: 'Call-to-Action Buttons',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              pathOrUrl: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        })
      }
    }),
    businessDrivers: buildProperty({
      dataType: 'array',
      name: 'Business Drivers',
      of: buildProperty({
        dataType: 'map',
        properties: {
          title: buildProperty({
            dataType: 'string',
            name: 'Driver Title'
          }),
          copy: buildProperty({
            dataType: 'string',
            name: 'Driver Copy',
            multiline: true,
            description: 'Description of the business driver'
          })
        }
      })
    }),
    solutions: buildProperty({
      dataType: 'array',
      name: 'Solutions',
      of: buildProperty({
        dataType: 'map',
        properties: {
          title: buildProperty({
            dataType: 'string',
            name: 'Solution Title'
          }),
          copy: buildProperty({
            dataType: 'string',
            name: 'Solution Copy',
            multiline: true,
            description: 'Description of the solution'
          }),
          cta: buildProperty({
            dataType: 'map',
            name: 'Call-to-Action',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              url: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              })
            }
          })
        }
      })
    }),
    results: buildProperty({
      dataType: 'map',
      name: 'Results Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Section Headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Section Subtext',
          multiline: true
        }),
        testimonialRefs: buildProperty({
          dataType: 'array',
          name: 'Featured Testimonials',
          of: buildProperty({
            dataType: 'reference',
            path: 'testimonials',
            name: 'Testimonial Reference'
          })
        })
      }
    }),
    resources: buildProperty({
      dataType: 'map',
      name: 'Resources Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Section Headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Section Subtext',
          multiline: true
        }),
        resourceLinks: buildProperty({
          dataType: 'array',
          name: 'Resource Links',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Link Label'
              }),
              pathOrUrl: buildProperty({
                dataType: 'string',
                name: 'Link URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        }),
        featuredPostRef: buildProperty({
          dataType: 'reference',
          path: 'posts',
          name: 'Featured Blog Post Reference'
        })
      }
    }),
    formats: buildProperty({
      dataType: 'array',
      name: 'Program Formats',
      of: buildProperty({
        dataType: 'string',
        name: 'Format Item'
      })
    }),
    finalCTA: buildProperty({
      dataType: 'map',
      name: 'Final CTA Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'CTA Headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'CTA Subtext',
          multiline: true
        }),
        buttons: buildProperty({
          dataType: 'array',
          name: 'CTA Buttons',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              pathOrUrl: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        })
      }
    })
  }
})

// Page Individuals Collection
export const pageIndividualsCollection = buildCollection<PageIndividuals>({
  name: 'Page Individuals',
  singularName: 'Page Individuals',
  path: 'pageIndividuals',
  icon: 'Person',
  description: 'Individuals page content configuration',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    seo: buildProperty({
      dataType: 'map',
      name: 'SEO Settings',
      properties: {
        title: buildProperty({
          dataType: 'string',
          name: 'Page Title',
          description: 'Individuals page title for search engines'
        }),
        description: buildProperty({
          dataType: 'string',
          name: 'Meta Description',
          multiline: true,
          description: 'Individuals page description for search engines'
        }),
        ogImage: buildProperty({
          dataType: 'string',
          name: 'OG Image URL',
          description: 'Social media preview image'
        })
      }
    }),
    hero: buildProperty({
      dataType: 'map',
      name: 'Hero Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Headline',
          description: 'Main hero headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Subtext',
          multiline: true,
          description: 'Hero subtext/description'
        }),
        ctas: buildProperty({
          dataType: 'array',
          name: 'Call-to-Action Buttons',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              pathOrUrl: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        })
      }
    }),
    introBlocks: buildProperty({
      dataType: 'array',
      name: 'Intro Blocks (Pillars)',
      of: buildProperty({
        dataType: 'map',
        properties: {
          title: buildProperty({
            dataType: 'string',
            name: 'Block Title'
          }),
          copy: buildProperty({
            dataType: 'string',
            name: 'Block Copy',
            multiline: true,
            description: 'Description of the pillar/block'
          })
        }
      })
    }),
    programs: buildProperty({
      dataType: 'map',
      name: 'Programs Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Section Headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Section Subtext',
          multiline: true
        }),
        programRefs: buildProperty({
          dataType: 'array',
          name: 'Featured Programs',
          of: buildProperty({
            dataType: 'reference',
            path: 'programs',
            name: 'Program Reference'
          })
        })
      }
    }),
    experiences: buildProperty({
      dataType: 'map',
      name: 'Experiences Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Section Headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Section Subtext',
          multiline: true
        }),
        experienceRefs: buildProperty({
          dataType: 'array',
          name: 'Featured Experiences',
          of: buildProperty({
            dataType: 'reference',
            path: 'experiences',
            name: 'Experience Reference'
          })
        })
      }
    }),
    testimonials: buildProperty({
      dataType: 'map',
      name: 'Testimonials Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Section Headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Section Subtext',
          multiline: true
        }),
        testimonialRefs: buildProperty({
          dataType: 'array',
          name: 'Featured Testimonials',
          of: buildProperty({
            dataType: 'reference',
            path: 'testimonials',
            name: 'Testimonial Reference'
          })
        })
      }
    }),
    resources: buildProperty({
      dataType: 'map',
      name: 'Resources Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Section Headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Section Subtext',
          multiline: true
        }),
        resourceLinks: buildProperty({
          dataType: 'array',
          name: 'Resource Links',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Link Label'
              }),
              pathOrUrl: buildProperty({
                dataType: 'string',
                name: 'Link URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        }),
        featuredPostRef: buildProperty({
          dataType: 'reference',
          path: 'posts',
          name: 'Featured Blog Post Reference'
        })
      }
    }),
    finalCTA: buildProperty({
      dataType: 'map',
      name: 'Final CTA Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'CTA Headline'
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'CTA Subtext',
          multiline: true
        }),
        buttons: buildProperty({
          dataType: 'array',
          name: 'CTA Buttons',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              pathOrUrl: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        })
      }
    })
  }
})

// About Collection
export const aboutCollection = buildCollection<About>({
  name: 'About',
  singularName: 'About',
  path: 'about',
  icon: 'Info',
  description: 'About page content configuration',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || '')
  }),
  properties: {
    hero: buildProperty({
      dataType: 'map',
      name: 'Hero Section',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Headline',
          validation: { required: true }
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Subtext',
          multiline: true,
          validation: { required: true }
        }),
        image: buildProperty({
          dataType: 'string',
          name: 'Hero Image URL'
        }),
        ctas: buildProperty({
          dataType: 'array',
          name: 'Call-to-Action Buttons',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              url: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          })
        })
      }
    }),
    story: buildProperty({
      dataType: 'map',
      name: 'Our Story',
      properties: {
        title: buildProperty({
          dataType: 'string',
          name: 'Section Title',
          validation: { required: true }
        }),
        body: buildProperty({
          dataType: 'string',
          name: 'Story Content',
          multiline: true,
          validation: { required: true }
        })
      }
    }),
    founder: buildProperty({
      dataType: 'map',
      name: 'Founder Information',
      properties: {
        name: buildProperty({
          dataType: 'string',
          name: 'Founder Name',
          validation: { required: true }
        }),
        title: buildProperty({
          dataType: 'string',
          name: 'Founder Title',
          validation: { required: true }
        }),
        headshot: buildProperty({
          dataType: 'string',
          name: 'Headshot Image URL'
        }),
        bio: buildProperty({
          dataType: 'string',
          name: 'Founder Bio',
          multiline: true,
          validation: { required: true }
        }),
        credentials: buildProperty({
          dataType: 'array',
          name: 'Credentials',
          of: buildProperty({
            dataType: 'string',
            name: 'Credential'
          }),
          validation: { required: true }
        }),
        socials: buildProperty({
          dataType: 'array',
          name: 'Social Links',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Platform Name'
              }),
              url: buildProperty({
                dataType: 'string',
                name: 'Profile URL'
              })
            }
          })
        })
      }
    }),
    approach: buildProperty({
      dataType: 'map',
      name: 'Our Approach',
      properties: {
        intro: buildProperty({
          dataType: 'string',
          name: 'Introduction Text',
          multiline: true,
          validation: { required: true }
        }),
        pillars: buildProperty({
          dataType: 'array',
          name: 'Pillars',
          of: buildProperty({
            dataType: 'map',
            properties: {
              title: buildProperty({
                dataType: 'string',
                name: 'Pillar Title'
              }),
              copy: buildProperty({
                dataType: 'string',
                name: 'Pillar Description',
                multiline: true
              })
            }
          }),
          validation: { required: true }
        })
      }
    }),
    collaborators: buildProperty({
      dataType: 'array',
      name: 'Collaborators',
      of: buildProperty({
        dataType: 'map',
        properties: {
          name: buildProperty({
            dataType: 'string',
            name: 'Collaborator Name'
          }),
          role: buildProperty({
            dataType: 'string',
            name: 'Role/Title'
          }),
          logoUrl: buildProperty({
            dataType: 'string',
            name: 'Logo URL'
          }),
          url: buildProperty({
            dataType: 'string',
            name: 'Website URL'
          })
        }
      })
    }),
    proof: buildProperty({
      dataType: 'map',
      name: 'Social Proof',
      properties: {
        ratingText: buildProperty({
          dataType: 'string',
          name: 'Rating Text'
        }),
        logos: buildProperty({
          dataType: 'array',
          name: 'Client/Partner Logos',
          of: buildProperty({
            dataType: 'string',
            name: 'Logo URL'
          })
        })
      }
    }),
    finalCTA: buildProperty({
      dataType: 'map',
      name: 'Final Call-to-Action',
      properties: {
        headline: buildProperty({
          dataType: 'string',
          name: 'Headline',
          validation: { required: true }
        }),
        subtext: buildProperty({
          dataType: 'string',
          name: 'Subtext',
          multiline: true
        }),
        buttons: buildProperty({
          dataType: 'array',
          name: 'Action Buttons',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                dataType: 'string',
                name: 'Button Label'
              }),
              url: buildProperty({
                dataType: 'string',
                name: 'Button URL'
              }),
              external: buildProperty({
                dataType: 'boolean',
                name: 'External Link'
              })
            }
          }),
          validation: { required: true }
        })
      }
    }),
    seo: buildProperty({
      dataType: 'map',
      name: 'SEO Settings',
      properties: {
        title: buildProperty({
          dataType: 'string',
          name: 'Page Title',
          validation: { required: true }
        }),
        description: buildProperty({
          dataType: 'string',
          name: 'Meta Description',
          multiline: true,
          validation: { required: true }
        }),
        ogImage: buildProperty({
          dataType: 'string',
          name: 'OG Image URL'
        })
      }
    })
  }
})

// Export all collections
export const collections = [
  settingsCollection,
  navigationCollection,
  homeCollection,
  pageProgramsCollection,
  pageOrganizationsCollection,
  pageIndividualsCollection,
  aboutCollection,
  programsCollection,
  experiencesCollection,
  postsCollection,
  testimonialsCollection,
  caseStudiesCollection,
  eventsCollection
]
