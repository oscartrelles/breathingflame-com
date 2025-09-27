import { GoogleReview, ImportConfig, SourceAdapter } from '../types'

export class ManualAdapter implements SourceAdapter {
  name = 'manual'

  async validateCredentials(credentials: any): Promise<boolean> {
    // Manual adapter doesn't need credentials
    return true
  }

  async import(config: ImportConfig): Promise<GoogleReview[]> {
    // This is a placeholder for manual import
    // In a real implementation, you would read from a CSV file or JSON file
    // For now, let's return some sample data to test the system
    
    const sampleReviews: GoogleReview[] = [
      {
        id: 'manual_1',
        text: 'The Reverse Aging Challenge completely transformed my life. I have more energy than I\'ve had in years and feel like a completely different person.',
        rating: 5,
        author: {
          name: 'Sarah Johnson',
          title: 'Marketing Director',
          company: 'Tech Corp',
          avatar: undefined
        },
        source: {
          platform: 'google',
          originalId: 'manual_1',
          url: 'https://www.google.com/maps/place/Breathing+Flame',
          importedAt: new Date()
        },
        tags: ['energy', 'transformation', 'excellent'],
        featured: true,
        verified: true,
        createdAt: new Date('2024-01-15'),
        language: 'en'
      },
      {
        id: 'manual_2',
        text: 'The breathwork techniques I learned have been game-changing for my stress levels. I feel more centered and focused than ever before.',
        rating: 5,
        author: {
          name: 'Michael Chen',
          title: 'CEO',
          company: 'Startup Inc',
          avatar: undefined
        },
        source: {
          platform: 'google',
          originalId: 'manual_2',
          url: 'https://www.google.com/maps/place/Breathing+Flame',
          importedAt: new Date()
        },
        tags: ['stress-relief', 'breathwork', 'focus', 'excellent'],
        featured: true,
        verified: true,
        createdAt: new Date('2024-02-20'),
        language: 'en'
      },
      {
        id: 'manual_3',
        text: 'Amazing experience with the Wim Hof Method workshop. The cold exposure training was incredible and I feel so much more resilient now.',
        rating: 5,
        author: {
          name: 'Emma Wilson',
          title: 'Health Coach',
          company: 'Wellness Center',
          avatar: undefined
        },
        source: {
          platform: 'google',
          originalId: 'manual_3',
          url: 'https://www.google.com/maps/place/Breathing+Flame',
          importedAt: new Date()
        },
        tags: ['breathwork', 'transformation', 'excellent'],
        featured: false,
        verified: true,
        createdAt: new Date('2024-03-10'),
        language: 'en'
      }
    ]

    return sampleReviews
  }
}

