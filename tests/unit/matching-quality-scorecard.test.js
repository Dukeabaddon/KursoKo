import { describe, it, expect } from 'vitest'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { getUniversityMatchesForCareer, MIN_SCHOOL_SCORE } from '../../src/utils/universityMatcher.js'
import { getScholarshipMatchesForCareer } from '../../src/utils/scholarshipMatcher.js'
import careersData from '../../src/data/careers.json'
import { archetypeProfile, randomProfile, mulberry32, RIASEC } from './helpers.js'

function careerPrimary(weights) {
  return Object.entries(weights)
    .sort((a, b) => b[1] - a[1])[0][0]
}

function careerPlausible(profile, career) {
  const userPrimary = profile.primaryDimension.code
  const cp = careerPrimary(career.riasecWeights)
  if (cp === userPrimary) return true
  return (career.riasecWeights[userPrimary] ?? 0) >= 0.65
}

function scholarshipPlausible(scholarship, career, profile) {
  if (scholarship.courseScope === 'all-undergraduate') return true
  const tags = scholarship.riasecTags ?? []
  const careerTags = scholarship.careerTags ?? []
  if (career?.id && careerTags.includes(career.id)) return true
  const primary = profile.primaryDimension.code
  if (tags.includes(primary) && tags.length < 6) return true
  if (tags.length >= 6) return false
  const secondary = profile.secondaryDimension?.code
  return tags.includes(primary) || (secondary && tags.includes(secondary))
}

function buildProfiles() {
  const profiles = []
  for (const primary of RIASEC) profiles.push(archetypeProfile(primary))
  for (const primary of RIASEC) {
    for (const secondary of RIASEC) {
      if (secondary !== primary) profiles.push(archetypeProfile(primary, secondary))
    }
  }
  const rng = mulberry32(20260706)
  for (let i = 0; i < 400; i += 1) profiles.push(randomProfile(rng))
  return profiles
}

describe('matching quality scorecard (436 profiles)', () => {
  const profiles = buildProfiles()

  it('career weights satisfy shape rules', () => {
    const violations = []
    for (const career of careersData.careers) {
      const sorted = Object.entries(career.riasecWeights).sort((a, b) => b[1] - a[1])
      const [pCode, pVal] = sorted[0]
      const [sCode, sVal] = sorted[1]
      if (pVal < 0.85) violations.push(`${career.id}: primary ${pCode}=${pVal}`)
      if (sVal > 0.75) violations.push(`${career.id}: secondary ${sCode}=${sVal}`)
      if (pVal - sVal < 0.15) violations.push(`${career.id}: gap ${pVal - sVal}`)
      for (let i = 2; i < sorted.length; i += 1) {
        if (sorted[i][1] > 0.55) violations.push(`${career.id}: tail ${sorted[i][0]}=${sorted[i][1]}`)
      }
    }
    expect(violations, violations.slice(0, 5).join('; ')).toEqual([])
  })

  it('top-1 career aligns with user primary in >=90% of profiles', () => {
    let fail = 0
    const samples = []
    for (const profile of profiles) {
      const top = getCareerMatches(profile, 1)[0]
      if (!careerPlausible(profile, top)) {
        fail += 1
        if (samples.length < 6) {
          samples.push(`${profile.combination}→${top.id}`)
        }
      }
    }
    const passRate = 1 - fail / profiles.length
    expect(passRate, `failures: ${samples.join(', ')}`).toBeGreaterThanOrEqual(0.9)
  })

  it('top-3 contains a primary-aligned career in >=95% of profiles', () => {
    let aligned = 0
    for (const profile of profiles) {
      const top3 = getCareerMatches(profile, 3)
      if (top3.some((career) => careerPlausible(profile, career))) aligned += 1
    }
    expect(aligned / profiles.length).toBeGreaterThanOrEqual(0.95)
  })

  it('schools return for every top career with minimum score', () => {
    let empty = 0
    let low = 0
    for (const profile of profiles) {
      const top = getCareerMatches(profile, 1)[0]
      const schools = getUniversityMatchesForCareer(profile, top, 3)
      if (!schools.length) empty += 1
      else if (schools[0].relevanceScore < MIN_SCHOOL_SCORE) low += 1
    }
    expect(empty).toBe(0)
    expect(low).toBe(0)
  })

  it('scholarships are career- or RIASEC-relevant in >=85% of profiles', () => {
    let weak = 0
    const samples = []
    for (const profile of profiles) {
      const top = getCareerMatches(profile, 1)[0]
      const schools = getUniversityMatchesForCareer(profile, top, 3)
      const funds = getScholarshipMatchesForCareer(profile, top, schools, 5, null)
      const bad = funds.filter((s) => !scholarshipPlausible(s, top, profile))
      if (bad.length > 0) {
        weak += 1
        if (samples.length < 5) {
          samples.push(`${top.id}: ${bad[0].name}`)
        }
      }
    }
    const passRate = 1 - weak / profiles.length
    expect(passRate, samples.join(' | ')).toBeGreaterThanOrEqual(0.85)
  })

  it('pure archetypes map to sensible #1 careers', () => {
    const cases = [
      { primary: 'E', secondary: 'C', expect: ['entrepreneur', 'marketing-manager', 'sales-representative', 'call-center-team-lead', 'business-development-manager'] },
      { primary: 'I', secondary: 'C', expect: ['research-scientist', 'data-scientist', 'cybersecurity-analyst', 'data-analyst', 'chemist', 'statistician'] },
      { primary: 'R', secondary: 'I', expect: ['welder', 'electrician', 'mechanical-engineer', 'automotive-technician'] },
      { primary: 'S', secondary: 'A', expect: ['teacher', 'nurse', 'social-worker', 'psychologist'] },
      { primary: 'A', secondary: 'I', expect: ['graphic-designer', 'ui-ux-designer', 'multimedia-artist', 'game-developer', 'interior-designer'] },
      { primary: 'C', secondary: 'E', expect: ['accountant', 'bookkeeper', 'customs-broker', 'quality-assurance-analyst', 'administrative-assistant', 'supply-chain-manager', 'logistics-coordinator'] },
    ]
    for (const { primary, secondary, expect: expected } of cases) {
      const top = getCareerMatches(archetypeProfile(primary, secondary), 1)[0].id
      expect(expected, `${primary}+${secondary} got ${top}`).toContain(top)
    }
  })
})
