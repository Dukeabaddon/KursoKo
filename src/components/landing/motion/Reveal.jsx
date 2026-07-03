import { motion } from 'framer-motion'
import { LANDING_EASE, LANDING_VIEWPORT } from './landingMotion'

/**
 * Scroll reveal wrapper — animates in view, resets when scrolled away.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 28,
  duration = 0.6,
  scale = 1,
  reducedMotion = false,
  onEntranceComplete,
}) {
  if (reducedMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={LANDING_VIEWPORT}
      transition={{
        duration,
        delay,
        ease: LANDING_EASE,
        onComplete: onEntranceComplete,
      }}
    >
      {children}
    </motion.div>
  )
}
