// Mock data service for development
// This will be replaced with FireCMS data in production

export const mockSettings = {
  id: 'site',
  siteTitle: 'Breathing Flame',
  masterTagline: 'Resilience. Clarity. Transformation.',
  contact: {
    email: 'contact@breathingflame.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA'
  },
  socials: {
    facebook: 'https://facebook.com/breathingflame',
    instagram: 'https://instagram.com/breathingflame',
    linkedin: 'https://linkedin.com/company/breathingflame',
    twitter: 'https://twitter.com/breathingflame',
    youtube: 'https://youtube.com/@breathingflame'
  },
  seoDefaults: {
    metaTitle: 'Breathing Flame - Resilience. Clarity. Transformation.',
    metaDescription: 'Perform at your best. Live with clarity. Transform your life through breathwork, mindfulness, and transformative experiences.',
    ogImage: '/og-image.jpg'
  },
  brandFlags: {
    showEvents: true,
    showTestimonials: true,
    enableBlog: true,
    enableWhatsApp: true
  }
}

export const mockNavigation = {
  id: 'main',
  headerLinks: [
    { label: 'For Individuals', pathOrUrl: '/individuals', external: false, order: 10 },
    { label: 'For Organizations', pathOrUrl: '/organizations', external: false, order: 20 },
    { label: 'Programs', pathOrUrl: '/programs', external: false, order: 30 },
    { label: 'About', pathOrUrl: '/about', external: false, order: 40 }
  ],
  primaryCTA: {
    label: 'Book a Meeting',
    pathOrUrl: '/contact',
    external: false
  },
  footerGroups: [
    {
      title: 'RESILIENCE',
      order: 10,
      links: [
        { label: '7-Week Reverse Aging Challenge', pathOrUrl: '/programs/reverse-aging-challenge', external: false, order: 10 },
        { label: 'Wim Hof Method Workshops', pathOrUrl: '/experiences/wim-hof-method', external: false, order: 20 },
        { label: '9D Breathwork Journeys', pathOrUrl: '/experiences/9d-breathwork', external: false, order: 30 }
      ]
    },
    {
      title: 'CLARITY',
      order: 20,
      links: [
        { label: 'Unblocked in Ten Weeks', pathOrUrl: '/programs/unblocked-in-ten-weeks', external: false, order: 10 },
        { label: 'Unstoppable', pathOrUrl: '/programs/unstoppable', external: false, order: 20 },
        { label: 'Business Constellations', pathOrUrl: '/organizations#business-constellations', external: false, order: 30 }
      ]
    },
    {
      title: 'TRANSFORMATION',
      order: 30,
      links: [
        { label: 'For Individuals', pathOrUrl: '/individuals', external: false, order: 10 },
        { label: 'For Organizations', pathOrUrl: '/organizations', external: false, order: 20 },
        { label: 'About Breathing Flame', pathOrUrl: '/about', external: false, order: 30 }
      ]
    },
    {
      title: 'RESOURCES',
      order: 40,
      links: [
        { label: 'Ignite Your Flame', pathOrUrl: '/#ignite-your-flame', external: false, order: 10 },
        { label: 'Peak Energy Profiler', pathOrUrl: '/#peak-energy-profiler', external: false, order: 20 },
        { label: 'Reverse Aging Academy', pathOrUrl: '/programs/reverse-aging-academy', external: false, order: 30 }
      ]
    },
  ],
  anchors: [
    { label: 'Ignite Your Flame', hash: '#ignite-your-flame', order: 10 },
    { label: 'Peak Energy Profiler', hash: '#peak-energy-profiler', order: 20 }
  ]
}

export const mockHome = {
  id: 'content',
  hero: {
    title: 'Resilience. Clarity. Transformation.',
    subtitle: 'Perform at your best. Live with clarity. Transform your life.',
    description: 'Discover the power of breathwork, mindfulness, and transformative experiences that help you build resilience, gain clarity, and create lasting positive change in your life.',
    backgroundImage: '/hero-bg.jpg',
    ctaText: 'Start Your Journey',
    ctaHref: '/contact',
    overlayOpacity: 0.6
  },
  pillars: [
    {
      id: 'resilience',
      title: 'Resilience',
      description: 'Build unshakeable mental and emotional strength through breathwork and mindfulness practices that help you navigate life\'s challenges with grace and determination.',
      icon: 'R',
      color: '#ffb332'
    },
    {
      id: 'clarity',
      title: 'Clarity',
      description: 'Cut through mental fog and emotional noise to gain crystal-clear insight into your values, goals, and the path forward. Discover what truly matters to you.',
      icon: 'C',
      color: '#ffb332'
    },
    {
      id: 'transformation',
      title: 'Transformation',
      description: 'Experience profound personal change that goes beyond surface-level improvements. Create lasting shifts in how you think, feel, and show up in the world.',
      icon: 'T',
      color: '#ffb332'
    }
  ],
  featuredPrograms: ['rac', 'unblocked', 'unstoppable'],
  featuredExperiences: ['whm', '9d-breathwork'],
  testimonialRefs: ['test1', 'test2', 'test3'],
  orgPreviewCards: [
    {
      title: 'Corporate Wellness Programs',
      description: 'Transform your workplace culture with our comprehensive wellness solutions.',
      image: '/org-corporate.jpg',
      href: '/organizations'
    },
    {
      title: 'Leadership Development',
      description: 'Develop resilient leaders who make clear decisions and inspire teams.',
      image: '/org-leadership.jpg',
      href: '/organizations'
    }
  ],
  showEvents: true,
  communityCTAs: [
    {
      title: 'Join Our Community',
      description: 'Connect with like-minded individuals on their transformation journey.',
      buttonText: 'Join WhatsApp',
      buttonHref: 'https://chat.whatsapp.com/your-group',
      type: 'whatsapp' as const
    }
  ],
  typeforms: {
    igniteUrl: 'https://your_typeform.typeform.com/to/ignite',
    peakUrl: 'https://your_typeform.typeform.com/to/peak',
    enabled: true
  }
}

export const mockPrograms = [
  {
    id: 'rac',
    slug: 'reverse-aging-challenge',
    title: 'Reverse Aging Challenge',
    subtitle: '10-Week Transformation',
    description: 'Turn back the clock on aging through breathwork, cold therapy, and mindfulness practices.',
    shortDescription: 'Transform your body and mind with our comprehensive 10-week program.',
    image: '/programs/rac.jpg',
    duration: '10 Weeks',
    format: 'hybrid' as const,
    price: { individual: 997, organization: 1997 },
    outcomes: ['Increased energy', 'Better sleep', 'Reduced stress', 'Enhanced focus'],
    howItWorks: [
      { step: 1, title: 'Assessment', description: 'Complete our comprehensive assessment to identify your starting point.' },
      { step: 2, title: 'Daily Practice', description: 'Follow our daily breathwork and mindfulness routines.' },
      { step: 3, title: 'Weekly Coaching', description: 'Join group coaching sessions for support and guidance.' },
      { step: 4, title: 'Transformation', description: 'Experience profound changes in your energy and vitality.' }
    ],
    ctaText: 'Start Challenge',
    ctaHref: '/programs/reverse-aging-challenge',
    faqs: [],
    order: 1,
    published: true,
    featured: true
  }
]

export const mockTestimonials = [
  {
    id: 'test1',
    rating: 5,
    text: 'The Reverse Aging Challenge completely transformed my life. I have more energy than I\'ve had in years and feel like a completely different person.',
    author: {
      name: 'Sarah Johnson',
      title: 'Marketing Director',
      company: 'Tech Corp',
      avatar: '/avatars/sarah.jpg'
    },
    tags: ['energy', 'transformation'],
    featured: true,
    verified: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'test2',
    rating: 5,
    text: 'The breathwork techniques I learned have been game-changing for my stress levels. I feel more centered and focused than ever before.',
    author: {
      name: 'Michael Chen',
      title: 'CEO',
      company: 'Startup Inc',
      avatar: '/avatars/michael.jpg'
    },
    tags: ['stress', 'focus'],
    featured: true,
    verified: true,
    createdAt: new Date('2024-01-10')
  }
]
