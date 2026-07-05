import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLenis } from './LenisProvider'

/**
 * Scroll-linked vertical shift for section decors.
 * Returns px offset — positive when section center is below viewport center.
 * @param {React.RefObject<HTMLElement | null>} containerRef
 * @param {{ intensity?: number }} options
 */
export function useSectionScrollParallax(containerRef, { intensity = 48 } = {}) {
  const lenis = useLenis()
  const reducedMotion = useReducedMotion()
  const [shift, setShift] = useState(0)

  useEffect(() => {
    const el = containerRef?.current
    if (!el || reducedMotion) {
      setShift(0)
      return undefined
    }

    const update = () => {
      const node = containerRef?.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight
      const centerDelta = rect.top + rect.height * 0.5 - vh * 0.5
      const normalized = Math.max(-1, Math.min(1, centerDelta / (vh * 0.5)))
      setShift(normalized * intensity)
    }

    update()

    if (lenis) {
      lenis.on('scroll', update)
      return () => lenis.off('scroll', update)
    }

    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [containerRef, lenis, reducedMotion, intensity])

  return shift
}
