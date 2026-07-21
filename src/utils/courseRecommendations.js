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

export const getCourseRecommendationsForCombinations = (combinations) => {
  const uniqueCombinations = [...new Set(combinations.filter(Boolean))]
  const recommendations = uniqueCombinations
    .map((combination) => ({ combination, value: getCourseRecommendations(combination) }))
    .filter((row) => row.value)

  if (recommendations.length <= 1) {
    const single = recommendations[0]
    return single ? { ...single.value, combinations: [single.combination] } : null
  }

  const courses = []
  const seenTitles = new Set()
  const longestList = Math.max(...recommendations.map((row) => row.value.courses.length))

  for (let index = 0; index < longestList; index += 1) {
    for (const row of recommendations) {
      const course = row.value.courses[index]
      if (!course || seenTitles.has(course.title)) continue
      seenTitles.add(course.title)
      courses.push(course)
    }
  }

  return {
    name: recommendations.map((row) => row.value.name).join(' + '),
    description: `Programs spanning your tied ${uniqueCombinations.join(' and ')} interest patterns`,
    combinations: recommendations.map((row) => row.combination),
    courses,
  }
}
