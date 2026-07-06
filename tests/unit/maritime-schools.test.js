import { describe, it, expect } from 'vitest'
import { getUniversityMatchesForCareer } from '../../src/utils/universityMatcher.js'
import { profileFromScores } from './helpers.js'

/** Builder RS screenshot profile (R14 S13 E12). */
function builderRsProfile() {
  return profileFromScores({ R: 14, I: 7, A: 2, S: 13, E: 12, C: 3 })
}

describe('seafarer / maritime school matching', () => {
  const career = { id: 'seafarer-deck-officer', title: 'Seafarer / Deck Officer' }

  it('does not surface NU MOA (dental/hospitality campus, no BSMT)', () => {
    const schools = getUniversityMatchesForCareer(builderRsProfile(), career, 25)
    expect(schools.map((s) => s.id)).not.toContain('nu-moa')
  })

  it('surfaces Cavite Maritime Academy for seafarer path', () => {
    const schools = getUniversityMatchesForCareer(builderRsProfile(), career, 10)
    const ids = schools.map((s) => s.id)
    expect(ids).toContain('cavite-maritime')
    const cma = schools.find((s) => s.id === 'cavite-maritime')
    expect(cma?.keywordHits).toBeGreaterThan(0)
    expect(cma?.popularCourses?.join(' ')).toMatch(/marine transportation/i)
  })

  it('lists only schools whose programs mention maritime keywords', () => {
    const schools = getUniversityMatchesForCareer(builderRsProfile(), career, 25)
    for (const school of schools) {
      expect(school.keywordHits ?? 0, `${school.id} has no program-level maritime keywords`).toBeGreaterThan(
        0
      )
    }
  })
})
