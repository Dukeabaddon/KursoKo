import Navbar from '../public/Navbar'
import { HeroSection } from './hero'
import { StatsBar } from './stats'
import { RiasecIntro } from './riasec'
import { HowItWorks } from './how-it-works'
import { FeaturesGrid } from './features'
import { FAQSection } from './faq'
import { LenisProvider } from './motion'
import { landingFold, landingPage } from './landingClasses'

const HomePage = ({ onStartQuestionnaire }) => (
  <LenisProvider>
    <div className={landingPage}>
      <div className={landingFold}>
        <Navbar onStart={onStartQuestionnaire} />
        <HeroSection onStart={onStartQuestionnaire} />
      </div>

      <div className="landing-page-body flex flex-col" aria-label="KursoKo Homepage">
        <StatsBar />
        <RiasecIntro />
        <HowItWorks onStart={onStartQuestionnaire} />
        <FeaturesGrid />
        <FAQSection onStart={onStartQuestionnaire} />
      </div>
    </div>
  </LenisProvider>
)

export default HomePage
