export const RIASEC_BAR_COLORS = {
  R: '#F97316',
  I: '#2563EB',
  A: '#EC4899',
  S: '#22C55E',
  E: '#EAB308',
  C: '#9333EA',
}

export const RIASEC_MAX_POINTS = 25

export function getBarPercent(score, maxPoints = RIASEC_MAX_POINTS) {
  return Math.min(100, Math.round((score / maxPoints) * 100))
}
