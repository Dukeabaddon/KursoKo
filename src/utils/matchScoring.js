export const RIASEC_CODES = ['R', 'I', 'A', 'S', 'E', 'C']

/**
 * Pearson profile correlation between student and occupation RIASEC shapes (-1–1).
 * This follows O*NET's profile-correspondence method and avoids discontinuous top-code bonuses.
 */
export function profileCorrelation(scores, weights) {
  const scoreMean = RIASEC_CODES.reduce((sum, code) => sum + (scores[code] ?? 0), 0) / RIASEC_CODES.length
  const weightMean = RIASEC_CODES.reduce((sum, code) => sum + (weights[code] ?? 0), 0) / RIASEC_CODES.length
  let covariance = 0
  let scoreVariance = 0
  let weightVariance = 0

  for (const code of RIASEC_CODES) {
    const scoreDelta = (scores[code] ?? 0) - scoreMean
    const weightDelta = (weights[code] ?? 0) - weightMean
    covariance += scoreDelta * weightDelta
    scoreVariance += scoreDelta * scoreDelta
    weightVariance += weightDelta * weightDelta
  }

  if (scoreVariance === 0 || weightVariance === 0) return 0
  const correlation = covariance / Math.sqrt(scoreVariance * weightVariance)
  return Math.min(1, Math.max(-1, correlation))
}

/** High-interest dimensions that positively drive the profile correlation. */
export function getProfileMatchDrivers(scores, weights, limit = 3) {
  const scoreMean = RIASEC_CODES.reduce((sum, code) => sum + (scores[code] ?? 0), 0) / RIASEC_CODES.length
  const weightMean = RIASEC_CODES.reduce((sum, code) => sum + (weights[code] ?? 0), 0) / RIASEC_CODES.length

  return RIASEC_CODES.map((code) => ({
    code,
    contribution: ((scores[code] ?? 0) - scoreMean) * ((weights[code] ?? 0) - weightMean),
    studentHigh: (scores[code] ?? 0) >= scoreMean,
    careerHigh: (weights[code] ?? 0) >= weightMean,
  }))
    .filter((row) => row.studentHigh && row.careerHigh && row.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, Math.max(0, limit))
    .map((row) => row.code)
}

/** Rank a career's RIASEC peaks highest-first (stable letter order on ties). */
export function getCareerPeakCodes(weights, count = 2) {
  return RIASEC_CODES.map((code, index) => ({
    code,
    weight: Number(weights?.[code] ?? 0),
    index,
  }))
    .sort((left, right) => right.weight - left.weight || left.index - right.index)
    .slice(0, Math.max(0, count))
    .map((row) => row.code)
}

/**
 * Careero-style gate: the career's dominant Holland code must match the student's primary,
 * and that primary must positively drive the correlation (blocks S-careers with inflated R).
 */
export function careerAlignsWithPrimary(scores, weights, primaryCode) {
  if (!primaryCode) return true
  const peaks = getCareerPeakCodes(weights, 1)
  if (peaks[0] !== primaryCode) return false
  return getProfileMatchDrivers(scores, weights).includes(primaryCode)
}

/** Map positive profile correlation to a 0–100 alignment meter. */
export function toFitPercent(correlation) {
  const clamped = Math.min(1, Math.max(0, correlation))
  return Math.min(100, Math.max(0, Math.round(clamped * 100)))
}

/** Descriptive bands adapted from O*NET Mini-IP correlation thresholds. */
export function getFitTierLabel(matchPercent) {
  if (matchPercent >= 73) return 'Top match'
  if (matchPercent >= 61) return 'Strong match'
  if (matchPercent >= 43) return 'Good match'
  return 'Explore match'
}
