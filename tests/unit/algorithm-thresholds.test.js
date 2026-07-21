import { describe, it, expect } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { profileFromScores } from './helpers.js'

/**
 * Career ranking uses continuous Pearson correlation across all six RIASEC scores.
 * Results must be positively driven by the student's primary RIASEC interest.
 */
describe('career algorithm thresholds', () => {
  const investigativeProfile = profileFromScores({
    R: 12,
    I: 40,
    A: 14,
    S: 10,
    E: 11,
    C: 18,
  })

  it('ranks careers whose match is driven by the primary interest', () => {
    const matches = getCareerMatches(investigativeProfile, 59)
    expect(matches.length).toBeGreaterThanOrEqual(10)
    expect(matches.some((career) => career.id === 'military-officer')).toBe(false)
    expect(matches.every((career) => career.matchDrivers.includes('I'))).toBe(true)

    // Top career should lean Investigative; full top-5 can mix secondary fits
    const topIds = matches.slice(0, 5).map((m) => m.id)
    expect(matches[0].riasecWeights.I).toBeGreaterThanOrEqual(0.7)
    const avgTopI =
      matches.slice(0, 5).reduce((sum, m) => sum + m.riasecWeights.I, 0) / 5
    expect(avgTopI).toBeGreaterThanOrEqual(0.55)

    // Ordering is by matchPercent descending
    for (let i = 1; i < matches.length; i += 1) {
      expect(matches[i - 1].matchPercent).toBeGreaterThanOrEqual(matches[i].matchPercent)
    }

    expect(topIds.length).toBe(5)
  })

  it('does not let a negative limit leak almost the entire catalog', () => {
    expect(getCareerMatches(investigativeProfile, -1)).toEqual([])
  })

  it('matchPercent is a 0–100 alignment meter', () => {
    const matches = getCareerMatches(investigativeProfile, 59)
    for (const m of matches) {
      expect(m.matchPercent).toBeGreaterThanOrEqual(0)
      expect(m.matchPercent).toBeLessThanOrEqual(100)
    }
  })

  it('profile correlation differentiates peaked profiles', () => {
    const peaked = profileFromScores({ R: 5, I: 40, A: 5, S: 5, E: 5, C: 5 })
    const matches = getCareerMatches(peaked, 10)
    expect(matches.length).toBeGreaterThan(1)
    expect(matches.every((career) => career.matchDrivers.includes('I'))).toBe(true)
    // Ordering must be stable by matchPercent even when several share a band.
    for (let i = 1; i < matches.length; i += 1) {
      expect(matches[i - 1].matchPercent).toBeGreaterThanOrEqual(matches[i].matchPercent)
    }
  })
})
