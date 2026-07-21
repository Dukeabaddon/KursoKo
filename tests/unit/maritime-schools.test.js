import { describe, it, expect } from 'vitest'
import { getUniversityMatchesForCareer } from '../../src/utils/universityMatcher.js'
import { getScholarshipMatchesForCareer } from '../../src/utils/scholarshipMatcher.js'
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

  it('ranks verified BSMT schools for the seafarer path', () => {
    const schools = getUniversityMatchesForCareer(builderRsProfile(), career, 10)
    const ids = schools.map((s) => s.id)
    expect(schools[0].popularCourses.join(' ')).toMatch(/marine transportation/i)
    expect(ids).toContain('asian-institute-maritime-studies')
    expect(ids).toContain('cavite-maritime')
    expect(ids).toContain('maritime-academy-asia-pacific')
    expect(ids).toContain('philippine-merchant-marine-school-las-pinas')
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

  it('does not confuse aeronautical programs with nautical programs', () => {
    const ids = getUniversityMatchesForCareer(builderRsProfile(), career, 25).map(
      (school) => school.id,
    )
    for (const aviationId of ['psca', 'patts', 'mcl', 'wcc-aeronautical']) {
      expect(ids).not.toContain(aviationId)
    }
  })

  it('returns direct, institutional, and broad maritime funding options', () => {
    const profile = builderRsProfile()
    const schools = getUniversityMatchesForCareer(profile, career, 5)
    const scholarships = getScholarshipMatchesForCareer(profile, career, schools, null, null)
    const ids = scholarships.map((scholarship) => scholarship.id)

    expect(scholarships.length).toBeGreaterThanOrEqual(5)
    expect(ids).toContain('maap-cadetship-scholarship')
    expect(ids).toContain('owwa-scholarship')
    expect(ids).toContain('owwa-ofw-dsa')
    expect(ids).toContain('unifast-tes')
    expect(ids).toContain('unifast-tdp')
    expect(scholarships.some((scholarship) => /army|air force|navy|military/i.test(scholarship.name))).toBe(false)
  })
})
