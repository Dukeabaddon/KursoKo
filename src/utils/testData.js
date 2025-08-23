/**
 * Test data for development and testing
 */

export const sampleResponses = [
  {
    questionId: 1,
    selectedOption: 'A',
    selectedCode: 'R',
    rating: 3,
    questionText: "Which task would you enjoy more?",
    selectedText: "Building a robot kit"
  },
  {
    questionId: 2,
    selectedOption: 'B',
    selectedCode: 'S',
    rating: 2,
    questionText: "Choose your preferred activity:",
    selectedText: "Tutoring classmates in math"
  },
  {
    questionId: 3,
    selectedOption: 'A',
    selectedCode: 'E',
    rating: 3,
    questionText: "Which would you rather do?",
    selectedText: "Starting an online business"
  },
  // Add more sample responses to test different combinations
  {
    questionId: 4,
    selectedOption: 'A',
    selectedCode: 'R',
    rating: 2,
    questionText: "Pick your preferred project:",
    selectedText: "Repairing smartphone hardware"
  },
  {
    questionId: 5,
    selectedOption: 'B',
    selectedCode: 'S',
    rating: 3,
    questionText: "Which creative work appeals more?",
    selectedText: "Counseling peers through stress"
  }
]

export const testPersonalityProfile = () => {
  const { getPersonalityProfile } = require('./riasecScoring')
  const profile = getPersonalityProfile(sampleResponses)
  console.log('Test Profile:', profile)
  return profile
}
