import { describe, expect, it } from 'vitest'
import {
  NAV_MODES,
  MORPH_DELAY_MS,
  reduceNavbarScrollState,
} from '../../src/components/landing/motion/useScrollNavbar.js'

const INITIAL = {
  mode: NAV_MODES.REST,
  pillEnteredAt: null,
  accumulatedDown: 0,
  hasScrolledPastTop: false,
}

describe('reduceNavbarScrollState', () => {
  it('starts at rest when scroll is at top', () => {
    const next = reduceNavbarScrollState(INITIAL, 0, 0, 1000)
    expect(next.mode).toBe(NAV_MODES.REST)
  })

  it('enters pill when leaving top and stays pill when scrolling up in the middle', () => {
    const t0 = 1000
    let state = reduceNavbarScrollState(INITIAL, 120, 120, t0)
    expect(state.mode).toBe(NAV_MODES.PILL)

    state = reduceNavbarScrollState(state, 100, -20, t0 + 50)
    expect(state.mode).toBe(NAV_MODES.PILL)
  })

  it('does not hide until morph delay elapses', () => {
    const t0 = 1000
    let state = reduceNavbarScrollState(INITIAL, 80, 80, t0)
    state = reduceNavbarScrollState(state, 200, 120, t0 + 100)
    expect(state.mode).toBe(NAV_MODES.PILL)

    state = reduceNavbarScrollState(state, 260, 60, t0 + MORPH_DELAY_MS)
    expect(state.mode).toBe(NAV_MODES.HIDDEN)
  })

  it('returns to rest only at the very top', () => {
    const t0 = 1000
    let state = reduceNavbarScrollState(INITIAL, 500, 500, t0)
    state = reduceNavbarScrollState(state, 560, 60, t0 + MORPH_DELAY_MS)
    expect(state.mode).toBe(NAV_MODES.HIDDEN)

    state = reduceNavbarScrollState(state, 0, -560, t0 + MORPH_DELAY_MS + 100)
    expect(state.mode).toBe(NAV_MODES.REST)
  })

  it('never returns to rest while still scrolled down', () => {
    const t0 = 1000
    let state = reduceNavbarScrollState(INITIAL, 400, 400, t0)
    state = reduceNavbarScrollState(state, 380, -20, t0 + 100)
    expect(state.mode).toBe(NAV_MODES.PILL)
  })

  it('ignores scroll jitter near top after user has scrolled past', () => {
    const t0 = 1000
    let state = reduceNavbarScrollState(INITIAL, 200, 200, t0)
    state = reduceNavbarScrollState(state, 5, -195, t0 + 50)
    expect(state.mode).toBe(NAV_MODES.PILL)
    expect(state.hasScrolledPastTop).toBe(true)
  })
})
