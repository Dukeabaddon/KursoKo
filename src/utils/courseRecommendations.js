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
