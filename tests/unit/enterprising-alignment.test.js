import { describe, it, expect } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { getScholarshipMatchesForCareer } from '../../src/utils/scholarshipMatcher.js'
import { profileFromScores, archetypeProfile } from './helpers.js'

describe('enterprising profile alignment', () => {
  it('E+R user ranks entrepreneur above seafarer', () => {
    const profile = profileFromScores({ R: 28, I: 12, A: 10, S: 14, E: 40, C: 18 })
    const top = getCareerMatches(profile, 5).map((c) => c.id)
    expect(top[0]).toBe('entrepreneur')
    expect(top).not.toContain('seafarer-deck-officer')
  })

  it('high E+R+S does not rank seafarer first', () => {
    const profile = profileFromScores({ R: 32, I: 14, A: 8, S: 22, E: 36, C: 12 })
    const top = getCareerMatches(profile, 3).map((c) => c.id)
    expect(top[0]).not.toBe('seafarer-deck-officer')
  })

  it('pure E archetype surfaces business careers', () => {
    const profile = archetypeProfile('E', 'C')
    const top = getCareerMatches(profile, 3).map((c) => c.id)
    expect(top).toContain('entrepreneur')
    expect(top).not.toContain('seafarer-deck-officer')
  })

  it('entrepreneur scholarships exclude military mis-tags', () => {
    const profile = archetypeProfile('E', 'C')
    const career = getCareerMatches(profile, 1)[0]
    const funds = getScholarshipMatchesForCareer(profile, career, [], 12, null)
    const names = funds.map((s) => s.name)
    expect(names).not.toContain('Philippine Army Officer Candidate Course (OCC) Scholarship')
    expect(names).not.toContain('Philippine Air Force Flying Scholarship / AFROTC Scholarship')
  })
})
