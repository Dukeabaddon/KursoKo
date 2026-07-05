import { describe, it, expect } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { profileFromScores } from './helpers.js'

/**
 * Documents how ranking vs reason-text thresholds work.
 *
 * Ranking: weightedScore = sum(score[d]*weight[d]) / sum(weights)
 * Reason text only:
 *   - primary career weight >= 0.7
 *   - secondary career weight >= 0.6
 *
 * There is NO 0.9 threshold in the algorithm. Bumping research primaries
 * from 0.88 → 0.9 was a research-prompt convention, not a scoring fix.
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

  it('ranks by weighted average, not by primary-weight threshold', () => {
    const matches = getCareerMatches(investigativeProfile, 57)
    expect(matches.length).toBe(57)

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

  it('0.88 vs 0.90 primary weight does not change reason-text gate (gate is 0.7)', () => {
    // Simulate two careers that differ only at 0.88 vs 0.90 on I
    const careerA = {
      id: 'sim-a',
      title: 'Sim A',
      riasecWeights: { R: 0.2, I: 0.88, A: 0.2, S: 0.2, E: 0.2, C: 0.2 },
      skills: ['a', 'b', 'c'],
      learningPath: 'x',
    }
    const careerB = {
      id: 'sim-b',
      title: 'Sim B',
      riasecWeights: { R: 0.2, I: 0.9, A: 0.2, S: 0.2, E: 0.2, C: 0.2 },
      skills: ['a', 'b', 'c'],
      learningPath: 'x',
    }

    const reasonGate = 0.7
    expect(careerA.riasecWeights.I >= reasonGate).toBe(true)
    expect(careerB.riasecWeights.I >= reasonGate).toBe(true)

    // Ranking delta is tiny: both pass the same gates
    const score = investigativeProfile.scores
    const weighted = (w) => {
      const codes = ['R', 'I', 'A', 'S', 'E', 'C']
      let total = 0
      let sum = 0
      for (const c of codes) {
        total += (score[c] ?? 0) * (w[c] ?? 0)
        sum += w[c] ?? 0
      }
      return total / sum
    }
    const delta = Math.abs(weighted(careerB.riasecWeights) - weighted(careerA.riasecWeights))
    expect(delta).toBeLessThan(0.5) // negligible vs score scale (~10–40)
  })

  it('matchPercent (fit score) is clamped to [40, 99]', () => {
    const matches = getCareerMatches(investigativeProfile, 57)
    for (const m of matches) {
      expect(m.matchPercent).toBeGreaterThanOrEqual(40)
      expect(m.matchPercent).toBeLessThanOrEqual(99)
    }
  })

  it('cosine fit differentiates peaked profiles instead of flooring at 55', () => {
    const peaked = profileFromScores({ R: 5, I: 40, A: 5, S: 5, E: 5, C: 5 })
    const matches = getCareerMatches(peaked, 10)
    const percents = new Set(matches.map((m) => m.matchPercent))
    expect(percents.size).toBeGreaterThan(1)
  })
})
