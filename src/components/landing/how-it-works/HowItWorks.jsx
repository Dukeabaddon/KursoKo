import { howItWorksSteps } from './howItWorksAssets'
import LandingBlobs from '../LandingBlobs'

const HowItWorks = ({ onStart }) => (
  <section
    id="how"
    aria-labelledby="how-heading"
    className="landing-section landing-section--how landing-section--blobs scroll-mt-24"
  >
    <LandingBlobs variant="yellow-lavender" />
    <div className="landing-section__inner">
      <div className="landing-section__header">
        <p className="landing-eyebrow">How it works</p>
        <h2 id="how-heading" className="landing-heading">
          Three simple steps
        </h2>
        <p className="landing-lead">
          Discover which interests are strongest for you, then explore courses and careers that
          align — whether you’re choosing a track, a major, or your next move.
        </p>
      </div>

      <ol className="landing-steps">
        {howItWorksSteps.map((step, index) => (
          <li key={step.title} className="landing-step-card">
            <div className="landing-step-card__media">
              <div className="landing-step-card__frame">
                <span className="landing-step-card__badge" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <img
                  src={step.src}
                  alt={step.alt}
                  className="landing-step-card__img"
                  width={320}
                  height={240}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="landing-step-card__body">
              <h3 className="landing-step-card__title">{step.title}</h3>
              <p className="landing-step-card__text">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="landing-section__cta-row">
        <button type="button" onClick={onStart} className="landing-btn-primary">
          Start assessment
        </button>
      </div>
    </div>
  </section>
)

export { HowItWorks }
