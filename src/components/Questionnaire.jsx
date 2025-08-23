import { useState, useEffect, useCallback } from 'react'
import questionsData from '../data/questions.json'

function Questionnaire({ onComplete, onBack, onProgressUpdate }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredRating, setHoveredRating] = useState(null)

  useEffect(() => {
    // Load questions from JSON file with loading state
    setIsLoading(true)
    try {
      if (questionsData && questionsData.questions) {
        // Simulate loading time for smooth transition
        setTimeout(() => {
          setQuestions(questionsData.questions)
          setIsLoading(false)
          // Update progress in parent component
          if (onProgressUpdate) {
            onProgressUpdate({ current: 0, total: questionsData.questions.length })
          }
        }, 300)
      } else {
        console.error('Questions data not found or invalid format')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      setIsLoading(false)
    }
  }, [onProgressUpdate])

  const handleOptionRatingSelect = (option, rating) => {
    // If clicking the same option and rating, deselect it
    if (selectedOption === option && selectedRating === rating) {
      setSelectedOption(null)
      setSelectedRating(null)
    } else {
      setSelectedOption(option)
      setSelectedRating(rating)
    }
  }

  const handleNext = useCallback(() => {
    if (selectedOption && selectedRating) {
      const currentQ = questions[currentQuestion]
      const selectedOptionData = selectedOption === 'A' ? currentQ.optionA : currentQ.optionB

      const newResponse = {
        questionId: currentQ.id,
        selectedOption: selectedOption,
        selectedCode: selectedOptionData.code,
        rating: selectedRating,
        questionText: currentQ.text,
        selectedText: selectedOptionData.text
      }

      const updatedResponses = [...responses, newResponse]
      setResponses(updatedResponses)

      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1
        setCurrentQuestion(nextQuestion)
        setSelectedOption(null)
        setSelectedRating(null)
        setHoveredRating(null) // Clear hover state
        // Update progress
        if (onProgressUpdate) {
          onProgressUpdate({ current: nextQuestion, total: questions.length })
        }
      } else {
        onComplete(updatedResponses)
      }
    }
  }, [selectedOption, selectedRating, questions, currentQuestion, responses, onProgressUpdate, onComplete])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && selectedOption && selectedRating) {
        handleNext()
      } else if (event.key === 'Escape') {
        setSelectedOption(null)
        setSelectedRating(null)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedOption, selectedRating, handleNext])

  const handleBack = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1
      setCurrentQuestion(prevQuestion)
      setSelectedOption(null)
      setSelectedRating(null)
      setHoveredRating(null) // Clear hover state
      // Remove last response
      setResponses(responses.slice(0, -1))
      // Update progress
      if (onProgressUpdate) {
        onProgressUpdate({ current: prevQuestion, total: questions.length })
      }
    } else {
      onBack()
    }
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  // Helper function to get rating label
  const getRatingLabel = (rating) => {
    const labels = {
      1: "Just Okay",
      2: "Great!",
      3: "Love It!"
    }
    return labels[rating] || "Just Okay"
  }

  // Helper function to get asset path for question options
  const getAssetPath = (questionId, option) => {
    // Assets are named like 1.1, 1.2, 2.1, 2.2, etc.
    const assetNumber = option === 'A' ? 1 : 2
    return `/assets/${questionId}.${assetNumber}.png`
  }

  // Helper function to get rating image using animated Google emoji GIFs
  const getRatingImage = (rating, shouldAnimate = false) => {
    const emojiData = {
      1: { 
        webp: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fae4/512.webp',
        gif: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fae4/512.gif',
        alt: '�',
        animationClass: 'thinking-animation' 
      },
      2: { 
        webp: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.webp',
        gif: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif',
        alt: '�',
        animationClass: 'happy-animation' 
      },
      3: { 
        webp: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.webp',
        gif: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif',
        alt: '😍',
        animationClass: 'love-animation' 
      }
    }

    const data = emojiData[rating]
    if (!data) return "😐"

    // Use animated GIFs with modern picture element for better performance
    return (
      <picture className={`emoji-gif ${shouldAnimate ? data.animationClass : ''}`}>
        <source srcSet={data.webp} type="image/webp" />
        <img 
          src={data.gif} 
          alt={data.alt} 
          width="32" 
          height="32"
          style={{ 
            display: 'block', 
            width: '32px', 
            height: '32px',
            objectFit: 'contain'
          }}
        />
      </picture>
    )
  }

  // Show loading state if questions haven't loaded yet
  if (isLoading || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-youth-full h-full flex flex-col animate-fade-in">
      <div className="card-youth flex-1 flex flex-col">
        {/* Enhanced Progress Bar with Youth-Friendly Design */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm mb-3">
            <span className="font-heading font-medium text-neutral-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="font-heading font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-5 overflow-hidden shadow-inner">
            <div
              className="h-5 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-pink-400 relative animate-progress-fill"
              style={{
                width: `${progress}%`,
                '--progress-width': `${progress}%`
              }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              {/* Diagonal stripes pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 12px)'
                }}
              ></div>
              {/* Celebration sparkles at milestones */}
              {progress >= 25 && progress < 30 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-300 animate-bounce">
                  ✨
                </div>
              )}
              {progress >= 50 && progress < 55 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-300 animate-bounce">
                  🎉
                </div>
              )}
              {progress >= 75 && progress < 80 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-300 animate-bounce">
                  🚀
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-title font-heading text-gradient-primary mb-4 animate-slide-in-left">
              {questions[currentQuestion].text}
            </h2>
            <p className="text-subtitle text-neutral-600 font-primary max-w-2xl mx-auto animate-slide-in-right">
              Choose the activity that appeals to you more and rate how much you'd enjoy it.
            </p>
          </div>

          {/* New Card Layout - Mobile-First Design */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mb-8">
            {/* Option A Card */}
            <div className={`questionnaire-card ${
              selectedOption && selectedOption !== 'A'
                ? 'opacity-60 saturate-75 scale-95'
                : 'opacity-100 saturate-100 scale-100'
            } ${selectedOption === 'A' ? 'selected' : ''}`}>

              {/* Illustration Container */}
              <div className="questionnaire-illustration-container">
                {questions[currentQuestion]?.id <= 14 ? (
                  <img
                    src={getAssetPath(questions[currentQuestion].id, 'A')}
                    alt={questions[currentQuestion].optionA.text}
                    className="questionnaire-asset-image"
                  />
                ) : (
                  <div className="questionnaire-placeholder">
                    {/* Placeholder for questions without assets */}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="questionnaire-content">
                <h3 className="questionnaire-title">
                  {questions[currentQuestion].optionA.text}
                </h3>

                {/* Rating Options */}
                <div className="questionnaire-ratings">
                  {[1, 2, 3].map((rating) => {
                    const ratingKey = `A-${rating}`
                    const isSelected = selectedOption === 'A' && selectedRating === rating
                    const isHovered = hoveredRating === ratingKey
                    const shouldAnimate = isSelected || isHovered

                    return (
                      <div
                        key={ratingKey}
                        onClick={() => handleOptionRatingSelect('A', rating)}
                        onMouseEnter={() => setHoveredRating(ratingKey)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className={`questionnaire-rating-option ${isSelected ? 'selected' : ''}`}
                      >
                        <span className="questionnaire-rating-emoji text-xl">
                          {getRatingImage(rating, shouldAnimate)}
                        </span>
                        <span className="questionnaire-rating-text">
                          {getRatingLabel(rating)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex items-center justify-center">
              <div className="questionnaire-or-divider">
                OR
              </div>
            </div>

            {/* Option B Card */}
            <div className={`questionnaire-card ${
              selectedOption && selectedOption !== 'B'
                ? 'opacity-60 saturate-75 scale-95'
                : 'opacity-100 saturate-100 scale-100'
            } ${selectedOption === 'B' ? 'selected' : ''}`}>

              {/* Illustration Container */}
              <div className="questionnaire-illustration-container">
                {questions[currentQuestion]?.id <= 14 ? (
                  <img
                    src={getAssetPath(questions[currentQuestion].id, 'B')}
                    alt={questions[currentQuestion].optionB.text}
                    className="questionnaire-asset-image"
                  />
                ) : (
                  <div className="questionnaire-placeholder">
                    {/* Placeholder for questions without assets */}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="questionnaire-content">
                <h3 className="questionnaire-title">
                  {questions[currentQuestion].optionB.text}
                </h3>

                {/* Rating Options */}
                <div className="questionnaire-ratings">
                  {[1, 2, 3].map((rating) => {
                    const ratingKey = `B-${rating}`
                    const isSelected = selectedOption === 'B' && selectedRating === rating
                    const isHovered = hoveredRating === ratingKey
                    const shouldAnimate = isSelected || isHovered

                    return (
                      <div
                        key={ratingKey}
                        onClick={() => handleOptionRatingSelect('B', rating)}
                        onMouseEnter={() => setHoveredRating(ratingKey)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className={`questionnaire-rating-option ${isSelected ? 'selected' : ''}`}
                      >
                        <span className="questionnaire-rating-emoji text-xl">
                          {getRatingImage(rating, shouldAnimate)}
                        </span>
                        <span className="questionnaire-rating-text">
                          {getRatingLabel(rating)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Youth-Friendly Design */}
        <div className="flex justify-between items-center mt-8 gap-4">
          {/* Back Button - Only show if not first question */}
          {currentQuestion > 0 ? (
            <button
              onClick={handleBack}
              className="btn-secondary flex items-center gap-3 touch-target interactive-scale"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline font-heading">Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {/* Next Button - Only show if selection is made */}
          {selectedOption && selectedRating ? (
            <button
              onClick={handleNext}
              className="btn-secondary flex items-center gap-3 touch-target"
            >
              <span className="font-heading text-base sm:text-lg">
                {currentQuestion < questions.length - 1 ? (
                  <>
                    <span className="hidden sm:inline">Next Question</span>
                    <span className="sm:hidden">Next</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Complete Assessment 🎉</span>
                    <span className="sm:hidden">Complete 🎉</span>
                  </>
                )}
              </span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Questionnaire
