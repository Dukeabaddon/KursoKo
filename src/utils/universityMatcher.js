import universitiesData from '../data/universities.json'
import schoolInsightsData from '../data/schoolInsights.json'

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
  dentist: ['dentistry', 'dental', 'dental medicine', 'doctor of dental', 'dmd', 'oral health', 'dental hygiene'],
  welder: ['welding', 'metal fabrication', 'industrial technology', 'tesda', 'engineering technology'],
  'automotive-technician': ['automotive', 'automotive servicing', 'industrial technology', 'tesda', 'mechanical'],
  'hvac-technician': ['hvac', 'refrigeration', 'air conditioning', 'mechanical technology', 'tesda', 'rac servicing'],
  'seafarer-deck-officer': ['marine transportation', 'maritime', 'nautical science', 'nautical studies', 'seafaring', 'deck officer'],
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
  'military-officer': ['criminology', 'public safety', 'management', 'engineering', 'military science', 'national defense'],
  'pma-cadet': ['philippine military academy', 'military science', 'engineering', 'management', 'public safety'],
  'pnpa-cadet': ['philippine national police academy', 'criminology', 'public safety', 'law enforcement'],
  'coast-guard-officer': ['maritime', 'marine transportation', 'naval', 'coast guard', 'public safety'],
  'enlisted-service-member': ['criminology', 'industrial technology', 'tesda', 'public safety', 'technical'],
  'firefighter': ['criminology', 'public safety', 'fire technology', 'emergency management'],
  'electrical-engineer': ['electrical engineering', 'engineering', 'power systems'],
  'electronics-engineer': ['electronics engineering', 'ece', 'telecommunications', 'engineering'],
  'network-administrator': ['information technology', 'computer science', 'network', 'cybersecurity'],
  'mobile-app-developer': ['computer science', 'information technology', 'mobile development', 'software'],
  'digital-marketer': ['marketing', 'communication', 'advertising', 'business'],
  'animator': ['multimedia arts', 'animation', 'digital arts', 'fine arts'],
  'radiologic-technologist': ['radiologic technology', 'medical imaging', 'health sciences'],
  'occupational-therapist': ['occupational therapy', 'rehabilitation sciences', 'health sciences'],
  'chemist': ['chemistry', 'biochemistry', 'science'],
  'statistician': ['statistics', 'mathematics', 'data science', 'applied math'],
  'civil-service-analyst': ['public administration', 'political science', 'management'],
  'product-manager': ['business administration', 'information technology', 'management'],
  'event-planner': ['hospitality management', 'tourism', 'business administration'],
  'fashion-designer': ['fashion design', 'fashion', 'fine arts', 'merchandising', 'apparel'],
  'musician-teacher': ['music', 'music education', 'performing arts'],
  'tour-guide': ['tourism', 'hospitality management', 'communication'],
  'call-center-team-lead': ['business administration', 'communication', 'management'],
  'pharmacist-assistant': ['pharmacy', 'health sciences', 'tesda'],
  'accountant-auditor': ['accountancy', 'management accounting', 'finance'],
  'teacher-shs-stem': ['education', 'secondary education', 'mathematics', 'science'],
  'veterinary-technologist': ['veterinary', 'animal science', 'agriculture'],
  'architect-interior-tech': ['architecture', 'interior design', 'drafting'],
  'lawyer-paralegal': ['legal management', 'political science', 'law'],
  'librarian': ['library', 'library and information', 'information science', 'lis'],
}

const insightIndex = new Map(
  schoolInsightsData.insights.map((row) => [`${row.institutionId}:${row.careerId}`, row])
)

/** Specialty schools that should only appear for selected careers. */
const SCHOOL_CAREER_ALLOWLIST = {
  'pma-baguio': new Set(['military-officer', 'pma-cadet', 'enlisted-service-member']),
  'pnpa-laguna': new Set(['pnpa-cadet', 'criminology-graduate', 'firefighter']),
  'pcg-officer-path': new Set(['coast-guard-officer', 'seafarer-deck-officer', 'marine-engineer']),
}

/** Minimum relevance score to appear in school recommendations. */
export const MIN_SCHOOL_SCORE = 8

function matchLabel(score) {
  if (score >= 14) return { label: 'Excellent fit', tone: 'excellent' }
  if (score >= 10) return { label: 'Very good fit', tone: 'good' }
  return { label: 'Good fit', tone: 'fair' }
}

function getInstitutionKey(university) {
  const id = university.id ?? ''
  if (id.startsWith('pup-')) return 'pup'
  if (id.startsWith('feu-')) return 'feu'
  return id
}

function dedupeCampuses(ranked) {
  const bestByInstitution = new Map()
  for (const uni of ranked) {
    const key = getInstitutionKey(uni)
    const prev = bestByInstitution.get(key)
    if (!prev || compareUniversities(uni, prev) < 0) {
      bestByInstitution.set(key, uni)
    }
  }
  return [...bestByInstitution.values()].sort(compareUniversities)
}

function getProgramHaystack(university) {
  return [
    ...(university.popularCourses ?? []),
    ...(university.programHighlights ?? []),
  ]
    .join(' ')
    .toLowerCase()
}

function countKeywordHits(university, career) {
  const haystack = getProgramHaystack(university)
  const keywords = CAREER_KEYWORDS[career?.id] ?? []
  return keywords.filter((keyword) => haystackIncludesKeyword(haystack, keyword)).length
}

function buildMatchSignals(university, profile, career, keywordHits) {
  const signals = []
  const primary = profile.primaryDimension?.code
  const secondary = profile.secondaryDimension?.code
  const tags = university.riasecTags ?? []

  if (primary && tags.includes(primary)) {
    signals.push(`${profile.primaryDimension.info.name} campus fit`)
  }
  if (secondary && tags.includes(secondary)) {
    signals.push(`${profile.secondaryDimension.info.name} alignment`)
  }
  if (keywordHits > 0) {
    signals.push(`${keywordHits} program keyword${keywordHits > 1 ? 's' : ''}`)
  }
  return signals
}

function qualifiesForSchoolList(university, profile, career, relevanceScore, keywordHits) {
  if (relevanceScore < MIN_SCHOOL_SCORE) return false
  if (keywordHits >= 1) return true
  if (insightIndex.has(`${university.id}:${career?.id}`)) return true

  const programKeywords = CAREER_KEYWORDS[career?.id] ?? []
  if (programKeywords.length > 0) {
    // Career has a known program vocabulary — RIASEC/prestige alone is not enough.
    return false
  }

  const primary = profile.primaryDimension?.code
  const tags = university.riasecTags ?? []
  if (primary && tags.includes(primary)) return true
  return relevanceScore >= 12
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

export function scoreUniversity(university, profile, career, keywordHits) {
  let score = 0
  const primary = profile.primaryDimension?.code
  const secondary = profile.secondaryDimension?.code
  const tags = university.riasecTags ?? []

  if (primary && tags.includes(primary)) score += 4
  if (secondary && tags.includes(secondary)) score += 3
  if (university.type === 'public') score += 1
  if (keywordHits > 0) {
    score += 8 + Math.min(keywordHits - 1, 2)
  }
  if ((university.programHighlights?.length ?? 0) > 0 && keywordHits > 0) score += 1

  // Specialty campus boost from strengthTags overlapping career keywords.
  const strengths = (university.strengthTags ?? []).map((s) => s.toLowerCase().replace(/-/g, ' '))
  const keywords = (CAREER_KEYWORDS[career?.id] ?? []).map((k) => k.toLowerCase())
  if (strengths.length && keywords.length) {
    const strengthHits = keywords.filter((k) => strengths.some((s) => s.includes(k) || k.includes(s))).length
    if (strengthHits > 0) score += 3 + Math.min(strengthHits - 1, 2)
  }

  const tagBreadth = tags.length
  if (keywordHits === 0) {
    if (tagBreadth >= 6) score -= 2
    else if (tagBreadth >= 5) score -= 1
  }

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
  if (b.keywordHits !== a.keywordHits) return b.keywordHits - a.keywordHits
  return (a.name ?? '').localeCompare(b.name ?? '')
}

export function getUniversityMatchesForCareer(profile, career, limit = 3) {
  const careerId = career?.id
  const ranked = dedupeCampuses(
    universitiesData.universities
      .filter((uni) => {
        const allowed = SCHOOL_CAREER_ALLOWLIST[uni.id]
        if (!allowed) return true
        return careerId ? allowed.has(careerId) : false
      })
      .map((uni) => {
        const keywordHits = countKeywordHits(uni, career)
        const relevanceScore = scoreUniversity(uni, profile, career, keywordHits)
        const match = matchLabel(relevanceScore)
        const insightData = resolveSchoolInsight(uni, career)
        return {
          ...uni,
          relevanceScore,
          keywordHits,
          matchSignals: buildMatchSignals(uni, profile, career, keywordHits),
          matchLabel: match.label,
          matchTone: match.tone,
          insightHeadline: insightData.headline,
          insight: insightData.body,
          insightSource: insightData.source,
        }
      })
      .filter((uni) => qualifiesForSchoolList(uni, profile, career, uni.relevanceScore, uni.keywordHits))
      .sort(compareUniversities)
  )

  // If a new career has keywords that no campus lists yet, fall back to strong RIASEC campus fits.
  const withFallback =
    ranked.length > 0
      ? ranked
      : dedupeCampuses(
          universitiesData.universities
            .filter((uni) => !SCHOOL_CAREER_ALLOWLIST[uni.id])
            .map((uni) => {
              const keywordHits = 0
              const relevanceScore = scoreUniversity(uni, profile, career, keywordHits)
              const match = matchLabel(relevanceScore)
              const insightData = resolveSchoolInsight(uni, career)
              return {
                ...uni,
                relevanceScore,
                keywordHits,
                matchSignals: buildMatchSignals(uni, profile, career, keywordHits),
                matchLabel: match.label,
                matchTone: match.tone,
                insightHeadline: insightData.headline,
                insight: insightData.body,
                insightSource: insightData.source,
              }
            })
            .filter((uni) => {
              if (uni.relevanceScore < MIN_SCHOOL_SCORE) return false
              const primary = profile.primaryDimension?.code
              const tags = uni.riasecTags ?? []
              return Boolean(primary && tags.includes(primary)) || uni.relevanceScore >= 10
            })
            .sort(compareUniversities),
        )

  if (limit == null) return withFallback
  return withFallback.slice(0, limit)
}

export function getUniversitiesMetadata() {
  return universitiesData.metadata
}
