import heroCloud from '../../../assets/landing/hero/cloud.webp'
import heroCloudAlt from '../../../assets/landing/hero/cloud2.webp'

/** Figma-aligned edge clouds — partially off-canvas left/right of RIASEC grid */
export const RIASEC_CLOUD_DECOR = [
  {
    id: 'riasec-cloud-left',
    src: heroCloud,
    side: 'left',
    top: '38%',
    inset: 'max(-42%, -11rem)',
    width: 'clamp(11rem, 24vw, 19rem)',
    opacity: 0.92,
    parallax: 0.55,
    idle: 'animate-landing-hero-drift-mirror',
    duration: '9s',
    delay: '0s',
  },
  {
    id: 'riasec-cloud-right',
    src: heroCloudAlt,
    side: 'right',
    top: '56%',
    inset: 'max(-38%, -9.5rem)',
    width: 'clamp(12rem, 26vw, 21rem)',
    opacity: 0.9,
    parallax: 1,
    idle: 'animate-landing-hero-drift',
    duration: '8s',
    delay: '-2.5s',
  },
]
