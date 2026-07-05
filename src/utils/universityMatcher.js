import universitiesData from '../data/universities.json'
import schoolInsightsData from '../data/schoolInsights.json'

const LEGACY_SCHOOL_TAGS = {
  'pup-manila': ['pup', 'pup-system', 'public', 'business', 'technology'],
  'ateneo-manila': ['ateneo', 'leadership', 'research', 'service'],
  'feu-manila': ['feu', 'healthcare', 'business', 'arts'],
  'dlsu-manila': ['dlsu', 'technology', 'business', 'research'],
}

function getLegacySchoolTags(university) {
  return LEGACY_SCHOOL_TAGS[university.id] ?? []
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

function getUniversityTagBag(university) {
  return [
    ...(university.riasecTags ?? []),
    ...(university.strengthTags ?? []),
    ...(getLegacySchoolTags(university)),
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
    .sort((a, b) => b.relevanceScore - a.relevanceScore)

  if (limit == null) return ranked
  return ranked.slice(0, limit)
}

export function getUniversityMatches(profile, topCareers = [], limit = 3) {
  const topCareer = topCareers[0]
  return getUniversityMatchesForCareer(profile, topCareer, limit)
}

export function getUniversitiesMetadata() {
  return universitiesData.metadata
}
