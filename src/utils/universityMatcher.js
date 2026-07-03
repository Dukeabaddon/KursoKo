import universitiesData from '../data/universities.json'
import schoolInsightsData from '../data/schoolInsights.json'

const SCHOOL_TAGS = {
  'pup-manila': ['pup', 'pup-system', 'public', 'business', 'technology'],
  'ateneo-manila': ['ateneo', 'leadership', 'research', 'service'],
  'feu-manila': ['feu', 'healthcare', 'business', 'arts'],
  'dlsu-manila': ['dlsu', 'technology', 'business', 'research'],
}

const CAREER_KEYWORDS = {
  'software-engineer': ['computer science', 'it', 'technology', 'programming'],
  'mechanical-engineer': ['engineering', 'mechanical', 'technology'],
  architect: ['architecture', 'design'],
  teacher: ['education', 'teaching'],
  psychologist: ['psychology', 'social science'],
  nurse: ['nursing', 'health', 'healthcare'],
  'graphic-designer': ['design', 'arts', 'multimedia'],
  entrepreneur: ['business', 'management', 'entrepreneurship'],
  accountant: ['accountancy', 'business', 'finance'],
  'civil-engineer': ['engineering', 'civil'],
  'research-scientist': ['science', 'research', 'technology'],
  'social-worker': ['social work', 'community', 'service'],
  electrician: ['technology', 'engineering', 'technical'],
  'marketing-manager': ['marketing', 'business', 'communications'],
  'data-analyst': ['computer science', 'statistics', 'technology', 'business'],
  chef: ['hospitality', 'culinary', 'tourism'],
  lawyer: ['political science', 'legal', 'social science'],
  'hr-specialist': ['psychology', 'business', 'management'],
  'content-creator': ['communications', 'arts', 'multimedia', 'design'],
  pharmacist: ['pharmacy', 'health', 'science'],
}

const insightIndex = new Map(
  schoolInsightsData.insights.map((row) => [`${row.institutionId}:${row.careerId}`, row])
)

function matchLabel(score) {
  if (score >= 11) return { label: 'Excellent match', tone: 'excellent' }
  if (score >= 7) return { label: 'Very good match', tone: 'good' }
  return { label: 'Good match', tone: 'fair' }
}

function getUniversityTagBag(university) {
  return [
    ...(university.riasecTags ?? []),
    ...(university.strengthTags ?? []),
    ...(SCHOOL_TAGS[university.id] ?? []),
    ...(university.popularCourses ?? []),
    university.description ?? '',
    university.name ?? '',
  ]
    .join(' ')
    .toLowerCase()
}

function scoreUniversity(university, profile, career) {
  let score = 0
  const primary = profile.primaryDimension?.code
  const secondary = profile.secondaryDimension?.code
  const tags = university.riasecTags ?? []
  const haystack = getUniversityTagBag(university)
  const keywords = CAREER_KEYWORDS[career?.id] ?? []

  if (primary && tags.includes(primary)) score += 4
  if (secondary && tags.includes(secondary)) score += 3
  if (university.type === 'public') score += 1
  keywords.forEach((keyword) => {
    if (haystack.includes(keyword)) score += 2
  })
  if (career?.id === 'software-engineer' && university.id === 'dlsu-manila') score += 2
  if (career?.id === 'software-engineer' && university.id === 'ateneo-manila') score += 1
  if (career?.id === 'graphic-designer' && university.id === 'feu-manila') score += 2
  if (career?.id === 'entrepreneur' && university.id === 'ateneo-manila') score += 2
  if (career?.id === 'accountant' && university.id === 'pup-manila') score += 2
  if (career?.id === 'nurse' && university.id === 'feu-manila') score += 3
  if (career?.id === 'data-analyst' && university.id === 'pup-manila') score += 2

  return score
}

function resolveSchoolInsight(university, career) {
  const exact = insightIndex.get(`${university.id}:${career?.id}`)
  if (exact) {
    return {
      headline: exact.headline,
      body: exact.body,
      source: exact.verificationSource,
    }
  }
  const fallback = insightIndex.get(`${university.id}:_default`)
  if (fallback) {
    return {
      headline: fallback.headline,
      body: fallback.body,
      source: fallback.verificationSource,
    }
  }
  const careerTitle = career?.title ?? 'this path'
  return {
    headline: `${university.name} program fit`,
    body: `${university.name} offers programs that can support a ${careerTitle.toLowerCase()} path. Check official course listings and admission rules before you apply.`,
    source: university.website,
  }
}

export function getUniversityMatchesForCareer(profile, career, limit = 3) {
  return universitiesData.universities
    .map((uni) => {
      const relevanceScore = scoreUniversity(uni, profile, career)
      const match = matchLabel(relevanceScore)
      const insightData = resolveSchoolInsight(uni, career)
      return {
        ...uni,
        relevanceScore,
        matchLabel: match.label,
        matchTone: match.tone,
        insightHeadline: insightData.headline,
        insight: insightData.body,
        insightSource: insightData.source,
      }
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
}

export function getUniversityMatches(profile, topCareers = [], limit = 3) {
  const topCareer = topCareers[0]
  return getUniversityMatchesForCareer(profile, topCareer, limit)
}

export function getUniversitiesMetadata() {
  return universitiesData.metadata
}
