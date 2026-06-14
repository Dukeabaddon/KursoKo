import scholarshipsData from '../data/scholarships.json'

function scoreScholarship(scholarship, profile, topCareerIds) {
  let score = 0
  const primary = profile.primaryDimension?.code
  const secondary = profile.secondaryDimension?.code
  const tags = scholarship.riasecTags ?? []

  if (primary && tags.includes(primary)) score += 3
  if (secondary && tags.includes(secondary)) score += 2
  if (tags.length === 6) score += 1

  const careerTags = scholarship.careerTags ?? []
  topCareerIds.forEach((id) => {
    if (careerTags.includes(id)) score += 4
  })

  if (scholarship.category === 'government') score += 1

  return score
}

export function getScholarshipMatches(profile, topCareers = [], limit = 5) {
  const topCareerIds = topCareers.map((c) => c.id)

  return scholarshipsData.scholarships
    .map((item) => ({
      ...item,
      relevanceScore: scoreScholarship(item, profile, topCareerIds),
    }))
    .filter((item) => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
}

export function getScholarshipsMetadata() {
  return scholarshipsData.metadata
}
