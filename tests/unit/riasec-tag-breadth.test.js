import { describe, it, expect } from 'vitest'
import universities from '../../src/data/universities.json'

const BROAD_THRESHOLD = 5

describe('university RIASEC tag breadth', () => {
  it('no school has 5+ riasecTags (copy-paste broad tags)', () => {
    const broad = universities.universities.filter(
      (u) => (u.riasecTags?.length ?? 0) >= BROAD_THRESHOLD
    )
    expect(broad.map((u) => u.id)).toEqual([])
  })

  it('most schools have 2–4 focused riasecTags', () => {
    const counts = universities.universities.map((u) => u.riasecTags?.length ?? 0)
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length
    expect(avg).toBeGreaterThan(1.5)
    expect(avg).toBeLessThan(4.5)
  })
})
