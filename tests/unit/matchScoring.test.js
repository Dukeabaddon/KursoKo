import { describe, it, expect } from 'vitest'
import { cosineSimilarity, toFitPercent, getFitTierLabel } from '../../src/utils/matchScoring.js'

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
})
