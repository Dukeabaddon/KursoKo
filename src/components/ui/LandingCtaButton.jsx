import { landingCtaFancy } from '../landing/landingClasses'

/**
 * Primary landing CTA with shine sweep — motion in src/styles/landing/animations.css
 */
const LandingCtaButton = ({
  children,
  onClick,
  className = '',
  type = 'button',
  ariaLabel
}) => (
  <button
    type={type}
    onClick={onClick}
    aria-label={ariaLabel}
    className={`${landingCtaFancy} ${className}`}
  >
    <span className="landing-cta-fancy-shine" aria-hidden="true" />
    <span className="relative z-[2]">{children}</span>
  </button>
)

export default LandingCtaButton
