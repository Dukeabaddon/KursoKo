/**
 * HomePage
 * Composes homepage sections and wires the primary CTA handler.
 */
import Navbar from '../Navbar'
import HeroSection from './HeroSection'
import ValueProposition from './ValueProposition'
import { RIASECCarousel } from './RIASECCarousel'
import HowItWorks from './HowItWorks'
import SampleQuestion from './SampleQuestion'
import FinalCTA from './FinalCTA'

const HomePage = ({ onStartQuestionnaire }) => {
  return (
  <div className="min-h-screen w-full bg-[var(--color-neutral-50)]">
      <Navbar onStart={onStartQuestionnaire} />
      {/* Skip link for accessibility */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-slate-900 px-3 py-2 rounded-md shadow-md">
        Skip to main content
      </a>

      <main id="main" role="main" aria-label="KursoKo Homepage" className="flex flex-col gap-24 sm:gap-28 md:gap-32 px-4 sm:px-6 md:px-8">
        <HeroSection onStart={onStartQuestionnaire} />
        <section aria-labelledby="value-prop-heading" className="max-w-6xl mx-auto">
          <ValueProposition />
        </section>
        <section className="max-w-6xl mx-auto">
          <RIASECCarousel />
        </section>
        <section aria-labelledby="how-heading" className="max-w-6xl mx-auto">
          <HowItWorks />
        </section>
        <section aria-labelledby="sample-heading" className="max-w-4xl mx-auto">
          <SampleQuestion onStart={onStartQuestionnaire} />
        </section>
        <section aria-labelledby="final-cta-heading" className="max-w-5xl mx-auto">
          <FinalCTA onStart={onStartQuestionnaire} />
        </section>
      </main>
    </div>
  )
}

export default HomePage
