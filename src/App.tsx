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
  )
}

export default App

