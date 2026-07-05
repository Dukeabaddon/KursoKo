/**
 * #hero — motion state
 * useHeroSection  — SVG ids + reduced motion + entrance motion props per element
 * useHeroDecorItem — drift-ready gate for a floating decor prop
 */
import { useCallback, useId, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { HERO_MOTION, heroEntranceMotionProps } from '../motion'

export function useHeroSection() {
  const gradientId = useId().replace(/:/g, '')
  const clipId = `${gradientId}-clip`
  const reducedMotion = useReducedMotion()

  return {
    gradientId,
    clipId,
    titleMotion: heroEntranceMotionProps(HERO_MOTION.sequence.title, reducedMotion),
    bodyMotion: heroEntranceMotionProps(HERO_MOTION.sequence.body, reducedMotion),
    ctaMotion: heroEntranceMotionProps(HERO_MOTION.sequence.cta, reducedMotion),
    bustMotion: heroEntranceMotionProps(HERO_MOTION.sequence.bust, reducedMotion),
    glowMotion: heroEntranceMotionProps(HERO_MOTION.sequence.glow, reducedMotion),
  }
}

export function useHeroDecorItem() {
  const reducedMotion = useReducedMotion()
  const [driftReady, setDriftReady] = useState(reducedMotion)
  const onDriftReady = useCallback(() => setDriftReady(true), [])

  return { reducedMotion, driftReady, onDriftReady }
}
