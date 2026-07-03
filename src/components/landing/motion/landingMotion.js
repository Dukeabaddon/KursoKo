/** Landing motion tokens — single source of truth for hero + scroll reveal */

export const LANDING_EASE = [0.22, 1, 0.36, 1]

export const LANDING_VIEWPORT = {
  once: false,
  amount: 0.25,
  margin: '-8% 0px -8% 0px',
}

export const HERO_MOTION = {
  decorBaseDelay: 1.9,
  decorStagger: 0.12,
  decorY: 16,
  decorDuration: 0.55,
  sequence: {
    title: { delay: 0.15, y: 32, duration: 0.65 },
    body: { delay: 0.35, y: 24, duration: 0.6 },
    bust: { delay: 1.35, y: 40, duration: 0.8 },
    cta: { delay: 1, y: 20, duration: 0.75, scale: 0.96 },
    glow: { delay: 1.25, y: 0, duration: 0.9 },
  },
}

export function decorMotionDelay(index) {
  return HERO_MOTION.decorBaseDelay + index * HERO_MOTION.decorStagger
}

/** Framer Motion props for scroll-triggered reveal (resets when scrolled away). */
export function motionRevealProps(
  { delay = 0, y = 28, duration = 0.6, scale = 1 },
  reducedMotion,
) {
  if (reducedMotion) {
    return {}
  }

  return {
    initial: { opacity: 0, y, scale },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: LANDING_VIEWPORT,
    transition: { duration, delay, ease: LANDING_EASE },
  }
}
