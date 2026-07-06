import { describe, it, expect } from 'vitest'
import { getUniversityMatchesForCareer } from '../../src/utils/universityMatcher.js'
import { archetypeProfile } from './helpers.js'

const PROGRAM_CAREERS = [
  'criminology-graduate',
  'dentist',
  'nurse',
  'software-engineer',
  'lawyer',
  'electrician',
  'military-officer',
  'seafarer-deck-officer',
]

describe('school program-keyword gate (no RIASEC-only false positives)', () => {
  it('UP Diliman does not rank for criminology without a criminology program', () => {
    const profile = archetypeProfile('S', 'E')
    const career = { id: 'criminology-graduate', title: 'Criminology Graduate' }
    const schools = getUniversityMatchesForCareer(profile, career, 20)
    const ids = schools.map((s) => s.id)
    expect(ids).not.toContain('up-diliman')
    expect(ids).toContain('bestlink')
  })

  it('UP Diliman still ranks for software engineer (has CS/engineering programs)', () => {
    const profile = archetypeProfile('I', 'C')
    const career = { id: 'software-engineer', title: 'Software Engineer' }
    const schools = getUniversityMatchesForCareer(profile, career, 15)
    expect(schools.map((s) => s.id)).toContain('up-diliman')
  })

  it('program careers never list schools with zero keyword hits', () => {
    const profile = archetypeProfile('S', 'I')
    for (const careerId of PROGRAM_CAREERS) {
      const career = { id: careerId, title: careerId }
      const schools = getUniversityMatchesForCareer(profile, career, 25)
      for (const school of schools) {
        expect(
          school.keywordHits ?? 0,
          `${school.id} listed for ${careerId} with no program keywords`
        ).toBeGreaterThan(0)
      }
    }
  })
})
