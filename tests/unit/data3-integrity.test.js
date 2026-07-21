import { describe, expect, it } from 'vitest'
import universities from '../../src/data/universities.json'
import scholarships from '../../src/data/scholarships.json'
import integration from '../../docs/plans/kursoko-data3/verified-integration.json'
import popularIntegration from '../../docs/plans/kursoko-data3/verified-popular-course-integration.json'
import { getSchoolInstitutionTags } from '../../src/utils/scholarshipMatcher.js'

const byId = new Map(universities.universities.map((row) => [row.id, row]))

describe('data3 verified university integration', () => {
  it('reconciles all 46 researcher actions', () => {
    const metadata = integration.metadata
    expect(
      metadata.appliedActions +
        metadata.alreadySatisfiedActions +
        metadata.deferredActions,
    ).toBe(metadata.requestedActions)
    expect(universities.metadata.count).toBe(universities.universities.length)
    expect(universities.metadata.count).toBeGreaterThanOrEqual(popularIntegration.metadata.targetCount)
  })

  it('removes closed, non-HEI, and duplicate runtime records', () => {
    for (const item of integration.remove) {
      expect(byId.has(item.id), item.id).toBe(false)
    }
    expect(
      universities.universities.filter((row) => row.name === 'Pampanga State University'),
    ).toHaveLength(1)
  })

  it('matches every verified update and addition', () => {
    for (const item of integration.update) {
      expect(byId.get(item.id)).toMatchObject(item.changes)
    }
    for (const item of integration.add) {
      expect(byId.get(item.id)).toEqual(item)
      expect(item.verificationSources.every((source) => source.startsWith('https://'))).toBe(
        true,
      )
    }
  })

  it('keeps weak claims deferred', () => {
    expect(byId.has('sti-college-paranaque')).toBe(true)
    expect(byId.has('paranaque-city-college-science-technology')).toBe(false)
  })

  it('covers all 40 institutions from the popular-course package', () => {
    for (const id of popularIntegration.coveredRuntimeIds) {
      expect(byId.has(id), id).toBe(true)
    }
    for (const item of popularIntegration.update) {
      expect(byId.get(item.id)).toMatchObject(item.changes)
    }
    for (const item of popularIntegration.add) {
      expect(byId.get(item.id)).toEqual(item)
    }
    expect(
      popularIntegration.coveredRuntimeIds.length + popularIntegration.add.length,
    ).toBe(popularIntegration.metadata.actualInstitutionCount)
  })

  it('updates cross-catalog references after the Pampanga merge', () => {
    const scholarship = scholarships.scholarships.find(
      (row) => row.id === 'pampanga-province-scholarship',
    )
    expect(scholarship.institutionTags).toContain('don-honorio-ventura')
    expect(scholarship.institutionTags).not.toContain('pampanga-state-university')
  })

  it('keeps RIASEC tags focused and removes the old Investigative default bias', () => {
    const investigativeCount = universities.universities.filter((row) =>
      row.riasecTags.includes('I'),
    ).length
    expect(investigativeCount / universities.universities.length).toBeLessThan(0.9)
    expect(Math.max(...universities.universities.map((row) => row.riasecTags.length))).toBe(
      3,
    )
  })

  it('derives scholarship institution tags without identity-specific boosts', () => {
    expect(
      getSchoolInstitutionTags({
        id: 'dlsu-manila',
        type: 'private',
        strengthTags: [],
      }),
    ).toEqual(['dlsu-manila', 'dlsu', 'private'])
  })
})
