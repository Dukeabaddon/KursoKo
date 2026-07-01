/** Decorative blobs — parent section needs `landing-section--blobs` + `overflow: visible` */
const LandingBlobs = ({ variant = 'lavender-teal' }) => (
  <div className={`landing-section__blobs landing-section__blobs--${variant}`} aria-hidden="true" />
)

export default LandingBlobs
