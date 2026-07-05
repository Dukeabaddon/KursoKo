import Navbar from '../public/Navbar'
import { HeroSection } from './hero'
import { StatsBar } from './stats'
import { RiasecIntro } from './riasec'
import { HowItWorks } from './how-it-works'
import { FeaturesSection } from './features'
import { FAQSection } from './faq'
import { LandingFooter } from './footer'
import { LenisProvider } from './motion'
import { landingFold, landingPage } from './landingClasses'

const HomePage = ({ onStartQuestionnaire }) => (
  <LenisProvider>
    <div className={landingPage}>
      <Navbar onStart={onStartQuestionnaire} />

      <div className={landingFold}>
        <HeroSection onStart={onStartQuestionnaire} />
      </div>

      <div className="landing-page-body flex flex-col" aria-label="KursoKo Homepage">
        <StatsBar />
        <RiasecIntro />
        <HowItWorks onStart={onStartQuestionnaire} />
        <FeaturesSection />
        <FAQSection onStart={onStartQuestionnaire} />
      </div>

      <LandingFooter onStart={onStartQuestionnaire} />
    </div>
  </LenisProvider>
)

export default HomePage
