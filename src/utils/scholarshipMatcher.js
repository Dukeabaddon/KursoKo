import scholarshipsData from '../data/scholarships.json'

const LEGACY_SCHOOL_TAGS = {
  'pup-manila': ['pup', 'pup-system', 'public', 'business', 'technology'],
  'ateneo-manila': ['ateneo', 'leadership', 'research', 'service'],
  'feu-manila': ['feu', 'healthcare', 'business', 'arts'],
  'dlsu-manila': ['dlsu', 'technology', 'business', 'research'],
}

function getSchoolInstitutionTags(school) {
  if (!school?.id) return []
  const legacy = LEGACY_SCHOOL_TAGS[school.id] ?? []
  const slugPrefix = school.id.split('-')[0]
  const strength = (school.strengthTags ?? []).map((tag) => String(tag).toLowerCase())
  return [...new Set([...legacy, slugPrefix, school.type, ...strength].filter(Boolean))]
}

function getResidencyRule(scholarship) {
  if (scholarship.residencyRule) return scholarship.residencyRule
  if (scholarship.institutionTags?.includes('qcydo')) {
    return {
      required: true,
      scope: 'city',
      jurisdictionSlug: 'quezon-city',
      jurisdictionLabel: 'Quezon City',
      strict: true,
    }
  }
  return { required: false, scope: 'national', strict: false }
}

export function passesResidencyFilter(scholarship, userLocation) {
  const rule = getResidencyRule(scholarship)
  if (!rule.required || !rule.strict) return true
  if (!userLocation?.cityLguSlug) return false
  return userLocation.cityLguSlug === rule.jurisdictionSlug
}

function scoreResidencyMatch(scholarship, userLocation) {
  const rule = getResidencyRule(scholarship)
  if (!userLocation?.cityLguSlug || !rule.required) return 0
  if (userLocation.cityLguSlug === rule.jurisdictionSlug) return 3
  return -2
}

function getPreferredLevels(career) {
  switch (career?.id) {
    case 'electrician':
      return ['tvet', 'continuing-education', 'college']
    case 'lawyer':
      return ['college', 'graduate']
    default:
      return ['college', 'tvet']
  }
}

function scoreScholarship(scholarship, profile, career, schools, userLocation) {
  let score = 0
  const primary = profile.primaryDimension?.code
  const secondary = profile.secondaryDimension?.code
  const tags = scholarship.riasecTags ?? []
  const careerTags = scholarship.careerTags ?? []
  const institutionTags = scholarship.institutionTags ?? []
  const preferredLevels = getPreferredLevels(career)
  const scholarshipLevels = scholarship.level ?? []
  const schoolList = Array.isArray(schools) ? schools : schools ? [schools] : []
  const schoolTagSet = new Set(
    schoolList.flatMap((school) => getSchoolInstitutionTags(school))
  )

  if (primary && tags.includes(primary)) score += 3
  if (secondary && tags.includes(secondary)) score += 2
  if (tags.length === 6) score += 1
  if (career?.id && careerTags.includes(career.id)) score += 6
  if (careerTags.length === 0) score += 1
  if (scholarshipLevels.some((level) => preferredLevels.includes(level))) score += 3

  schoolTagSet.forEach((tag) => {
    if (institutionTags.includes(tag)) score += 4
  })

  if (schoolList.some((school) => school?.type === 'public') && scholarship.category === 'government') {
    score += 1
  }

  score += scoreResidencyMatch(scholarship, userLocation)

  if (scholarship.category === 'government' && !scholarship.institutionTags?.includes('qcydo')) {
    score += 1
  }
  if (scholarship.status === 'active') score += 1

  return score
}

export function getScholarshipMatchesForCareer(profile, career, schools, limit = 5, userLocation = null) {
  return scholarshipsData.scholarships
    .filter((item) => passesResidencyFilter(item, userLocation))
    .map((item) => ({
      ...item,
      relevanceScore: scoreScholarship(item, profile, career, schools, userLocation),
    }))
    .filter((item) => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
}

export function getScholarshipMatches(profile, topCareers = [], limit = 5, userLocation = null) {
  const topCareer = topCareers[0]
  return getScholarshipMatchesForCareer(profile, topCareer, [], limit, userLocation)
}

export function getScholarshipsMetadata() {
  return scholarshipsData.metadata
}

export function inferUserLocationFromSchool(school) {
  if (!school?.lguId) return null
  return {
    cityLguSlug: school.lguId,
    cityLabel: school.city ?? school.location,
    region: school.region ?? 'NCR',
    source: 'inferred-from-school',
  }
}
