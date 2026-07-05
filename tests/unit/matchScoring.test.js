import { describe, it, expect } from 'vitest'
import { cosineSimilarity, toFitPercent } from '../../src/utils/matchScoring.js'

describe('matchScoring', () => {
  it('cosineSimilarity returns 1 for identical direction vectors', () => {
    const scores = { R: 10, I: 40, A: 5, S: 5, E: 5, C: 5 }
    const weights = { R: 0.1, I: 0.9, A: 0.1, S: 0.1, E: 0.1, C: 0.1 }
    expect(cosineSimilarity(scores, weights)).toBeGreaterThan(0.98)
  })

  it('toFitPercent maps 0–1 cosine to 40–99 display band', () => {
    expect(toFitPercent(0)).toBe(40)
    expect(toFitPercent(1)).toBe(99)
    expect(toFitPercent(0.5)).toBeGreaterThanOrEqual(40)
    expect(toFitPercent(0.5)).toBeLessThanOrEqual(99)
  })
})
