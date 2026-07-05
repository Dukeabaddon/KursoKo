export const RIASEC_CODES = ['R', 'I', 'A', 'S', 'E', 'C']

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
