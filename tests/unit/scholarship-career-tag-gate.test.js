import { describe, it, expect } from 'vitest'
import scholarships from '../../src/data/scholarships.json'

const MAX_CAREER_TAGS = 3

describe('scholarship careerTag accuracy gate', () => {
  it('no scholarship has 4+ careerTags (boilerplate cap)', () => {
    const broad = scholarships.scholarships.filter(
      (s) => (s.careerTags?.length ?? 0) >= 4
    )
    expect(
      broad.map((s) => `${s.id}:${s.careerTags?.join('+')}`),
      '4+ careerTags remain'
    ).toEqual([])
  })

  it('tagged scholarships use at most 3 careerTags', () => {
    for (const sch of scholarships.scholarships) {
      const n = sch.careerTags?.length ?? 0
      if (n === 0) continue
      expect(n, sch.id).toBeLessThanOrEqual(MAX_CAREER_TAGS)
    }
  })
})
