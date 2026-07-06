import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { archetypeProfile } from './helpers.js'
import { getUniversityMatchesForCareer } from '../../src/utils/universityMatcher.js'

const careers = JSON.parse(
  readFileSync(new URL('../../src/data/careers.json', import.meta.url), 'utf8')
).careers

describe('catalog-wide school program audit', () => {
  it('no top-5 school lacks program keyword hits for any career', () => {
    const profile = archetypeProfile('I', 'C')
    const failures = []
    for (const career of careers) {
      const schools = getUniversityMatchesForCareer(profile, career, 5)
      for (const school of schools) {
        if ((school.keywordHits ?? 0) === 0) {
          failures.push(`${career.id}→${school.id}`)
        }
      }
    }
    expect(failures, failures.slice(0, 8).join(', ')).toEqual([])
  })
})
