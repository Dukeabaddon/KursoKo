/** Animated + ↔ − morph for FAQ accordion */
const FaqToggleIcon = ({ open }) => (
  <span className={`faq-toggle-icon${open ? ' faq-toggle-icon--open' : ''}`} aria-hidden="true">
    <span className="faq-toggle-icon__bar faq-toggle-icon__bar--h" />
    <span className="faq-toggle-icon__bar faq-toggle-icon__bar--v" />
  </span>
)

export default FaqToggleIcon
