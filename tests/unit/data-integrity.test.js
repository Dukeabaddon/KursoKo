import { describe, it, expect } from 'vitest'
import careers from '../../src/data/careers.json'
import universities from '../../src/data/universities.json'
import scholarships from '../../src/data/scholarships.json'
import schoolInsights from '../../src/data/schoolInsights.json'
import questions from '../../src/data/questions.json'
import courses from '../../src/data/courses.json'

const RIASEC = new Set(['R', 'I', 'A', 'S', 'E', 'C'])

describe('data integrity (static “API” / JSON catalogs)', () => {
  it('loads expected catalog sizes after data2 + careers merge', () => {
    expect(careers.careers.length).toBe(58)
    expect(universities.universities.length).toBe(226)
    expect(scholarships.scholarships.length).toBe(303)
    expect(careers.metadata.count).toBe(58)
    expect(universities.metadata.count).toBe(226)
    expect(scholarships.metadata.count).toBe(303)
  })

  it('careers have unique ids and valid RIASEC weights', () => {
    const ids = careers.careers.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const career of careers.careers) {
      expect(career.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(career.title).toBeTruthy()
      expect(Array.isArray(career.skills)).toBe(true)
      expect(career.skills.length).toBeGreaterThanOrEqual(1)
      expect(career.learningPath).toBeTruthy()

      for (const code of RIASEC) {
        const w = career.riasecWeights[code]
        expect(typeof w).toBe('number')
        expect(w).toBeGreaterThanOrEqual(0)
        expect(w).toBeLessThanOrEqual(1)
      }
    }
  })

  it('universities have required runtime fields and valid types', () => {
    const ids = universities.universities.map((u) => u.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => id.trim() === id && id.length > 0)).toBe(true)

    const allowedTypes = new Set(['public', 'private', 'shs', 'tvet'])
    for (const uni of universities.universities) {
      expect(uni.name).toBeTruthy()
      expect(allowedTypes.has(uni.type)).toBe(true)
      expect(uni.city).toBeTruthy()
      expect(uni.lguId).toBeTruthy()
      expect(uni.region).toBeTruthy()
      expect(uni.website).toBeTruthy()
      for (const tag of uni.riasecTags ?? []) {
        expect(RIASEC.has(tag)).toBe(true)
      }
    }
  })

  it('scholarships have array fields and valid categories', () => {
    const ids = scholarships.scholarships.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)

    const allowedCats = new Set(['government', 'private', 'university', 'international'])
    for (const sch of scholarships.scholarships) {
      expect(allowedCats.has(sch.category)).toBe(true)
      expect(Array.isArray(sch.eligibility)).toBe(true)
      expect(Array.isArray(sch.benefits)).toBe(true)
      expect(Array.isArray(sch.location)).toBe(true)
      expect(Array.isArray(sch.level)).toBe(true)
      expect(Array.isArray(sch.riasecTags)).toBe(true)
      expect(Array.isArray(sch.careerTags)).toBe(true)
      expect(sch.applicationLink).toBeTruthy()
      expect(sch.status).toBe('active')
      for (const tag of sch.riasecTags) {
        expect(RIASEC.has(tag)).toBe(true)
      }
    }
  })

  it('scholarship careerTags: all tags are valid career.id values after normalization', () => {
    const careerIds = new Set(careers.careers.map((c) => c.id))
    let exact = 0
    let freeform = 0
    let empty = 0
    for (const sch of scholarships.scholarships) {
      const tags = sch.careerTags ?? []
      if (tags.length === 0) empty += 1
      for (const tag of tags) {
        if (careerIds.has(tag)) exact += 1
        else freeform += 1
      }
    }
    expect(exact).toBeGreaterThan(200)
    expect(freeform).toBe(0)
    expect(empty).toBe(0)
  })

  it('courses.json covers all 30 RIASEC pair combinations', () => {
    const codes = 'RIASEC'.split('')
    const combos = []
    for (const a of codes) {
      for (const b of codes) {
        if (a !== b) combos.push(a + b)
      }
    }
    for (const combo of combos) {
      const hit = courses.courseRecommendations[combo] ?? courses.courseRecommendations[combo.split('').reverse().join('')]
      expect(hit, `missing course recommendation for ${combo}`).toBeTruthy()
    }
    expect(Object.keys(courses.courseRecommendations).length).toBeGreaterThanOrEqual(30)
  })

  it('popularCourses require official programSource (production gate)', () => {
    const missingSource = universities.universities.filter(
      (u) => (u.popularCourses?.length ?? 0) > 0 && u.programSource !== 'official_website',
    )
    expect(missingSource.map((u) => u.id)).toEqual([])
  })

  it('official popularCourses have 4–12 verified program names', () => {
    for (const uni of universities.universities) {
      if (uni.programSource !== 'official_website') continue
      expect(uni.popularCourses?.length ?? 0).toBeGreaterThanOrEqual(4)
      expect(uni.popularCourses?.length ?? 0).toBeLessThanOrEqual(12)
    }
  })

  it('schoolInsights institutionIds exist in universities catalog', () => {
    const uniIds = new Set(universities.universities.map((u) => u.id))
    const missing = schoolInsights.insights
      .map((row) => row.institutionId)
      .filter((id) => id && !uniIds.has(id))
    expect(missing).toEqual([])
  })

  it('questionnaire and courses catalogs load', () => {
    expect(questions).toBeTruthy()
    expect(courses.courseRecommendations || courses.riasecInfo).toBeTruthy()
  })
})
