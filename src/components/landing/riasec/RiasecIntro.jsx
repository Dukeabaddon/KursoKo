import { riasecStickers } from './riasecAssets'
import LandingBlobs from '../LandingBlobs'
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
          There&apos;s no single &ldquo;right&rdquo; student type. RIASEC shows six ways people lean
          — building, researching, creating, helping, leading, organizing — so you can explore paths
          that actually fit you, not what everyone else is doing.
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

export { RiasecIntro }
