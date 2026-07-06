import { describe, it, expect } from 'vitest'
import { getUniversityMatchesForCareer } from '../../src/utils/universityMatcher.js'
import { getScholarshipMatchesForCareer } from '../../src/utils/scholarshipMatcher.js'
import { archetypeProfile } from './helpers.js'

describe('military officer career and PMA', () => {
  it('PMA ranks #1 for military-officer profile', () => {
    const profile = archetypeProfile('E', 'R')
    const career = { id: 'military-officer', title: 'Military Officer (AFP)' }
    const schools = getUniversityMatchesForCareer(profile, career, 10)
    expect(schools.length).toBeGreaterThan(0)
    expect(schools[0].id).toBe('philippine-military-academy')
    expect(schools[0].keywordHits).toBeGreaterThan(0)
  })

  it('PMA cadetship scholarship surfaces for military-officer', () => {
    const profile = archetypeProfile('E', 'S')
    const career = { id: 'military-officer', title: 'Military Officer (AFP)' }
    const pmaSchool = { id: 'philippine-military-academy', type: 'public', strengthTags: ['service-academy'] }
    const funds = getScholarshipMatchesForCareer(profile, career, [pmaSchool], 12, null)
    const ids = funds.map((f) => f.id)
    expect(ids).toContain('sch-gov-pma-cadetship')
  })

  it('military-officer is separate from criminology-graduate schools', () => {
    const profile = archetypeProfile('S', 'E')
    const military = { id: 'military-officer', title: 'Military Officer (AFP)' }
    const crim = { id: 'criminology-graduate', title: 'Criminology Graduate' }
    const militarySchools = getUniversityMatchesForCareer(profile, military, 15).map((s) => s.id)
    const crimSchools = getUniversityMatchesForCareer(profile, crim, 15).map((s) => s.id)
    expect(militarySchools).toContain('philippine-military-academy')
    expect(crimSchools).not.toContain('philippine-military-academy')
    expect(crimSchools).toContain('bestlink')
  })
})
