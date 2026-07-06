import scholarshipsData from '../data/scholarships.json'

const ALL_SCHOLARSHIPS = scholarshipsData.scholarships

/** Pre-index scholarships by career id to avoid scanning all 300+ on every Results render. */
const scholarshipsByCareerId = ALL_SCHOLARSHIPS.reduce((index, scholarship) => {
  for (const careerId of scholarship.careerTags ?? []) {
    if (!index.has(careerId)) index.set(careerId, [])
    index.get(careerId).push(scholarship)
  }
  return index
}, new Map())

const universalScholarships = ALL_SCHOLARSHIPS.filter((item) => !(item.careerTags?.length > 0))

function getScholarshipPool(career) {
  if (!career?.id) return ALL_SCHOLARSHIPS

  const tagged = scholarshipsByCareerId.get(career.id) ?? []
  if (tagged.length === 0) return ALL_SCHOLARSHIPS

  const seen = new Set()
  const pool = []

  for (const scholarship of [...tagged, ...universalScholarships]) {
    if (seen.has(scholarship.id)) continue
    seen.add(scholarship.id)
    pool.push(scholarship)
  }

  return pool
}

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

  let riasecScore = 0
  if (primary && tags.includes(primary)) riasecScore += 3
  if (secondary && tags.includes(secondary)) riasecScore += 2
  const tagBreadth = tags.length
  const breadthFactor =
    tagBreadth >= 6 ? 0.25 : tagBreadth >= 5 ? 0.55 : tagBreadth >= 4 ? 0.75 : 1
  score += Math.round(riasecScore * breadthFactor)
  if (career?.id && careerTags.includes(career.id)) score += 6
  else if (tagBreadth >= 6) score -= 2
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

  return score
}

function compareScholarships(a, b) {
  if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore
  const careerTagA = (a.careerTags ?? []).length > 0 ? 1 : 0
  const careerTagB = (b.careerTags ?? []).length > 0 ? 1 : 0
  if (careerTagB !== careerTagA) return careerTagB - careerTagA
  const riasecA = (a.riasecTags ?? []).length
  const riasecB = (b.riasecTags ?? []).length
  if (riasecA !== riasecB) return riasecA - riasecB
  const dateA = a.verificationDate ?? ''
  const dateB = b.verificationDate ?? ''
  if (dateB !== dateA) return dateB.localeCompare(dateA)
  return (a.name ?? '').localeCompare(b.name ?? '')
}

export function getScholarshipMatchesForCareer(profile, career, schools, limit = 5, userLocation = null) {
  const ranked = getScholarshipPool(career)
    .filter((item) => passesResidencyFilter(item, userLocation))
    .map((item) => ({
      ...item,
      relevanceScore: scoreScholarship(item, profile, career, schools, userLocation),
    }))
    .filter((item) => item.relevanceScore > 0)
    .sort(compareScholarships)

  if (limit == null) return ranked
  return ranked.slice(0, limit)
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
