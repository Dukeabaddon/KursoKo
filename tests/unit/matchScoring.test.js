import { describe, it, expect } from 'vitest'
import {
  cosineSimilarity,
  toFitPercent,
  getFitTierLabel,
  hollandAlignmentBonus,
  blendedCareerScore,
} from '../../src/utils/matchScoring.js'

describe('matchScoring', () => {
  it('cosineSimilarity returns high value for aligned vectors', () => {
    const scores = { R: 10, I: 40, A: 5, S: 5, E: 5, C: 5 }
    const weights = { R: 0.1, I: 0.9, A: 0.1, S: 0.1, E: 0.1, C: 0.1 }
    expect(cosineSimilarity(scores, weights)).toBeGreaterThan(0.98)
  })

  it('toFitPercent maps 0–1 cosine to 0–100 alignment meter', () => {
    expect(toFitPercent(0)).toBe(0)
    expect(toFitPercent(1)).toBe(100)
    expect(toFitPercent(0.98)).toBe(98)
  })

  it('getFitTierLabel maps rank index to student-friendly tiers', () => {
    expect(getFitTierLabel(0)).toBe('Top match')
    expect(getFitTierLabel(1)).toBe('Strong match')
    expect(getFitTierLabel(3)).toBe('Good match')
  })

  it('hollandAlignmentBonus favors primary-primary match', () => {
    const entrepreneur = { R: 0.35, I: 0.45, A: 0.4, S: 0.55, E: 0.95, C: 0.5 }
    const seafarer = { R: 0.9, I: 0.65, A: 0.3, S: 0.45, E: 0.6, C: 0.55 }
    const userTop2 = ['E', 'R']
    expect(hollandAlignmentBonus(userTop2, entrepreneur)).toBeGreaterThan(
      hollandAlignmentBonus(userTop2, seafarer)
    )
  })

  it('blendedCareerScore ranks entrepreneur above seafarer for E+R user', () => {
    const scores = { R: 28, I: 12, A: 10, S: 14, E: 40, C: 18 }
    const entrepreneur = { R: 0.35, I: 0.45, A: 0.4, S: 0.55, E: 0.95, C: 0.5 }
    const seafarer = { R: 0.9, I: 0.65, A: 0.3, S: 0.45, E: 0.6, C: 0.55 }
    const userTop2 = ['E', 'R']
    expect(blendedCareerScore(scores, entrepreneur, userTop2)).toBeGreaterThan(
      blendedCareerScore(scores, seafarer, userTop2)
    )
  })
})
