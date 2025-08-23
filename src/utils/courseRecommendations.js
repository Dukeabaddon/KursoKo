import coursesData from '../data/courses.json'

/**
 * Get course recommendations based on RIASEC combination
 */
export const getCourseRecommendations = (combination) => {
  const recommendations = coursesData.courseRecommendations[combination]
  
  if (!recommendations) {
    // If exact combination not found, try reverse combination
    const reverseCombination = combination.split('').reverse().join('')
    return coursesData.courseRecommendations[reverseCombination] || null
  }
  
  return recommendations
}

/**
 * Get all possible course recommendations for fallback
 */
export const getAllCourseCategories = () => {
  return coursesData.courseRecommendations
}

/**
 * Get match strength color class
 */
export const getMatchStrengthColor = (strength) => {
  const colorMap = {
    'Excellent': 'bg-green-100 text-green-800 border-green-300',
    'Very Good': 'bg-blue-100 text-blue-800 border-blue-300', 
    'Good': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Fair': 'bg-orange-100 text-orange-800 border-orange-300'
  }
  return colorMap[strength] || 'bg-gray-100 text-gray-800 border-gray-300'
}

/**
 * Get related course recommendations based on individual dimensions
 */
export const getRelatedRecommendations = (primaryCode, secondaryCode) => {
  const allRecommendations = coursesData.courseRecommendations
  const related = []
  
  // Find combinations that include either primary or secondary dimension
  Object.entries(allRecommendations).forEach(([combo, data]) => {
    if (combo.includes(primaryCode) || combo.includes(secondaryCode)) {
      related.push({
        combination: combo,
        ...data
      })
    }
  })
  
  return related.slice(0, 3) // Return top 3 related
}
