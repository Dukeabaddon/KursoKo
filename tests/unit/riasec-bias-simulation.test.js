import { describe, expect, it } from 'vitest'
import questionsData from '../../src/data/questions.json'
import { getCareerMatches } from '../../src/utils/careerMatcher.js'
import { getPersonalityProfile } from '../../src/utils/riasecScoring.js'
import { mulberry32 } from './helpers.js'

const SAMPLE_SIZE = 20_000

describe('RIASEC ranking bias simulation', () => {
  it('avoids global and combination-level top-career monopolies', () => {
    const rng = mulberry32(20260717)
    const globalCounts = new Map()
    const combinationCounts = new Map()

    for (let sample = 0; sample < SAMPLE_SIZE; sample += 1) {
      const responses = questionsData.questions.map((question) => ({
        selectedCode: rng() < 0.5 ? question.optionA.code : question.optionB.code,
        rating: 1 + Math.floor(rng() * 3),
      }))
      const profile = getPersonalityProfile(responses)
      const topId = getCareerMatches(profile, 1)[0].id

      globalCounts.set(topId, (globalCounts.get(topId) ?? 0) + 1)
      const byCareer = combinationCounts.get(profile.combination) ?? new Map()
      byCareer.set(topId, (byCareer.get(topId) ?? 0) + 1)
      combinationCounts.set(profile.combination, byCareer)
    }

    const globalLeader = [...globalCounts.entries()].sort((a, b) => b[1] - a[1])[0]
    const combinationLeaders = [...combinationCounts.entries()].map(([combination, counts]) => {
      const total = [...counts.values()].reduce((sum, count) => sum + count, 0)
      const [careerId, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
      return { combination, careerId, count, total, share: count / total }
    })
    const dominantCombination = combinationLeaders.sort((a, b) => b.share - a.share)[0]

    expect(globalCounts.size).toBeGreaterThanOrEqual(40)
    expect(
      globalLeader[1] / SAMPLE_SIZE,
      `global leader ${globalLeader[0]}`,
    ).toBeLessThan(0.12)
    expect(
      dominantCombination.share,
      `${dominantCombination.combination} dominated by ${dominantCombination.careerId} ` +
        `(${dominantCombination.count}/${dominantCombination.total})`,
    ).toBeLessThan(0.92)
  })
})
