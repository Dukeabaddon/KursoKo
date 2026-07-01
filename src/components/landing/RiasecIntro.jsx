import { riasecStickers } from './landingAssets'
import LandingBlobs from './LandingBlobs'
import RiasecCard from './RiasecCard'

const RiasecIntro = () => (
  <section
    id="riasec"
    aria-labelledby="riasec-heading"
    className="landing-section landing-section--riasec landing-section--blobs"
  >
    <LandingBlobs variant="lavender-teal" />
    <div className="landing-section__inner">
      <div className="landing-section__header">
        <p className="landing-eyebrow">Know yourself</p>
        <h2 id="riasec-heading" className="landing-heading">
          What is RIASEC?
        </h2>
        <p className="landing-lead">
          KursoKo uses the same Holland Code framework trusted by tools like{' '}
          <a
            href="https://scope.sti.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-link"
          >
            SCOPE
          </a>{' '}
          and the U.S.{' '}
          <a
            href="https://www.mynextmove.org/explore/ip"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-link"
          >
            O*NET Interest Profiler
          </a>
          . Six interest types help you see which work environments and paths fit you best — at any
          stage of life.
        </p>
      </div>

      <ul className="landing-riasec-grid">
        {riasecStickers.map((item) => (
          <li key={item.code}>
            <RiasecCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default RiasecIntro
