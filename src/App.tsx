import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { HashAnchorRouter } from '@/components/HashAnchorRouter'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import { SEO } from '@/components/SEO'
import { Analytics } from '@/components/Analytics'
import { AnimationProvider } from '@/components/AnimationProvider'
import { AccessibilityProvider } from '@/components/AccessibilityProvider'
import { useScrollToTop } from '@/hooks/useScrollToTop'

// Pages
import { Home } from '@/pages/Home'
import { Individuals } from '@/pages/Individuals'
import { Organizations } from '@/pages/Organizations'
import { Programs } from '@/pages/Programs'
import ProductDetail from '@/pages/ProductDetail'
import { Resources } from '@/pages/Resources'
import { ArticleDetail } from '@/pages/ResourceDetail'
import { IgniteYourFlame } from '@/pages/resources/IgniteYourFlame'
import { PeakEnergyProfiler } from '@/pages/resources/PeakEnergyProfiler'
import { Events } from '@/pages/Events'
import { Testimonials } from '@/pages/Testimonials'
import { About } from '@/pages/About'
import { Contact } from '@/pages/Contact'
import { FreeConsultation } from '@/pages/FreeConsultation'
import { Privacy } from '@/pages/Privacy'
import { Terms } from '@/pages/Terms'
import { NotFound } from '@/pages/NotFound'
import Search from '@/pages/Search'
import Community from '@/pages/Community'
import Press from '@/pages/Press'
import SchemaCheck from '@/pages/SchemaCheck'
import { SolutionDetail } from '@/pages/SolutionDetail'
// Admin routes/components - only in development, no Suspense/lazy
const isDevelopment = import.meta.env.DEV

type Loader<T> = () => Promise<{ default: T } | T>

function AdminElement<T extends React.ComponentType<any>>(props: { loader: Loader<T>, fallback?: React.ReactNode }) {
  const { loader, fallback = null } = props
  const [Comp, setComp] = React.useState<T | null>(null)

  React.useEffect(() => {
    if (!isDevelopment) return
    let mounted = true
    ;(async () => {
      // Dynamic import at runtime in dev to avoid bundling in prod
      const mod: any = await loader()
      if (mounted) {
        const C = (mod?.default ?? mod) as T
        setComp(() => C)
      }
    })()
    return () => {
      mounted = false
    }
  }, [loader])

  if (!isDevelopment) return null
  if (!Comp) return <>{fallback}</>
  const Render = Comp as unknown as React.ComponentType<any>
  return <Render />
}

function App() {
  useScrollToTop()

  return (
    <AccessibilityProvider>
      <AnimationProvider>
        <SEO />
        <Analytics />
        <HashAnchorRouter />
        <Routes>
        {/* Admin routes - only in development (no Suspense/lazy) */}
        {isDevelopment && (
          <>
            <Route path="/admin" element={<AdminElement loader={() => import('@/pages/admin/AdminDashboard').then(m => m.AdminDashboard)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/programs" element={<AdminElement loader={() => import('@/pages/admin/ProgramsManagement').then(m => m.ProgramsManagement)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/programs/:id" element={<AdminElement loader={() => import('@/pages/admin/DynamicEditor').then(m => m.DynamicEditor)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/experiences" element={<AdminElement loader={() => import('@/pages/admin/ExperiencesManagement').then(m => m.ExperiencesManagement)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/experiences/:id" element={<AdminElement loader={() => import('@/pages/admin/DynamicEditor').then(m => m.DynamicEditor)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/solutions" element={<AdminElement loader={() => import('@/pages/admin/SolutionsManagement').then(m => m.SolutionsManagement)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/solutions/:id" element={<AdminElement loader={() => import('@/pages/admin/DynamicEditor').then(m => m.DynamicEditor)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/pages" element={<AdminElement loader={() => import('@/pages/admin/PagesManagement').then(m => m.PagesManagement)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/pages/:id" element={<AdminElement loader={() => import('@/pages/admin/DynamicEditor').then(m => m.DynamicEditor)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/testimonials" element={<AdminElement loader={() => import('@/pages/admin/TestimonialsManager').then(m => m.TestimonialsManager)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/testimonials/:id" element={<AdminElement loader={() => import('@/pages/admin/DynamicEditor').then(m => m.DynamicEditor)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/testimonials-migration" element={<AdminElement loader={() => import('@/pages/admin/TestimonialsMigration')} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/posts" element={<AdminElement loader={() => import('@/pages/admin/PostsManagement').then(m => m.PostsManagement)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/posts/:id" element={<AdminElement loader={() => import('@/pages/admin/DynamicEditor').then(m => m.DynamicEditor)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/navigation" element={<AdminElement loader={() => import('@/pages/admin/NavigationManagement').then(m => m.NavigationManagement)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/navigation/:id" element={<AdminElement loader={() => import('@/pages/admin/DynamicEditor').then(m => m.DynamicEditor)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/settings" element={<AdminElement loader={() => import('@/pages/admin/SettingsManagement').then(m => m.SettingsManagement)} fallback={<div>Loading...</div>} />} />
            <Route path="/admin/settings/:id" element={<AdminElement loader={() => import('@/pages/admin/DynamicEditor').then(m => m.DynamicEditor)} fallback={<div>Loading...</div>} />} />
          </>
        )}
        
        {/* Public routes - with header/footer */}
        <Route path="/*" element={
          <>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/individuals" element={<Individuals />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/programs" element={<Programs />} />
                       <Route path="/programs/:slug" element={<ProductDetail productType={'program'} />} />
                       <Route path="/experiences/:slug" element={<ProductDetail productType={'experience'} />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/ignite-your-flame" element={<IgniteYourFlame />} />
                <Route path="/resources/peak-energy-profiler" element={<PeakEnergyProfiler />} />
                <Route path="/article/:slug" element={<ArticleDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/free-consultation" element={<FreeConsultation />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/search" element={<Search />} />
                <Route path="/community" element={<Community />} />
                <Route path="/press" element={<Press />} />
                <Route path="/_schema-check" element={<SchemaCheck />} />
                       <Route path="/solutions/:slug" element={<ProductDetail productType={'solution'} />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CookieConsent />
          </>
        } />
        </Routes>
      </AnimationProvider>
    </AccessibilityProvider>
  )
}

export default App

