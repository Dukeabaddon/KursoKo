/**
 * #riasec — section motion state
 * useRiasecDecor — section ref + reduced-motion flag for the cloud parallax decor
 */
import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export function useRiasecDecor() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  return { sectionRef, reducedMotion }
}
