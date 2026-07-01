import Navbar from '../Navbar'
import FeaturesGrid from '../Home/FeaturesGrid'
import FAQSection from '../Home/FAQSection'
import HeroSection from './HeroSection'
import StatsBar from './StatsBar'
import RiasecIntro from './RiasecIntro'
import HowItWorks from './HowItWorks'
import { landingFold, landingPage } from './landingClasses'

const HomePage = ({ onStartQuestionnaire }) => (
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
)

export default HomePage
