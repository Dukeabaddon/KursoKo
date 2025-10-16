/**
 * HomePage
 * Composes homepage sections and wires the primary CTA handler.
 */
import Navbar from '../Navbar'
import HeroSection from './HeroSection'
import WhyHowSection from './WhyHowSection'
import FeaturesGrid from './FeaturesGrid'
import FAQSection from './FAQSection'

const HomePage = ({ onStartQuestionnaire }) => (
  <div className="min-h-screen w-full bg-neutral-50">
    <Navbar onStart={onStartQuestionnaire} />
    {/* Skip link for accessibility */}
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg"
    >
      Skip to main content
    </a>

    <main id="main" role="main" aria-label="KursoKo Homepage" className="flex flex-col">
      <HeroSection onStart={onStartQuestionnaire} />

      <div className="flex flex-col gap-20 bg-neutral-50 py-16 sm:gap-24 sm:py-20 md:gap-32 md:py-24">
        <WhyHowSection />
        <FeaturesGrid />
        <FAQSection onStart={onStartQuestionnaire} />
      </div>
    </main>
  </div>
)

export default HomePage
