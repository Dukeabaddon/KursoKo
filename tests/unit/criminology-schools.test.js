import { describe, it, expect } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { getUniversityMatchesForCareer } from '../../src/utils/universityMatcher.js'
import { archetypeProfile } from './helpers.js'

describe('criminology school matching', () => {
  it('surfaces Bestlink for criminology-graduate profile', () => {
    const profile = archetypeProfile('R', 'C')
    const career = getCareerMatches(profile, 15).find((c) => c.id === 'criminology-graduate')
    expect(career).toBeTruthy()
    const schools = getUniversityMatchesForCareer(profile, career, 15)
    const ids = schools.map((s) => s.id)
    expect(ids).toContain('bestlink')
  })
})
