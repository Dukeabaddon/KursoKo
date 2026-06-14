import Navbar from '../Navbar'
import FeaturesGrid from '../Home/FeaturesGrid'
import FAQSection from '../Home/FAQSection'
import WhyHowSection from '../Home/WhyHowSection'
import HeroSection from './HeroSection'
import { landingFold, landingPage } from './landingClasses'

const HomePage = ({ onStartQuestionnaire }) => (
  <div className={landingPage}>
    <div className={landingFold}>
      <Navbar onStart={onStartQuestionnaire} />
      <HeroSection onStart={onStartQuestionnaire} />
    </div>

    <div className="flex flex-col" aria-label="KursoKo Homepage">
      <div className="flex flex-col gap-20 py-16 sm:gap-24 sm:py-20 md:gap-32 md:py-24">
        <WhyHowSection />
        <FeaturesGrid />
        <FAQSection onStart={onStartQuestionnaire} />
      </div>
    </div>
  </div>
)

export default HomePage
