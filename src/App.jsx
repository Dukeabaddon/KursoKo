<<<<<<< HEAD
import { useState, useCallback, useRef } from 'react'
import { 
  HomePage, 
  Questionnaire, 
  Results,
  ErrorBoundary,
  LoadingSpinner,
  ErrorState
} from './components'
import { validateAndSanitize } from './utils/validation'
import { 
  startSession, 
  isSessionValid, 
  clearSession,
  checkRateLimit,
  recordSubmission 
} from './utils/sessionManager'

function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home')
  
  // Assessment data
  const [responses, setResponses] = useState([])
  const [results, setResults] = useState(null)
  const [questionnaireProgress, setQuestionnaireProgress] = useState({ 
    current: 0, 
    total: 0 
  })
  
  // UI states
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState(null)
  
  // Rate limiting
  const lastSubmitTime = useRef(0)

  /**
   * Starts a new assessment session
   * Implements session management and security
   */
  const startQuestionnaire = useCallback(() => {
    // Clear any existing session
    clearSession()
    
    // Create new session
    const sessionId = startSession()
    console.log('New assessment session started:', sessionId)
    
    // Reset all state
    setResponses([])
    setResults(null)
    setError(null)
    setQuestionnaireProgress({ current: 0, total: 0 })
    
    // Navigate to questionnaire
    setCurrentPage('questionnaire')
  }, [])

  /**
   * Handles questionnaire completion with validation
   * Implements security checks and data integrity validation
   */
  const completeQuestionnaire = useCallback(async (questionnaireResponses) => {
    try {
      setError(null)
      
      // 1. Validate session
      if (!isSessionValid()) {
        throw new Error('Session expired. Please start again.')
      }
      
      // 2. Rate limiting check
      const rateLimitCheck = checkRateLimit(5000) // 5 second minimum
      if (!rateLimitCheck.allowed) {
        const waitSeconds = Math.ceil(rateLimitCheck.waitTime / 1000)
        throw new Error(`Please wait ${waitSeconds} seconds before submitting again.`)
      }
      
      // 3. Validate and sanitize responses
      const validation = validateAndSanitize(questionnaireResponses)
      
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors)
        throw new Error('Invalid responses detected. Please try again.')
      }
      
      // Log warnings if any
      if (validation.errors.length > 0) {
        console.warn('Validation warnings:', validation.errors)
      }
      
      // 4. Record submission for rate limiting
      recordSubmission()
      lastSubmitTime.current = Date.now()
      
      // 5. Save sanitized responses
      setResponses(validation.sanitizedResponses)
      
      // 6. Calculate results (simulated with loading state)
      setIsCalculating(true)
      
      // Simulate calculation delay (replace with actual RIASEC calculation)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // TODO: Implement actual RIASEC scoring algorithm
      const calculatedResults = {
        scores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        primaryDimension: 'R',
        secondaryDimension: 'I',
        timestamp: Date.now()
      }
      
      setResults(calculatedResults)
      setIsCalculating(false)
      
      // 7. Navigate to results
      setCurrentPage('results')
      
      // 8. Clear session after successful completion
      clearSession()
      
    } catch (err) {
      console.error('Error completing questionnaire:', err)
      setError(err.message || 'Failed to submit questionnaire')
      setIsCalculating(false)
    }
  }, [])

  /**
   * Returns to homepage and clears all state
   */
  const goHome = useCallback(() => {
    clearSession()
    setCurrentPage('home')
    setResponses([])
    setResults(null)
    setError(null)
    setQuestionnaireProgress({ current: 0, total: 0 })
  }, [])

  /**
   * Retry handler for errors
   */
  const handleRetry = useCallback(() => {
    setError(null)
    if (currentPage === 'questionnaire') {
      startQuestionnaire()
    }
  }, [currentPage, startQuestionnaire])

  return (
    <ErrorBoundary onReset={goHome}>
      <div 
        className="min-h-screen flex flex-col safe-area-padding"
        role="application"
        aria-label="KursoKo Career Assessment System"
      >
        <main 
          className="flex-1 mobile-spacing" 
          role="main"
          aria-label="Main content"
        >
          {/* Error Display */}
          {error && (
            <ErrorState
              title="Oops! May problema"
              message={error}
              onRetry={handleRetry}
              onHome={goHome}
            />
          )}

          {/* Loading State */}
          {isCalculating && (
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner 
                message="Kina-calculate ang iyong resulta..." 
                size="lg"
              />
            </div>
          )}

          {/* Page Content - Only show if no error and not calculating */}
          {!error && !isCalculating && (
            <div 
              className="mobile-spacing"
              role="region"
              aria-live="polite"
              aria-atomic="true"
            >
              {currentPage === 'home' && (
                <HomePage onStartQuestionnaire={startQuestionnaire} />
              )}

              {currentPage === 'questionnaire' && (
                <Questionnaire
                  onComplete={completeQuestionnaire}
                  onBack={goHome}
                  onProgressUpdate={setQuestionnaireProgress}
                />
              )}

              {currentPage === 'results' && (
                <Results
                  responses={responses}
                  results={results}
                  onRetake={startQuestionnaire}
                  onHome={goHome}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
=======
function App() {
  return (
    <div>
      {/* Completely blank slate - homepage will be built from scratch */}
    </div>
>>>>>>> 9cd74d644a7b3628fe2387d5efea31215159eb3e
  )
}

export default App
