export const RIASEC_CODES = ['R', 'I', 'A', 'S', 'E', 'C']

/** Top two Holland codes by weight on a career vector. */
export function top2Codes(weights) {
  return RIASEC_CODES.map((code) => ({ code, w: weights[code] ?? 0 }))
    .sort((a, b) => b.w - a.w)
    .slice(0, 2)
    .map((row) => row.code)
}

/**
 * Bonus when user primary/secondary align with career primary/secondary (0–1).
 * Prevents flat career vectors (e.g. maritime) from beating true primary fits.
 */
export function hollandAlignmentBonus(userTop2, careerWeights) {
  if (!userTop2?.[0]) return 0
  const careerTop2 = top2Codes(careerWeights)
  let bonus = 0
  if (userTop2[0] === careerTop2[0]) bonus += 0.6
  else if (userTop2[0] === careerTop2[1]) bonus += 0.3
  if (userTop2[1] === careerTop2[0]) bonus += 0.25
  else if (userTop2[1] === careerTop2[1]) bonus += 0.15
  return Math.min(1, bonus)
}

/** Blend cosine shape fit with Holland code alignment. */
export function blendedCareerScore(profileScores, careerWeights, userTop2) {
  const cosine = cosineSimilarity(profileScores, careerWeights)
  const alignment = hollandAlignmentBonus(userTop2, careerWeights)
  return 0.65 * cosine + 0.35 * alignment
}

/** Cosine similarity between user scores and career RIASEC weights (0–1). */
export function cosineSimilarity(scores, weights) {
  let dot = 0
  let magA = 0
  let magB = 0

  for (const code of RIASEC_CODES) {
    const a = scores[code] ?? 0
    const b = weights[code] ?? 0
    dot += a * b
    magA += a * a
    magB += b * b
  }

  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

/** Map cosine (0–1) to a 0–100 alignment meter. Not a hiring or admission probability. */
export function toFitPercent(cosine) {
  const clamped = Math.min(1, Math.max(0, cosine))
  return Math.min(100, Math.max(0, Math.round(clamped * 100)))
}

/** Student-friendly tier from rank within the user's result list (0 = best). */
export function getFitTierLabel(rankIndex) {
  if (rankIndex === 0) return 'Top match'
  if (rankIndex <= 2) return 'Strong match'
  return 'Good match'
}
