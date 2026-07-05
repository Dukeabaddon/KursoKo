import { useEffect, useRef, useState } from 'react'

export const NAV_MODES = {
  REST: 'rest',
  PILL: 'pill',
  HIDDEN: 'hidden',
}

/** Full-width bar only when document scroll is at the very top */
export const REST_TOP = 8
/** px scrolled down after morph delay before hiding */
export const HIDE_DELTA = 40
/** Wait for pill morph animation before allowing hide */
export const MORPH_DELAY_MS = 400

/**
 * Pure scroll FSM — testable without React/DOM.
 * REST uses page scrollY (Lenis), not viewport position.
 * Once past top, ignore sub-threshold jitter until scrollY <= 1.
 */
export function reduceNavbarScrollState(state, scrollY, delta, now = Date.now()) {
  const y = Math.max(0, scrollY)
  let { mode, pillEnteredAt, accumulatedDown, hasScrolledPastTop } = state

  if (y >= REST_TOP) {
    hasScrolledPastTop = true
  }

  if (y < REST_TOP) {
    if (!hasScrolledPastTop || y <= 1) {
      return {
        mode: NAV_MODES.REST,
        pillEnteredAt: null,
        accumulatedDown: 0,
        hasScrolledPastTop: false,
      }
    }

    // Lenis/scroll jitter near top while user is not at landing top — stay pill
    return {
      mode: NAV_MODES.PILL,
      pillEnteredAt,
      accumulatedDown,
      hasScrolledPastTop: true,
    }
  }

  if (mode === NAV_MODES.REST) {
    mode = NAV_MODES.PILL
    pillEnteredAt = now
  }

  if (delta < 0) {
    accumulatedDown = 0
    if (mode === NAV_MODES.HIDDEN) {
      mode = NAV_MODES.PILL
    }
    return { mode, pillEnteredAt, accumulatedDown, hasScrolledPastTop }
  }

  if (delta > 0) {
    const morphReady = pillEnteredAt != null && now - pillEnteredAt >= MORPH_DELAY_MS

    if (!morphReady) {
      if (mode === NAV_MODES.HIDDEN) {
        mode = NAV_MODES.PILL
      }
      return { mode, pillEnteredAt, accumulatedDown, hasScrolledPastTop }
    }

    accumulatedDown += delta
    if (accumulatedDown >= HIDE_DELTA) {
      return {
        mode: NAV_MODES.HIDDEN,
        pillEnteredAt,
        accumulatedDown,
        hasScrolledPastTop,
      }
    }
  }

  if (mode !== NAV_MODES.HIDDEN) {
    mode = NAV_MODES.PILL
  }

  return { mode, pillEnteredAt, accumulatedDown, hasScrolledPastTop }
}

/**
 * Scroll-driven navbar: rest (top only) → pill → hidden on scroll down.
 * @param {import('lenis').default | null} lenis
 */
export function useScrollNavbar(lenis) {
  const [mode, setMode] = useState(NAV_MODES.REST)
  const lastScrollY = useRef(0)
  const stateRef = useRef({
    mode: NAV_MODES.REST,
    pillEnteredAt: null,
    accumulatedDown: 0,
    hasScrolledPastTop: false,
  })

  useEffect(() => {
    const update = (scrollY) => {
      const delta = scrollY - lastScrollY.current
      lastScrollY.current = scrollY
      stateRef.current = reduceNavbarScrollState(stateRef.current, scrollY, delta)
      setMode(stateRef.current.mode)
    }

    if (lenis) {
      const onLenisScroll = (instance) => update(instance.scroll)
      lenis.on('scroll', onLenisScroll)
      update(lenis.scroll)
      return () => lenis.off('scroll', onLenisScroll)
    }

    const onScroll = () => update(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [lenis])

  return {
    mode,
    isRest: mode === NAV_MODES.REST,
    isPill: mode === NAV_MODES.PILL,
    isHidden: mode === NAV_MODES.HIDDEN,
  }
}
