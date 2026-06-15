import universitiesData from '../data/universities.json'

function matchLabel(score) {
  if (score >= 8) return { label: 'Excellent match', tone: 'excellent' }
  if (score >= 5) return { label: 'Very good match', tone: 'good' }
  return { label: 'Good match', tone: 'fair' }
}

function scoreUniversity(university, profile) {
  let score = 0
  const primary = profile.primaryDimension?.code
  const secondary = profile.secondaryDimension?.code
  const tags = university.riasecTags ?? []

  if (primary && tags.includes(primary)) score += 4
  if (secondary && tags.includes(secondary)) score += 3
  if (university.type === 'public') score += 1

  return score
}

function buildInsight(university, profile, topCareer) {
  const primary = profile.primaryDimension?.info?.name ?? 'your strengths'
  const career = topCareer?.title ?? 'your recommended path'
  return `Strong fit for ${primary.toLowerCase()} profiles pursuing ${career.toLowerCase()} — ${university.name} aligns with your interest pattern.`
}

export function getUniversityMatches(profile, topCareers = [], limit = 4) {
  const topCareer = topCareers[0]

  return universitiesData.universities
    .map((uni) => {
      const relevanceScore = scoreUniversity(uni, profile)
      const match = matchLabel(relevanceScore)
      return {
        ...uni,
        relevanceScore,
        matchLabel: match.label,
        matchTone: match.tone,
        insight: buildInsight(uni, profile, topCareer),
      }
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
}

export function getUniversitiesMetadata() {
  return universitiesData.metadata
}
