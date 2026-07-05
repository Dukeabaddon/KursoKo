import { getDimensionInfo } from '../../src/utils/riasecScoring.js'

const RIASEC = ['R', 'I', 'A', 'S', 'E', 'C']

/**
 * Build a profile shaped like getPersonalityProfile() output from raw scores.
 */
export function profileFromScores(scores) {
  const dimensionInfo = getDimensionInfo()
  const ranked = RIASEC.map((code) => ({ code, score: scores[code] ?? 0 })).sort(
    (a, b) => b.score - a.score
  )
  const primary = ranked[0]
  const secondary = ranked[1]
  return {
    scores,
    topDimensions: ranked.slice(0, 2),
    combination: `${primary.code}${secondary.code}`,
    primaryDimension: {
      code: primary.code,
      score: primary.score,
      info: dimensionInfo[primary.code],
    },
    secondaryDimension: {
      code: secondary.code,
      score: secondary.score,
      info: dimensionInfo[secondary.code],
    },
    allDimensions: ranked.map((row) => ({
      ...row,
      info: dimensionInfo[row.code],
    })),
  }
}

/** Pure-primary archetype: one dimension dominates. */
export function archetypeProfile(primary, secondary = null) {
  const scores = { R: 10, I: 10, A: 10, S: 10, E: 10, C: 10 }
  scores[primary] = 40
  if (secondary) scores[secondary] = 28
  else {
    const others = RIASEC.filter((c) => c !== primary)
    scores[others[0]] = 22
  }
  return profileFromScores(scores)
}

/** Seeded PRNG (mulberry32) for reproducible Monte Carlo. */
export function mulberry32(seed) {
  let t = seed >>> 0
  return function next() {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Random RIASEC profile with scores in [5, 40]. */
export function randomProfile(rng) {
  const scores = {}
  for (const code of RIASEC) {
    scores[code] = 5 + Math.floor(rng() * 36)
  }
  return profileFromScores(scores)
}

export { RIASEC }
