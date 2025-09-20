import { ContactForm, NewsletterSignup } from '@/types'

/**
 * Contact Service
 * 
 * Handles form submissions and integrations
 * Sends data to Firebase Functions for processing
 */

const CONTACT_API_URL = '/api/contact'
const NEWSLETTER_API_URL = '/api/newsletter'

/**
 * Submit contact form
 */
export async function submitContactForm(formData: ContactForm): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const response = await fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit contact form')
    }

    return {
      success: true,
      message: result.message || 'Contact form submitted successfully',
      id: result.id
    }

  } catch (error) {
    console.error('Contact form submission error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while submitting the form'
    }
  }
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(signupData: NewsletterSignup): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(NEWSLETTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to subscribe to newsletter')
    }

    return {
      success: true,
      message: result.message || 'Successfully subscribed to newsletter'
    }

  } catch (error) {
    console.error('Newsletter signup error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while subscribing'
    }
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format (basic)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

/**
 * Generate WhatsApp deep link
 */
export function generateWhatsAppLink(phone: string, message: string = ''): string {
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Generate email link
 */
export function generateEmailLink(email: string, subject: string = '', body: string = ''): string {
  const encodedSubject = encodeURIComponent(subject)
  const encodedBody = encodeURIComponent(body)
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phone
}

/**
 * Get contact preferences options
 */
export function getContactPreferences(): Array<{ value: string; label: string }> {
  return [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ]
}

/**
 * Get interest categories
 */
export function getInterestCategories(): Array<{ value: string; label: string }> {
  return [
    { value: 'individual-programs', label: 'Individual Programs' },
    { value: 'organization-services', label: 'Organization Services' },
    { value: 'breathwork-experiences', label: 'Breathwork Experiences' },
    { value: 'mindfulness-practices', label: 'Mindfulness Practices' },
    { value: 'leadership-development', label: 'Leadership Development' },
    { value: 'stress-management', label: 'Stress Management' },
    { value: 'team-building', label: 'Team Building' },
    { value: 'retreats', label: 'Retreats' },
    { value: 'workshops', label: 'Workshops' },
    { value: 'consultation', label: 'Consultation' }
  ]
}

/**
 * Get program types
 */
export function getProgramTypes(): Array<{ value: string; label: string }> {
  return [
    { value: 'individual', label: 'Individual' },
    { value: 'organization', label: 'Organization' }
  ]
}

/**
 * Sanitize form input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

/**
 * Validate required fields
 */
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Create form data for submission
 */
export function createContactFormData(data: Partial<ContactForm>): ContactForm {
  return {
    type: data.type || 'individual',
    name: sanitizeInput(data.name || ''),
    email: data.email || '',
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
    company: data.company ? sanitizeInput(data.company) : undefined,
    message: sanitizeInput(data.message || ''),
    interests: data.interests || [],
    preferredContact: data.preferredContact || 'email'
  }
}

/**
 * Create newsletter signup data
 */
export function createNewsletterSignupData(email: string, interests: string[] = [], source: string = 'website'): NewsletterSignup {
  return {
    email: email.toLowerCase().trim(),
    interests,
    source
  }
}

