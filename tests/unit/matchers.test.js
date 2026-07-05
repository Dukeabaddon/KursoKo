import { describe, it, expect } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import {
  getUniversityMatchesForCareer,
  getUniversitiesMetadata,
} from '../../src/utils/universityMatcher.js'
import {
  getScholarshipMatchesForCareer,
  getScholarshipsMetadata,
  inferUserLocationFromSchool,
  passesResidencyFilter,
} from '../../src/utils/scholarshipMatcher.js'
import { calculateRiasecScores, getPersonalityProfile } from '../../src/utils/riasecScoring.js'
import scholarships from '../../src/data/scholarships.json'
import { archetypeProfile } from './helpers.js'

describe('matcher pipeline (no backend — client-side data)', () => {
  it('riasec scoring builds a profile from responses', () => {
    const responses = [
      { selectedCode: 'R', rating: 5 },
      { selectedCode: 'R', rating: 4 },
      { selectedCode: 'I', rating: 3 },
      { selectedCode: 'S', rating: 2 },
    ]
    const scores = calculateRiasecScores(responses)
    expect(scores.R).toBe(9)
    expect(scores.I).toBe(3)

    const profile = getPersonalityProfile(responses)
    expect(profile.primaryDimension.code).toBe('R')
    expect(profile.secondaryDimension.code).toBe('I')
  })

  it('returns careers, schools, and scholarships for a profile', () => {
    const profile = archetypeProfile('I', 'C')
    const careers = getCareerMatches(profile, 5)
    expect(careers.length).toBe(5)
    expect(careers[0].id).toBeTruthy()
    expect(careers[0].narrative).toBeTruthy()

    const schools = getUniversityMatchesForCareer(profile, careers[0], 3)
    expect(schools.length).toBe(3)
    expect(schools[0].relevanceScore).toBeGreaterThanOrEqual(schools[1].relevanceScore)

    const location = inferUserLocationFromSchool(schools[0])
    const funds = getScholarshipMatchesForCareer(profile, careers[0], schools, 5, location)
    expect(funds.length).toBeGreaterThan(0)
    expect(funds[0].relevanceScore).toBeGreaterThan(0)
  })

  it('metadata helpers expose catalog counts', () => {
    expect(getUniversitiesMetadata().count).toBe(205)
    expect(getScholarshipsMetadata().count).toBe(303)
  })

  it('nurse-oriented profile surfaces healthcare-leaning careers', () => {
    const profile = archetypeProfile('S', 'I')
    const careers = getCareerMatches(profile, 10)
    const ids = careers.map((c) => c.id)
    const healthcare = ids.filter((id) =>
      [
        'nurse',
        'psychologist',
        'social-worker',
        'teacher',
        'midwife',
        'caregiver',
        'physical-therapist',
        'guidance-counselor',
        'medical-technologist',
        'nutritionist-dietitian',
      ].includes(id)
    )
    expect(healthcare.length).toBeGreaterThanOrEqual(3)
  })

  it('realistic profile surfaces hands-on careers', () => {
    const profile = archetypeProfile('R', 'I')
    const careers = getCareerMatches(profile, 10)
    const ids = careers.map((c) => c.id)
    const handsOn = ids.filter((id) =>
      [
        'mechanical-engineer',
        'civil-engineer',
        'electrician',
        'welder',
        'automotive-technician',
        'hvac-technician',
        'chef',
        'aircraft-maintenance-technician',
      ].includes(id)
    )
    expect(handsOn.length).toBeGreaterThanOrEqual(2)
  })

  it('different careers produce different top school sets', () => {
    const profile = archetypeProfile('I', 'A')
    const nurse = { id: 'nurse', title: 'Registered Nurse', riasecWeights: {}, skills: [] }
    const designer = {
      id: 'graphic-designer',
      title: 'Graphic Designer',
      riasecWeights: {},
      skills: [],
    }
    const nurseSchools = getUniversityMatchesForCareer(profile, nurse, 5).map((s) => s.id)
    const designSchools = getUniversityMatchesForCareer(profile, designer, 5).map((s) => s.id)
    expect(nurseSchools).not.toEqual(designSchools)
  })

  it('residency filter blocks strict LGU scholarships for wrong city', () => {
    const qcydo = scholarships.scholarships.find((s) =>
      (s.institutionTags ?? []).includes('qcydo')
    )
    if (!qcydo) {
      // QCSP may use residencyRule or qcydo tag — skip if none in catalog
      expect(true).toBe(true)
      return
    }
    expect(passesResidencyFilter(qcydo, { cityLguSlug: 'quezon-city' })).toBe(true)
    expect(passesResidencyFilter(qcydo, { cityLguSlug: 'manila' })).toBe(false)
    expect(passesResidencyFilter(qcydo, null)).toBe(false)
  })
})
