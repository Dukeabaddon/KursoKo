/**
 * RIASEC Scoring Algorithm
 * Calculates personality dimension scores from questionnaire responses
 */

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
  // Sort dimensions by score (descending) and return top N
  return Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, count)
    .map(([code, score]) => ({ code, score }))
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
  const scores = calculateRiasecScores(responses)
  const topDimensions = getTopDimensions(scores, 2)
  const combination = getDimensionCombination(topDimensions)
  const dimensionInfo = getDimensionInfo()
  
  return {
    scores,
    topDimensions,
    combination,
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
