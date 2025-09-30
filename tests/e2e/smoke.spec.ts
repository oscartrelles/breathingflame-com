import { test, expect } from '@playwright/test'

// Test data - these should match what's in en.json
const testPages = [
  { path: '/', title: 'Breathing Flame', type: 'home' },
  { path: '/individuals', title: 'Individuals', type: 'individuals' },
  { path: '/organizations', title: 'Organizations', type: 'organizations' },
  { path: '/programs', title: 'Programs', type: 'programs' },
  { path: '/experiences', title: 'Experiences', type: 'experiences' },
  { path: '/solutions', title: 'Solutions', type: 'solutions' },
  { path: '/resources', title: 'Resources', type: 'resources' },
  { path: '/testimonials', title: 'Testimonials', type: 'testimonials' },
  { path: '/about', title: 'About', type: 'about' },
  { path: '/contact', title: 'Contact', type: 'contact' },
]

const programPages = [
  { path: '/programs/reverse-aging-challenge', title: 'Reverse Aging Challenge' },
  { path: '/programs/unblocked-in-ten-weeks', title: 'Unblocked in Ten Weeks' },
  { path: '/programs/unstoppable', title: 'Unstoppable' },
]

const experiencePages = [
  { path: '/experiences/wim-hof-method', title: 'Wim Hof Method' },
  { path: '/experiences/9d-breathwork', title: '9D Breathwork' },
]

const solutionPages = [
  { path: '/solutions/stress-management-masterclass', title: 'Stress Management Masterclass' },
  { path: '/solutions/breathwork-for-teams', title: 'Breathwork for Teams' },
  { path: '/solutions/business-constellations', title: 'Business Constellations' },
  { path: '/solutions/executive-leadership-coaching', title: 'Executive Leadership Coaching' },
  { path: '/solutions/wim-hof-method-corporate', title: 'Wim Hof Method Corporate' },
]

test.describe('Smoke Tests - Critical Content Visibility', () => {
  test.beforeEach(async ({ page }) => {
    // Set a longer timeout for page loads
    test.setTimeout(30000)
  })

  // Test main navigation pages
  for (const page of testPages) {
    test(`${page.type} page loads and shows critical content`, async ({ page: testPage }) => {
      await testPage.goto(page.path)
      
      // Wait for page to load
      await testPage.waitForLoadState('networkidle')
      
      // Check page title
      await expect(testPage).toHaveTitle(/Breathing Flame/)
      
      // Check for hero section
      const heroSection = testPage.locator('[data-testid="hero-section"], .hero, h1')
      await expect(heroSection.first()).toBeVisible()
      
      // Check for navigation
      const nav = testPage.locator('nav, [role="navigation"]')
      await expect(nav).toBeVisible()
      
      // Check for footer
      const footer = testPage.locator('footer, [role="contentinfo"]')
      await expect(footer).toBeVisible()
      
      // Check that there's no obvious placeholder text
      const placeholderText = testPage.locator('text=Lorem ipsum, text=Placeholder, text=Coming soon')
      await expect(placeholderText).toHaveCount(0)
    })
  }

  // Test program detail pages
  for (const program of programPages) {
    test(`Program page ${program.path} loads correctly`, async ({ page }) => {
      await page.goto(program.path)
      await page.waitForLoadState('networkidle')
      
      // Check page title contains program name
      await expect(page).toHaveTitle(new RegExp(program.title))
      
      // Check for program content
      const programTitle = page.locator('h1, h2').filter({ hasText: program.title })
      await expect(programTitle.first()).toBeVisible()
      
      // Check for CTA buttons
      const ctaButtons = page.locator('a[href*="/contact"], a[href*="/programs"], button')
      await expect(ctaButtons.first()).toBeVisible()
    })
  }

  // Test experience detail pages
  for (const experience of experiencePages) {
    test(`Experience page ${experience.path} loads correctly`, async ({ page }) => {
      await page.goto(experience.path)
      await page.waitForLoadState('networkidle')
      
      // Check page title contains experience name
      await expect(page).toHaveTitle(new RegExp(experience.title))
      
      // Check for experience content
      const experienceTitle = page.locator('h1, h2').filter({ hasText: experience.title })
      await expect(experienceTitle.first()).toBeVisible()
    })
  }

  // Test solution detail pages
  for (const solution of solutionPages) {
    test(`Solution page ${solution.path} loads correctly`, async ({ page }) => {
      await page.goto(solution.path)
      await page.waitForLoadState('networkidle')
      
      // Check page title contains solution name
      await expect(page).toHaveTitle(new RegExp(solution.title))
      
      // Check for solution content
      const solutionTitle = page.locator('h1, h2').filter({ hasText: solution.title })
      await expect(solutionTitle.first()).toBeVisible()
    })
  }

  // Test testimonials visibility on key pages
  test('Testimonials are visible on home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Look for testimonials section
    const testimonialsSection = page.locator('text=What People Say, text=Testimonials, [data-testid="testimonials"]')
    await expect(testimonialsSection.first()).toBeVisible()
    
    // Check for testimonial cards
    const testimonialCards = page.locator('[data-testid="testimonial-card"], .testimonial, blockquote')
    await expect(testimonialCards.first()).toBeVisible()
  })

  test('Testimonials are visible on individuals page', async ({ page }) => {
    await page.goto('/individuals')
    await page.waitForLoadState('networkidle')
    
    // Look for testimonials section
    const testimonialsSection = page.locator('text=What Individuals Say, text=Testimonials, [data-testid="testimonials"]')
    await expect(testimonialsSection.first()).toBeVisible()
  })

  test('Testimonials are visible on organizations page', async ({ page }) => {
    await page.goto('/organizations')
    await page.waitForLoadState('networkidle')
    
    // Look for testimonials section
    const testimonialsSection = page.locator('text=What Organizations Say, text=Testimonials, [data-testid="testimonials"]')
    await expect(testimonialsSection.first()).toBeVisible()
  })

  // Test admin pages (if accessible)
  test('Admin dashboard loads (if accessible)', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    
    // Check if admin page loads (might redirect to login)
    const isAdminPage = await page.locator('text=Admin, text=Dashboard, text=Management').first().isVisible()
    const isLoginPage = await page.locator('text=Login, text=Sign in, input[type="password"]').first().isVisible()
    
    // Either admin page or login page should be visible
    expect(isAdminPage || isLoginPage).toBeTruthy()
  })

  // Test search functionality
  test('Search page loads and functions', async ({ page }) => {
    await page.goto('/search')
    await page.waitForLoadState('networkidle')
    
    // Check for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]')
    await expect(searchInput.first()).toBeVisible()
    
    // Check for search results or placeholder
    const searchContent = page.locator('[data-testid="search-results"], .search-results, .no-results')
    await expect(searchContent.first()).toBeVisible()
  })

  // Test 404 page
  test('404 page loads correctly', async ({ page }) => {
    await page.goto('/non-existent-page')
    await page.waitForLoadState('networkidle')
    
    // Check for 404 content
    const notFoundContent = page.locator('text=404, text=Not Found, text=Page not found')
    await expect(notFoundContent.first()).toBeVisible()
    
    // Check for navigation back to home
    const homeLink = page.locator('a[href="/"], a[href="/home"]')
    await expect(homeLink.first()).toBeVisible()
  })

  // Test responsive design
  test('Mobile viewport works on home page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check that content is visible and not cut off
    const heroSection = page.locator('h1, .hero').first()
    await expect(heroSection).toBeVisible()
    
    // Check that navigation is accessible (might be hamburger menu)
    const nav = page.locator('nav, [role="navigation"], button[aria-label*="menu" i]')
    await expect(nav.first()).toBeVisible()
  })
})
