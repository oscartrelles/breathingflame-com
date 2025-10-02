// Accessibility utilities and helpers for enhanced user experience

// ==========================================================================
// ARIA LABELS AND DESCRIPTIONS
// ==========================================================================

export const ARIA_LABELS = {
  // Navigation
  mainNavigation: 'Main navigation',
  breadcrumb: 'Breadcrumb navigation',
  pagination: 'Pagination navigation',
  
  // Content sections
  mainContent: 'Main content',
  complementaryContent: 'Complementary content',
  banner: 'Site banner',
  contentInfo: 'Content information',
  
  // Interactive elements
  closeButton: 'Close',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  toggleTheme: 'Toggle dark mode',
  searchButton: 'Search',
  submitForm: 'Submit form',
  loadMore: 'Load more content',
  
  // Media
  playVideo: 'Play video',
  pauseVideo: 'Pause video',
  muteVideo: 'Mute video',
  unmuteVideo: 'Unmute video',
  fullscreenVideo: 'Enter fullscreen',
  exitFullscreen: 'Exit fullscreen',
  
  // Forms
  requiredField: 'Required field',
  optionalField: 'Optional field',
  formError: 'Form error',
  formSuccess: 'Form success',
  
  // Data tables
  sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending',
  removeSort: 'Remove sort',
  
  // Modals and overlays
  modalDialog: 'Modal dialog',
  closeModal: 'Close modal',
  openModal: 'Open modal',
  
  // Loading states
  loading: 'Loading',
  loadingComplete: 'Loading complete',
  loadingError: 'Loading error',
  
  // Testimonials and reviews
  testimonialRating: 'Testimonial rating',
  readMoreTestimonial: 'Read full testimonial',
  previousTestimonial: 'Previous testimonial',
  nextTestimonial: 'Next testimonial',
  
  // Cards and content
  cardLink: 'View details',
  externalLink: 'External link',
  downloadLink: 'Download file',
  emailLink: 'Send email',
  phoneLink: 'Call phone number',
  
  // Social media
  shareOnFacebook: 'Share on Facebook',
  shareOnTwitter: 'Share on Twitter',
  shareOnLinkedIn: 'Share on LinkedIn',
  followOnSocial: 'Follow on social media',
} as const

// ==========================================================================
// ARIA DESCRIPTIONS
// ==========================================================================

export const ARIA_DESCRIPTIONS = {
  // Form validation
  emailFormat: 'Please enter a valid email address',
  passwordRequirements: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  phoneFormat: 'Please enter a valid phone number',
  requiredField: 'This field is required',
  
  // Interactive elements
  expandableContent: 'Click to expand content',
  collapsibleContent: 'Click to collapse content',
  draggableItem: 'Drag to reorder',
  sortableColumn: 'Click to sort by this column',
  
  // Navigation
  currentPage: 'Current page',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  skipToContent: 'Skip to main content',
  
  // Media controls
  videoControls: 'Use spacebar to play/pause, arrow keys to seek',
  audioControls: 'Use spacebar to play/pause',
  
  // Loading states
  loadingProgress: 'Loading in progress',
  loadingComplete: 'Content has finished loading',
  
  // Error states
  errorOccurred: 'An error occurred',
  retryAction: 'Click to retry the action',
  
  // Success states
  actionCompleted: 'Action completed successfully',
  dataSaved: 'Your data has been saved',
} as const

// ==========================================================================
// ROLE DEFINITIONS
// ==========================================================================

export const ROLES = {
  // Navigation
  navigation: 'navigation',
  menubar: 'menubar',
  menuitem: 'menuitem',
  tablist: 'tablist',
  tab: 'tab',
  tabpanel: 'tabpanel',
  
  // Content structure
  main: 'main',
  banner: 'banner',
  complementary: 'complementary',
  contentinfo: 'contentinfo',
  region: 'region',
  article: 'article',
  section: 'section',
  
  // Interactive elements
  button: 'button',
  link: 'link',
  checkbox: 'checkbox',
  radio: 'radio',
  textbox: 'textbox',
  combobox: 'combobox',
  listbox: 'listbox',
  option: 'option',
  slider: 'slider',
  progressbar: 'progressbar',
  status: 'status',
  alert: 'alert',
  dialog: 'dialog',
  tooltip: 'tooltip',
  
  // Data presentation
  table: 'table',
  row: 'row',
  columnheader: 'columnheader',
  rowheader: 'rowheader',
  cell: 'cell',
  grid: 'grid',
  gridcell: 'gridcell',
  list: 'list',
  listitem: 'listitem',
  
  // Media
  img: 'img',
  presentation: 'presentation',
} as const

// ==========================================================================
// KEYBOARD NAVIGATION
// ==========================================================================

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const

// ==========================================================================
// FOCUS MANAGEMENT
// ==========================================================================

export const FOCUS_SELECTORS = {
  focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  interactive: 'button, [href], input, select, textarea, [role="button"], [role="link"]',
  formElements: 'input, select, textarea, button[type="submit"], button[type="button"]',
  navigation: 'nav a, nav button, [role="menuitem"]',
  modal: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
} as const

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Generate accessible ID for form elements
 */
export const generateId = (prefix: string, suffix?: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `${prefix}-${suffix || random}-${timestamp}`
}

/**
 * Create ARIA live region for announcements
 */
export const createLiveRegion = (id: string, politeness: 'polite' | 'assertive' = 'polite'): HTMLElement => {
  const existing = document.getElementById(id)
  if (existing) return existing

  const liveRegion = document.createElement('div')
  liveRegion.id = id
  liveRegion.setAttribute('aria-live', politeness)
  liveRegion.setAttribute('aria-atomic', 'true')
  liveRegion.className = 'sr-only'
  document.body.appendChild(liveRegion)
  return liveRegion
}

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message: string, politeness: 'polite' | 'assertive' = 'polite'): void => {
  const liveRegion = createLiveRegion('announcements', politeness)
  liveRegion.textContent = message
  
  // Clear after announcement
  setTimeout(() => {
    liveRegion.textContent = ''
  }, 1000)
}

/**
 * Check if element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelector = FOCUS_SELECTORS.focusable
  return element.matches(focusableSelector)
}

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelector = FOCUS_SELECTORS.focusable
  return Array.from(container.querySelectorAll(focusableSelector)) as HTMLElement[]
}

/**
 * Trap focus within a container
 */
export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = getFocusableElements(container)
  if (focusableElements.length === 0) return () => {}

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== KEYBOARD_KEYS.TAB) return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  // Focus first element
  firstElement.focus()
  document.addEventListener('keydown', handleTabKey)

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Restore focus to previously focused element
 */
export const restoreFocus = (element: HTMLElement | null): void => {
  if (element && isFocusable(element)) {
    element.focus()
  }
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}

/**
 * Check if user prefers high contrast
 */
export const prefersHighContrast = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-contrast: high)').matches
  }
  return false
}

/**
 * Check if user prefers dark color scheme
 */
export const prefersDarkColorScheme = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// ==========================================================================
// FORM VALIDATION HELPERS
// ==========================================================================

export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  pattern: 'Please match the requested format',
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be no more than ${max}`,
} as const

/**
 * Get validation message for form field
 */
export const getValidationMessage = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string => {
  const validity = field.validity
  
  if (validity.valueMissing) return VALIDATION_MESSAGES.required
  if (validity.typeMismatch) {
    switch (field.type) {
      case 'email': return VALIDATION_MESSAGES.email
      case 'url': return VALIDATION_MESSAGES.url
      default: return VALIDATION_MESSAGES.pattern
    }
  }
  if (validity.tooShort) return VALIDATION_MESSAGES.minLength(field.minLength)
  if (validity.tooLong) return VALIDATION_MESSAGES.maxLength(field.maxLength)
  if (validity.rangeUnderflow) return VALIDATION_MESSAGES.min(Number(field.min))
  if (validity.rangeOverflow) return VALIDATION_MESSAGES.max(Number(field.max))
  if (validity.patternMismatch) return VALIDATION_MESSAGES.pattern
  
  // Only return validation message if there's an actual error
  if (field.validationMessage && field.validationMessage !== '') {
    return field.validationMessage
  }
  
  // No validation errors
  return ''
}

// ==========================================================================
// COLOR CONTRAST HELPERS
// ==========================================================================

/**
 * Calculate relative luminance of a color
 */
export const getRelativeLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  // This is a simplified version - in production, you'd want to use a proper color parsing library
  const parseColor = (color: string): [number, number, number] => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return [r, g, b]
    }
    // Handle rgb/rgba colors
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    }
    return [0, 0, 0] // fallback
  }

  const [r1, g1, b1] = parseColor(color1)
  const [r2, g2, b2] = parseColor(color2)
  
  const l1 = getRelativeLuminance(r1, g1, b1)
  const l2 = getRelativeLuminance(r2, g2, b2)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color combination meets WCAG contrast requirements
 */
export const meetsContrastRequirements = (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(foreground, background)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

// ==========================================================================
// SCREEN READER UTILITIES
// ==========================================================================

/**
 * Hide element from screen readers but keep it visible
 */
export const hideFromScreenReader = (element: HTMLElement): void => {
  element.setAttribute('aria-hidden', 'true')
}

/**
 * Show element to screen readers
 */
export const showToScreenReader = (element: HTMLElement): void => {
  element.removeAttribute('aria-hidden')
}

/**
 * Make element visible only to screen readers
 */
export const screenReaderOnly = (element: HTMLElement): void => {
  element.classList.add('sr-only')
}

/**
 * Make element visible to screen readers and visually
 */
export const screenReaderVisible = (element: HTMLElement): void => {
  element.classList.remove('sr-only')
}
