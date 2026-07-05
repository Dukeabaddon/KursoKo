import universitiesData from '../data/universities.json'
import schoolInsightsData from '../data/schoolInsights.json'

const LEGACY_SCHOOL_TAGS = {
  'pup-manila': ['pup', 'pup-system', 'public', 'business', 'technology'],
  'pup-quezon-city': ['pup', 'pup-system', 'public', 'engineering', 'technology'],
  'pup-paranaque': ['pup', 'pup-system', 'public', 'business'],
  'pup-san-juan': ['pup', 'pup-system', 'public', 'technology'],
  'pup-tagui': ['pup', 'pup-system', 'public', 'entrepreneurship'],
  'ateneo-manila': ['ateneo', 'leadership', 'research', 'service'],
  'feu-manila': ['feu', 'healthcare', 'business', 'arts'],
  'dlsu-manila': ['dlsu', 'technology', 'business', 'research'],
  'up-diliman': ['up', 'up-system', 'public', 'research', 'engineering', 'technology'],
  'up-manila': ['up', 'up-system', 'public', 'medicine', 'health', 'research'],
  uplb: ['up', 'up-system', 'public', 'agriculture', 'research'],
  plm: ['plm', 'public', 'law', 'medicine', 'engineering'],
  ust: ['ust', 'health', 'medicine', 'research'],
}

/** National / flagship SUC bonus — not a ranking claim, surfaces well-known options. */
const PRESTIGE_TIER_BONUS = new Map([
  ['up-diliman', 3],
  ['up-manila', 3],
  ['uplb', 3],
  ['pup-manila', 2],
  ['plm', 2],
  ['ateneo-manila', 2],
  ['dlsu-manila', 2],
  ['ust', 2],
  ['feu-manila', 1],
])

function getLegacySchoolTags(university) {
  return LEGACY_SCHOOL_TAGS[university.id] ?? []
}

function getPrestigeBonus(university) {
  return PRESTIGE_TIER_BONUS.get(university.id) ?? 0
}

const CAREER_KEYWORDS = {
  'software-engineer': ['computer science', 'information technology', 'technology', 'programming'],
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
  lawyer: ['political science', 'legal', 'social science', 'law'],
  'hr-specialist': ['psychology', 'business', 'management'],
  'content-creator': ['communications', 'arts', 'multimedia', 'design'],
  pharmacist: ['pharmacy', 'health', 'science'],
  welder: ['welding', 'metal fabrication', 'industrial technology', 'tesda', 'engineering technology'],
  'automotive-technician': ['automotive', 'automotive servicing', 'industrial technology', 'tesda', 'mechanical'],
  'hvac-technician': ['hvac', 'refrigeration', 'air conditioning', 'mechanical technology', 'tesda', 'rac servicing'],
  'seafarer-deck-officer': ['marine transportation', 'maritime', 'nautical', 'seafaring', 'deck officer'],
  'agricultural-technician': ['agriculture', 'agribusiness', 'agricultural technology', 'crop production', 'farming', 'food technology'],
  'aircraft-maintenance-technician': ['aircraft maintenance', 'aviation', 'aeronautical engineering', 'airframe', 'avionics'],
  'medical-technologist': ['medical technology', 'medical laboratory science', 'laboratory', 'diagnostics', 'health sciences'],
  'cybersecurity-analyst': ['information technology', 'cybersecurity', 'computer science', 'network administration', 'information systems'],
  'data-scientist': ['data science', 'statistics', 'computer science', 'mathematics', 'analytics', 'information technology'],
  'marine-engineer': ['marine engineering', 'naval architecture', 'maritime', 'mechanical engineering', 'marine transportation'],
  'food-technologist': ['food technology', 'food science', 'nutrition', 'chemistry', 'agriculture', 'quality control'],
  'environmental-scientist': ['environmental science', 'biology', 'chemistry', 'environmental engineering', 'sustainability', 'natural sciences'],
  'ui-ux-designer': ['multimedia arts', 'information technology', 'graphic design', 'human-computer interaction', 'digital arts'],
  'game-developer': ['game development', 'entertainment and multimedia computing', 'computer science', 'information technology', 'animation'],
  'multimedia-artist': ['multimedia arts', 'film', 'animation', 'digital arts', 'communication', 'visual arts'],
  journalist: ['journalism', 'broadcast communication', 'communication', 'mass communication', 'media studies'],
  'interior-designer': ['interior design', 'architecture', 'fine arts', 'space planning', 'design'],
  photographer: ['photography', 'film', 'multimedia arts', 'visual arts', 'broadcasting', 'media'],
  caregiver: ['caregiving', 'nursing', 'health sciences', 'healthcare', 'gerontology', 'tesda'],
  midwife: ['midwifery', 'nursing', 'health sciences', 'maternal health', 'community health'],
  'guidance-counselor': ['psychology', 'guidance and counseling', 'education', 'teacher education', 'social sciences'],
  'physical-therapist': ['physical therapy', 'rehabilitation sciences', 'health sciences', 'sports medicine', 'occupational therapy'],
  'speech-language-pathologist': ['speech language pathology', 'rehabilitation sciences', 'special education', 'psychology', 'health sciences'],
  'nutritionist-dietitian': ['nutrition and dietetics', 'food technology', 'public health', 'health sciences', 'home economics'],
  'criminology-graduate': ['criminology', 'public safety', 'law enforcement', 'forensic science', 'security management'],
  'sales-representative': ['business administration', 'marketing', 'entrepreneurship', 'sales', 'communication'],
  'business-development-manager': ['business administration', 'marketing', 'economics', 'management', 'entrepreneurship', 'business analytics'],
  'real-estate-broker': ['real estate', 'business administration', 'marketing', 'property management', 'finance'],
  'hotel-manager': ['hospitality management', 'hotel and restaurant management', 'tourism', 'hotel management', 'culinary'],
  'restaurant-manager': ['hotel and restaurant management', 'hospitality management', 'culinary', 'food service', 'tourism'],
  'flight-attendant': ['tourism', 'hospitality management', 'communication', 'cabin crew', 'aviation', 'customer service'],
  'supply-chain-manager': ['industrial engineering', 'logistics', 'supply chain', 'business administration', 'operations management'],
  bookkeeper: ['accountancy', 'accounting technology', 'bookkeeping', 'business administration', 'finance'],
  'logistics-coordinator': ['logistics', 'industrial engineering', 'business administration', 'supply chain', 'warehouse', 'operations'],
  'quality-assurance-analyst': ['information technology', 'computer science', 'industrial engineering', 'quality assurance', 'software testing'],
  'customs-broker': ['customs administration', 'international trade', 'business administration', 'logistics', 'supply chain'],
  'administrative-assistant': ['office administration', 'business administration', 'computer systems', 'secretarial', 'administrative', 'information technology'],
}

const insightIndex = new Map(
  schoolInsightsData.insights.map((row) => [`${row.institutionId}:${row.careerId}`, row])
)

function matchLabel(score) {
  if (score >= 11) return { label: 'Excellent match', tone: 'excellent' }
  if (score >= 7) return { label: 'Very good match', tone: 'good' }
  return { label: 'Good match', tone: 'fair' }
}

function haystackIncludesKeyword(haystack, keyword) {
  const normalized = keyword.toLowerCase().trim()
  if (!normalized) return false
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (normalized.length <= 3) {
    return new RegExp(`(?:^|[\\s,./\\-])${escaped}(?:$|[\\s,./\\-])`).test(haystack)
  }
  return haystack.includes(normalized)
}

function getUniversityTagBag(university) {
  return [
    ...(university.riasecTags ?? []),
    ...(university.strengthTags ?? []),
    ...getLegacySchoolTags(university),
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
  score += getPrestigeBonus(university)
  keywords.forEach((keyword) => {
    if (haystackIncludesKeyword(haystack, keyword)) score += 2
  })
  if (career?.id === 'software-engineer' && university.id === 'dlsu-manila') score += 2
  if (career?.id === 'software-engineer' && university.id === 'ateneo-manila') score += 1
  if (career?.id === 'software-engineer' && university.id === 'up-diliman') score += 2
  if (career?.id === 'graphic-designer' && university.id === 'feu-manila') score += 2
  if (career?.id === 'entrepreneur' && university.id === 'ateneo-manila') score += 2
  if (career?.id === 'accountant' && university.id === 'pup-manila') score += 2
  if (career?.id === 'nurse' && university.id === 'feu-manila') score += 3
  if (career?.id === 'data-analyst' && university.id === 'pup-manila') score += 2
  if (career?.id === 'lawyer' && (university.id === 'ateneo-manila' || university.id === 'plm')) score += 2

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

function compareUniversities(a, b) {
  if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore
  const prestigeDiff = getPrestigeBonus(b) - getPrestigeBonus(a)
  if (prestigeDiff !== 0) return prestigeDiff
  return (a.name ?? '').localeCompare(b.name ?? '')
}

export function getUniversityMatchesForCareer(profile, career, limit = 3) {
  const ranked = universitiesData.universities
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
    .sort(compareUniversities)

  if (limit == null) return ranked
  return ranked.slice(0, limit)
}

export function getUniversitiesMetadata() {
  return universitiesData.metadata
}
