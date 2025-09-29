import { Routes, Route } from 'react-router-dom'
import { HashAnchorRouter } from '@/components/HashAnchorRouter'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import { SEO } from '@/components/SEO'
import { Analytics } from '@/components/Analytics'
import { useScrollToTop } from '@/hooks/useScrollToTop'

// Pages
import { Home } from '@/pages/Home'
import { Individuals } from '@/pages/Individuals'
import { Organizations } from '@/pages/Organizations'
import { Programs } from '@/pages/Programs'
import { ProgramDetail } from '@/pages/ProgramDetail'
import { ExperienceDetail } from '@/pages/ExperienceDetail'
import { Resources } from '@/pages/Resources'
import { ResourceDetail } from '@/pages/ResourceDetail'
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
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { DynamicEditor } from '@/pages/admin/DynamicEditor'
import { TestimonialsManager } from '@/pages/admin/TestimonialsManager'
import { ProgramsManagement } from '@/pages/admin/ProgramsManagement'
import { ExperiencesManagement } from '@/pages/admin/ExperiencesManagement'
import { SolutionsManagement } from '@/pages/admin/SolutionsManagement'
import { PagesManagement } from '@/pages/admin/PagesManagement'
import { NavigationManagement } from '@/pages/admin/NavigationManagement'
import { SettingsManagement } from '@/pages/admin/SettingsManagement'

function App() {
  useScrollToTop()

  return (
    <>
      <SEO />
      <Analytics />
      <HashAnchorRouter />
      <Routes>
        {/* Admin routes - no header/footer */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/programs" element={<ProgramsManagement />} />
        <Route path="/admin/programs/:id" element={<DynamicEditor />} />
        <Route path="/admin/experiences" element={<ExperiencesManagement />} />
        <Route path="/admin/experiences/:id" element={<DynamicEditor />} />
        <Route path="/admin/solutions" element={<SolutionsManagement />} />
        <Route path="/admin/solutions/:id" element={<DynamicEditor />} />
        <Route path="/admin/pages" element={<PagesManagement />} />
        <Route path="/admin/pages/:id" element={<DynamicEditor />} />
        <Route path="/admin/testimonials" element={<TestimonialsManager />} />
        <Route path="/admin/testimonials/:id" element={<DynamicEditor />} />
        <Route path="/admin/navigation" element={<NavigationManagement />} />
        <Route path="/admin/navigation/:id" element={<DynamicEditor />} />
        <Route path="/admin/settings" element={<SettingsManagement />} />
        <Route path="/admin/settings/:id" element={<DynamicEditor />} />
        
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
                <Route path="/programs/:slug" element={<ProgramDetail />} />
                <Route path="/experiences/:slug" element={<ExperienceDetail />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/ignite-your-flame" element={<IgniteYourFlame />} />
                <Route path="/resources/peak-energy-profiler" element={<PeakEnergyProfiler />} />
                <Route path="/resources/:slug" element={<ResourceDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/free-consultation" element={<FreeConsultation />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/search" element={<Search />} />
                <Route path="/community" element={<Community />} />
                <Route path="/press" element={<Press />} />
                <Route path="/_schema-check" element={<SchemaCheck />} />
                <Route path="/solutions/:slug" element={<SolutionDetail />} />
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
    </>
  )
}

export default App

