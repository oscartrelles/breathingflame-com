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
import { ProgramsListing } from '@/pages/ProgramsListing'
import { Experiences } from '@/pages/Experiences'
import { Resources } from '@/pages/Resources'
import { ResourceDetail } from '@/pages/ResourceDetail'
import { IgniteYourFlame } from '@/pages/resources/IgniteYourFlame'
import { PeakEnergyProfiler } from '@/pages/resources/PeakEnergyProfiler'
import { Blog } from '@/pages/Blog'
import { BlogDetail } from '@/pages/BlogDetail'
import { Events } from '@/pages/Events'
import { Testimonials } from '@/pages/Testimonials'
import { About } from '@/pages/About'
import { Contact } from '@/pages/Contact'
import { Sitemap } from '@/pages/Sitemap'
import { FreeConsultation } from '@/pages/FreeConsultation'
import { Privacy } from '@/pages/Privacy'
import { Terms } from '@/pages/Terms'
import { NotFound } from '@/pages/NotFound'

function App() {
  useScrollToTop()

  return (
    <>
      <SEO />
      <Analytics />
      <HashAnchorRouter />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/individuals" element={<Individuals />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/programs" element={<ProgramsListing />} />
          <Route path="/programs/:slug" element={<Programs />} />
          <Route path="/experiences/:slug" element={<Experiences />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/ignite-your-flame" element={<IgniteYourFlame />} />
          <Route path="/resources/peak-energy-profiler" element={<PeakEnergyProfiler />} />
          <Route path="/resources/:slug" element={<ResourceDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/free-consultation" element={<FreeConsultation />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default App

