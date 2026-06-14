import careersData from '../data/careers.json'

const RIASEC_CODES = ['R', 'I', 'A', 'S', 'E', 'C']

function weightedScore(scores, weights) {
  let total = 0
  let weightSum = 0

  RIASEC_CODES.forEach((code) => {
    const w = weights[code] ?? 0
    total += (scores[code] ?? 0) * w
    weightSum += w
  })

  if (weightSum === 0) return 0
  return total / weightSum
}

function toPercent(rawScore, maxScore) {
  if (maxScore <= 0) return 0
  const ratio = rawScore / maxScore
  return Math.min(99, Math.max(55, Math.round(ratio * 100)))
}

/**
 * Rank careers by RIASEC-weighted fit. Preserves scoring engine — presentation only.
 */
export function getCareerMatches(profile, limit = 4) {
  const scores = profile.scores ?? {}
  const maxScore = Math.max(...Object.values(scores), 1)
  const primaryCode = profile.primaryDimension?.code
  const secondaryCode = profile.secondaryDimension?.code

  const ranked = careersData.careers
    .map((career) => {
      const raw = weightedScore(scores, career.riasecWeights)
      const matchPercent = toPercent(raw, maxScore)
      const reasons = []

      if (primaryCode && (career.riasecWeights[primaryCode] ?? 0) >= 0.7) {
        reasons.push(`Strong fit with your ${profile.primaryDimension.info.name} strength`)
      }
      if (secondaryCode && (career.riasecWeights[secondaryCode] ?? 0) >= 0.6) {
        reasons.push(`Aligns with your ${profile.secondaryDimension.info.name} side`)
      }
      if (reasons.length === 0) {
        reasons.push('Matches your overall interest pattern')
      }

      return {
        ...career,
        matchPercent,
        whyMatched: reasons,
        strengthsUsed: career.skills.slice(0, 2),
      }
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, limit)

  return ranked
}
