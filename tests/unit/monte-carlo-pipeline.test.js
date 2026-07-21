import { describe, it, expect } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { getUniversityMatchesForCareer } from '../../src/utils/universityMatcher.js'
import {
  getScholarshipMatchesForCareer,
} from '../../src/utils/scholarshipMatcher.js'
import { archetypeProfile, mulberry32, randomProfile, RIASEC } from './helpers.js'

/**
 * Monte Carlo: many random + archetype profiles through the full client pipeline.
 * Asserts recommendations diversify by RIASEC — not a single frozen list for everyone.
 */
describe('Monte Carlo recommendation pipeline', () => {
  const RUNS = 200
  const ARCHETYPES = RIASEC.map((code) => archetypeProfile(code))

  function runPipeline(profile) {
    const careers = getCareerMatches(profile, 5)
    const topCareer = careers[0]
    const schools = getUniversityMatchesForCareer(profile, topCareer, 3)
    const funds = getScholarshipMatchesForCareer(profile, topCareer, schools, 5, null)
    return {
      careerIds: careers.map((c) => c.id),
      schoolIds: schools.map((s) => s.id),
      scholarshipIds: funds.map((s) => s.id),
      topCareerId: topCareer.id,
      primary: profile.primaryDimension.code,
    }
  }

  it('archetype primaries produce different top careers', () => {
    const topByPrimary = {}
    for (const profile of ARCHETYPES) {
      const result = runPipeline(profile)
      topByPrimary[result.primary] = result.topCareerId
    }

    const uniqueTops = new Set(Object.values(topByPrimary))
    // At least 4 of 6 pure archetypes should land on different #1 careers
    expect(uniqueTops.size).toBeGreaterThanOrEqual(4)
  })

  it('archetype primaries produce different school sets', () => {
    const schoolSets = ARCHETYPES.map((profile) => {
      const { schoolIds } = runPipeline(profile)
      return schoolIds.slice().sort().join('|')
    })
    const unique = new Set(schoolSets)
    expect(unique.size).toBeGreaterThanOrEqual(3)
  })

  it('Monte Carlo: career recommendations diversify across random profiles', () => {
    const rng = mulberry32(42)
    const topCareerCounts = new Map()
    const topSchoolCounts = new Map()
    const schoolPairKeys = new Set()
    const scholarshipPairKeys = new Set()
    const careerSetKeys = new Set()

    for (let i = 0; i < RUNS; i += 1) {
      const profile = randomProfile(rng)
      const result = runPipeline(profile)

      topCareerCounts.set(result.topCareerId, (topCareerCounts.get(result.topCareerId) ?? 0) + 1)
      const topSchoolId = result.schoolIds[0]
      topSchoolCounts.set(topSchoolId, (topSchoolCounts.get(topSchoolId) ?? 0) + 1)
      careerSetKeys.add(result.careerIds.slice().sort().join('|'))
      schoolPairKeys.add(result.schoolIds.slice().sort().join('|'))
      scholarshipPairKeys.add(result.scholarshipIds.slice().sort().join('|'))
    }

    // Many distinct top careers across random profiles
    expect(topCareerCounts.size).toBeGreaterThanOrEqual(8)

    // Top-5 career bundles are not identical for everyone
    expect(careerSetKeys.size).toBeGreaterThanOrEqual(20)

    // School top-3 sets vary
    expect(schoolPairKeys.size).toBeGreaterThanOrEqual(5)

    // Scholarships include a small broad-eligibility pool plus path-specific programs,
    // but must not be a single frozen list for all profiles.
    expect(scholarshipPairKeys.size).toBeGreaterThanOrEqual(2)

    // No single career monopolizes >60% of random runs
    const maxShare = Math.max(...topCareerCounts.values()) / RUNS
    expect(maxShare).toBeLessThan(0.6)

    // No school should dominate position one across representative profiles.
    const maxSchoolShare = Math.max(...topSchoolCounts.values()) / RUNS
    expect(maxSchoolShare).toBeLessThan(0.15)
  })

  it('Monte Carlo: same profile is deterministic', () => {
    const profile = archetypeProfile('E', 'C')
    const a = runPipeline(profile)
    const b = runPipeline(profile)
    expect(a).toEqual(b)
  })

  it('Monte Carlo: opposite archetypes (R vs S) diverge on careers and schools', () => {
    const r = runPipeline(archetypeProfile('R'))
    const s = runPipeline(archetypeProfile('S'))

    expect(r.topCareerId).not.toBe(s.topCareerId)

    const rCareers = new Set(r.careerIds)
    const sCareers = new Set(s.careerIds)
    const overlap = [...rCareers].filter((id) => sCareers.has(id))
    // Top-5 lists should not be identical
    expect(overlap.length).toBeLessThan(5)

    const rSchools = new Set(r.schoolIds)
    const sSchools = new Set(s.schoolIds)
    const schoolOverlap = [...rSchools].filter((id) => sSchools.has(id))
    expect(schoolOverlap.length).toBeLessThan(3)
  })

  it('reports diversity stats (diagnostic, always passes)', () => {
    const rng = mulberry32(7)
    const stats = {
      runs: 50,
      uniqueTopCareers: new Set(),
      uniqueSchoolSets: new Set(),
      uniqueScholarshipSets: new Set(),
      byPrimaryTop: Object.fromEntries(RIASEC.map((c) => [c, new Set()])),
    }

    for (let i = 0; i < stats.runs; i += 1) {
      const profile = randomProfile(rng)
      const result = runPipeline(profile)
      stats.uniqueTopCareers.add(result.topCareerId)
      stats.uniqueSchoolSets.add(result.schoolIds.join('|'))
      stats.uniqueScholarshipSets.add(result.scholarshipIds.join('|'))
      stats.byPrimaryTop[result.primary].add(result.topCareerId)
    }

    console.log(
      '[monte-carlo]',
      JSON.stringify({
        uniqueTopCareers: stats.uniqueTopCareers.size,
        uniqueSchoolSets: stats.uniqueSchoolSets.size,
        uniqueScholarshipSets: stats.uniqueScholarshipSets.size,
        byPrimaryTopCounts: Object.fromEntries(
          RIASEC.map((c) => [c, stats.byPrimaryTop[c].size])
        ),
      })
    )

    expect(stats.uniqueTopCareers.size).toBeGreaterThan(0)
  })
})
