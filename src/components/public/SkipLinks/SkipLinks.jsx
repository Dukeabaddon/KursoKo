/**
 * Keyboard skip links — hidden until focused.
 * Single app-wide implementation (no DOM injection).
 */
const SkipLinks = () => (
  <div className="skip-links" aria-label="Skip links">
    <a href="#main" className="skip-link">
      Skip to main content
    </a>
    <a href="#navigation" className="skip-link skip-link--second">
      Skip to navigation
    </a>
  </div>
)

export default SkipLinks
