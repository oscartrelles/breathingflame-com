import { GoogleReview, ImportConfig, SourceAdapter } from '../types'

export class BusinessProfileAdapter implements SourceAdapter {
  name = 'business-profile'

  async validateCredentials(credentials: any): Promise<boolean> {
    return true
  }

  async import(config: ImportConfig): Promise<GoogleReview[]> {
    const { settings } = config
    
    if (!settings.businessProfileId) {
      throw new Error('Business Profile ID is required')
    }

    try {
      console.log(`🔍 Using Business Profile ID: ${settings.businessProfileId}`)
      console.log('📋 This adapter provides a template for manual review entry')
      console.log('💡 You can now manually add your reviews using this Business Profile ID')
      
      // Return empty array - this is a template for manual entry
      return []
    } catch (error) {
      console.error('Business Profile adapter failed:', error)
      throw error
    }
  }
}

