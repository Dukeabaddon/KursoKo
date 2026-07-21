import { describe, it, expect } from 'vitest'
import {
  profileCorrelation,
  getProfileMatchDrivers,
  toFitPercent,
  getFitTierLabel,
} from '../../src/utils/matchScoring.js'

describe('matchScoring', () => {
  it('profileCorrelation returns 1 for the same RIASEC shape at different levels', () => {
    const scores = { R: 10, I: 40, A: 5, S: 5, E: 5, C: 5 }
    const weights = { R: 0.2, I: 0.8, A: 0.1, S: 0.1, E: 0.1, C: 0.1 }
    expect(profileCorrelation(scores, weights)).toBeCloseTo(1, 10)
  })

  it('toFitPercent maps positive correlation to a 0–100 alignment meter', () => {
    expect(toFitPercent(0)).toBe(0)
    expect(toFitPercent(1)).toBe(100)
    expect(toFitPercent(0.98)).toBe(98)
  })

  it('getFitTierLabel maps correlation percentages to calibrated tiers', () => {
    expect(getFitTierLabel(73)).toBe('Top match')
    expect(getFitTierLabel(61)).toBe('Strong match')
    expect(getFitTierLabel(43)).toBe('Good match')
    expect(getFitTierLabel(42)).toBe('Explore match')
  })

  it('returns high-interest drivers from the complete profile', () => {
    const scores = { R: 29.7, I: 6, A: 0, S: 29.7, E: 33, C: 3 }
    const enterprisingSocial = { R: 0.45, I: 0.45, A: 0.2, S: 0.7, E: 0.9, C: 0.5 }
    expect(getProfileMatchDrivers(scores, enterprisingSocial)).toEqual(['E', 'S'])
  })

  it('changes continuously across a near-tie boundary', () => {
    const enterprisingSocial = { R: 0.45, I: 0.45, A: 0.2, S: 0.7, E: 0.9, C: 0.5 }
    const low = { R: 29.7, I: 6, A: 0, S: 29.69, E: 33, C: 3 }
    const high = { ...low, S: 29.71 }
    expect(Math.abs(profileCorrelation(high, enterprisingSocial) - profileCorrelation(low, enterprisingSocial))).toBeLessThan(
      0.001,
    )
  })
})
