import { describe, expect, it } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { getCourseRecommendationsForCombinations } from '../../src/utils/courseRecommendations.js'
import { getDimensionPattern } from '../../src/utils/riasecScoring.js'
import { getArchetypeForProfile } from '../../src/utils/archetypes.js'
import { careerAlignsWithPrimary, getCareerPeakCodes } from '../../src/utils/matchScoring.js'
import { profileFromScores } from './helpers.js'

const VISIONARY_SCORES = { R: 29.7, I: 6, A: 0, S: 29.7, E: 33, C: 3 }
const BUILDER_SCORES = { R: 14, I: 7, A: 2, S: 13, E: 12, C: 3 }

describe('RIASEC ranking regressions', () => {
  it('keeps the Visionary result free of uniformed-service paths', () => {
    const matches = getCareerMatches(profileFromScores(VISIONARY_SCORES), 10)
    const ids = matches.map((career) => career.id)

    expect(['flight-attendant', 'hotel-manager', 'restaurant-manager', 'entrepreneur']).toContain(matches[0].id)
    expect(ids).not.toContain('military-officer')
    expect(ids).not.toContain('pma-cadet')
  })

  it('keeps Builder recommendations driven by Realistic interests', () => {
    const profile = profileFromScores(BUILDER_SCORES)
    const matches = getCareerMatches(profile, 10)
    const ids = matches.map((career) => career.id)

    expect(matches.length).toBeGreaterThan(0)
    expect(matches.every((career) => career.matchDrivers.includes('R'))).toBe(true)
    expect(ids).toContain('seafarer-deck-officer')
    expect(ids).not.toContain('restaurant-manager')
    expect(ids).not.toContain('flight-attendant')
    expect(ids).not.toContain('midwife')
    expect(ids).not.toContain('nurse')
    expect(ids).not.toContain('caregiver')
    expect(ids).not.toContain('guidance-counselor')
    expect(getArchetypeForProfile(profile).summary).toContain('practical work that helps people')
  })

  it('surfaces military paths for strong Realistic builders', () => {
    const ids = getCareerMatches(profileFromScores(BUILDER_SCORES), 20).map((career) => career.id)
    expect(
      ids.some((id) =>
        ['military-officer', 'pma-cadet', 'enlisted-service-member', 'firefighter', 'pnpa-cadet'].includes(id),
      ),
    ).toBe(true)
  })

  it('requires career peak code to match student primary', () => {
    const midwife = { R: 0.35, I: 0.55, A: 0.35, S: 0.95, E: 0.4, C: 0.55 }
    expect(getCareerPeakCodes(midwife, 1)[0]).toBe('S')
    expect(careerAlignsWithPrimary(BUILDER_SCORES, midwife, 'R')).toBe(false)
  })

  it('reports the secondary tie and combines both course patterns', () => {
    const pattern = getDimensionPattern(VISIONARY_SCORES)
    const recommendations = getCourseRecommendationsForCombinations(
      pattern.combinationCandidates,
    )

    expect(pattern).toEqual({
      label: 'E + R/S tie',
      combinationCandidates: ['ER', 'ES'],
    })
    expect(recommendations.combinations).toEqual(['ER', 'ES'])
    expect(recommendations.courses.length).toBeGreaterThan(4)
  })
})
