/** Landing motion tokens — single source of truth for hero + scroll reveal */

export const LANDING_EASE = [0.22, 1, 0.36, 1]

export const LANDING_VIEWPORT = {
  once: false,
  amount: 0.25,
  margin: '-8% 0px -8% 0px',
}

export const HERO_MOTION = {
  decorBaseDelay: 1.65,
  decorStagger: 0.12,
  decorY: 16,
  decorDuration: 0.55,
  sequence: {
    eyebrow: { delay: 0, y: 12, duration: 0.38 },
    title: { delay: 0.08, y: 32, duration: 0.48 },
    body: { delay: 0.2, y: 24, duration: 0.42 },
    bust: { delay: 1.05, y: 40, duration: 0.75 },
    cta: { delay: 0.45, y: 20, duration: 0.55, scale: 0.96 },
    glow: { delay: 0.95, y: 0, duration: 0.85 },
  },
}

export function decorMotionDelay(index) {
  return HERO_MOTION.decorBaseDelay + index * HERO_MOTION.decorStagger
}

/** Hero fold — animate on mount; whileInView often never fires above the fold. */
export function heroEntranceMotionProps(
  { delay = 0, y = 28, duration = 0.6, scale = 1 },
  reducedMotion,
) {
  if (reducedMotion) {
    return {}
  }

  return {
    initial: { opacity: 0, y, scale },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration, delay, ease: LANDING_EASE },
  }
}
