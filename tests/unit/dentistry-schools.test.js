import { describe, it, expect } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { getUniversityMatchesForCareer } from '../../src/utils/universityMatcher.js'
import { archetypeProfile } from './helpers.js'

describe('dentistry career and schools', () => {
  it('includes dentist career for investigative + social profiles', () => {
    const profile = archetypeProfile('I', 'S')
    const ids = getCareerMatches(profile, 15).map((c) => c.id)
    expect(ids).toContain('dentist')
  })

  it('surfaces NU MOA, CEU, and UE Manila for dentist career', () => {
    const profile = archetypeProfile('I', 'S')
    const career = { id: 'dentist', title: 'Dentist (Doctor of Dental Medicine)' }
    const schools = getUniversityMatchesForCareer(profile, career, 20)
    const ids = schools.map((s) => s.id)
    expect(ids).toContain('nu-moa')
    expect(ids).toContain('ceu')
    expect(ids).toContain('ue-manila')
    expect(schools.find((s) => s.id === 'nu-moa')?.relevanceScore).toBeGreaterThanOrEqual(10)
  })
})
