/**
 * RIASEC Scoring Algorithm
 * Calculates personality dimension scores from questionnaire responses
 */

import questionsData from '../data/questions.json'

const RIASEC_ORDER = ['R', 'I', 'A', 'S', 'E', 'C']
const SCORE_TIE_EPSILON = 0.01

const DIMENSION_OPPORTUNITIES = questionsData.questions.reduce(
  (counts, question) => {
    counts[question.optionA.code] += 1
    counts[question.optionB.code] += 1
    return counts
  },
  { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
)

const MAX_DIMENSION_OPPORTUNITIES = Math.max(...Object.values(DIMENSION_OPPORTUNITIES))

export const getDimensionOpportunityCounts = () => ({ ...DIMENSION_OPPORTUNITIES })

export const normalizeRiasecScores = (scores) => Object.fromEntries(
  Object.entries(scores).map(([code, score]) => [
    code,
    Number(((score * MAX_DIMENSION_OPPORTUNITIES) / DIMENSION_OPPORTUNITIES[code]).toFixed(2)),
  ])
)

export const calculateRiasecScores = (responses) => {
  // Initialize scores for all 6 RIASEC dimensions
  const scores = {
    R: 0, // Realistic
    I: 0, // Investigative
    A: 0, // Artistic
    S: 0, // Social
    E: 0, // Enterprising
    C: 0  // Conventional
  }

  // Calculate scores based on responses
  responses.forEach(response => {
    const code = response.selectedCode
    const rating = response.rating
    
    if (Object.hasOwn(scores, code)) {
      scores[code] += rating
    }
  })

  return scores
}

export const getTopDimensions = (scores, count = 2) => {
  return RIASEC_ORDER.map((code, order) => ({ code, score: scores[code] ?? 0, order }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, count)
    .map(({ code, score }) => ({ code, score }))
}

export const getDimensionPattern = (scores) => {
  const ranked = getTopDimensions(scores, RIASEC_ORDER.length)
  const primary = ranked[0]
  if (!primary) return { label: '', combinationCandidates: [] }

  const primaryTies = ranked.filter(
    (row) => Math.abs(row.score - primary.score) <= SCORE_TIE_EPSILON,
  )
  if (primaryTies.length > 1) {
    const codes = primaryTies.map((row) => row.code)
    return {
      label: `${codes.join('/')} tie`,
      combinationCandidates: [codes.slice(0, 2).join('')],
    }
  }

  const secondary = ranked[1]
  if (!secondary) return { label: primary.code, combinationCandidates: [primary.code] }
  const secondaryTies = ranked.filter(
    (row) =>
      row.code !== primary.code &&
      Math.abs(row.score - secondary.score) <= SCORE_TIE_EPSILON,
  )
  const secondaryCodes = secondaryTies.map((row) => row.code)

  return {
    label:
      secondaryCodes.length > 1
        ? `${primary.code} + ${secondaryCodes.join('/')} tie`
        : `${primary.code}${secondary.code}`,
    combinationCandidates: secondaryCodes.map((code) => `${primary.code}${code}`),
  }
}

export const getDimensionCombination = (topDimensions) => {
  // Create combination code from top 2 dimensions (e.g., "RI", "SA", etc.)
  if (topDimensions.length >= 2) {
    return topDimensions[0].code + topDimensions[1].code
  }
  return topDimensions[0]?.code || ''
}

export const getDimensionInfo = () => {
  return {
    R: {
      name: 'Realistic',
      description: 'Hands-on, practical work with tools and machines',
      traits: ['Practical', 'Mechanical', 'Physical', 'Outdoors'],
      color: 'red'
    },
    I: {
      name: 'Investigative', 
      description: 'Research, analysis, and problem-solving',
      traits: ['Analytical', 'Scientific', 'Curious', 'Logical'],
      color: 'blue'
    },
    A: {
      name: 'Artistic',
      description: 'Creative expression and artistic activities',
      traits: ['Creative', 'Expressive', 'Original', 'Independent'],
      color: 'purple'
    },
    S: {
      name: 'Social',
      description: 'Helping, teaching, and working with people',
      traits: ['Helpful', 'Caring', 'Teaching', 'Cooperative'],
      color: 'green'
    },
    E: {
      name: 'Enterprising',
      description: 'Leadership, business, and entrepreneurial activities',
      traits: ['Persuasive', 'Leadership', 'Ambitious', 'Energetic'],
      color: 'orange'
    },
    C: {
      name: 'Conventional',
      description: 'Organization, data management, and systematic work',
      traits: ['Organized', 'Detail-oriented', 'Systematic', 'Efficient'],
      color: 'gray'
    }
  }
}

export const getPersonalityProfile = (responses) => {
  const rawScores = calculateRiasecScores(responses)
  const scores = normalizeRiasecScores(rawScores)
  const topDimensions = getTopDimensions(scores, 2)
  const combination = getDimensionCombination(topDimensions)
  const { label: patternLabel, combinationCandidates } = getDimensionPattern(scores)
  const dimensionInfo = getDimensionInfo()
  
  return {
    scores,
    rawScores,
    topDimensions,
    combination,
    patternLabel,
    combinationCandidates,
    primaryDimension: {
      code: topDimensions[0]?.code,
      score: topDimensions[0]?.score,
      info: dimensionInfo[topDimensions[0]?.code]
    },
    secondaryDimension: {
      code: topDimensions[1]?.code,
      score: topDimensions[1]?.score,
      info: dimensionInfo[topDimensions[1]?.code]
    },
    allDimensions: Object.entries(scores).map(([code, score]) => ({
      code,
      score,
      info: dimensionInfo[code]
    }))
  }
}
