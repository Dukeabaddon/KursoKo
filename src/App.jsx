import { useState, useCallback } from 'react'
import {
  HomePage,
  Questionnaire,
  Results,
  ErrorBoundary,
  LoadingSpinner,
  ErrorState,
  SkipLinks,
} from './components'
import { validateAndSanitize } from './utils/validation'
import {
  startSession,
  isSessionValid,
  clearSession,
  checkRateLimit,
  recordSubmission,
} from './utils/sessionManager'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [responses, setResponses] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState(null)

  const startQuestionnaire = useCallback(() => {
    clearSession()
    const sessionId = startSession()
    console.log('New assessment session started:', sessionId)

    setResponses([])
    setError(null)
    setCurrentPage('questionnaire')
  }, [])

  const completeQuestionnaire = useCallback(async (questionnaireResponses) => {
    try {
      setError(null)

      if (!isSessionValid()) {
        throw new Error('Session expired. Please start again.')
      }

      const rateLimitCheck = checkRateLimit(5000)
      if (!rateLimitCheck.allowed) {
        const waitSeconds = Math.ceil(rateLimitCheck.waitTime / 1000)
        throw new Error(`Please wait ${waitSeconds} seconds before submitting again.`)
      }

      const validation = validateAndSanitize(questionnaireResponses)

      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors)
        throw new Error('Invalid responses detected. Please try again.')
      }

      if (validation.errors.length > 0) {
        console.warn('Validation warnings:', validation.errors)
      }

      setResponses(validation.sanitizedResponses)

      setIsCalculating(true)
      await new Promise((resolve) => setTimeout(resolve, 600))
      setIsCalculating(false)

      recordSubmission()
      setCurrentPage('results')
      clearSession()
    } catch (err) {
      console.error('Error completing questionnaire:', err)
      setError(err.message || 'Failed to submit questionnaire')
      setIsCalculating(false)
    }
  }, [])

  const goHome = useCallback(() => {
    clearSession()
    setCurrentPage('home')
    setResponses([])
    setError(null)
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    if (currentPage === 'questionnaire') {
      startQuestionnaire()
    }
  }, [currentPage, startQuestionnaire])

  return (
    <ErrorBoundary onReset={goHome}>
      <SkipLinks />
      <div
        className="min-h-screen flex flex-col safe-area-padding"
        role="application"
        aria-label="KursoKo Career Assessment System"
      >
        <main
          id="main"
          className={`flex-1 ${currentPage === 'questionnaire' ? 'overflow-hidden' : 'mobile-spacing'}`}
          aria-label="Main content"
        >
          {error && (
            <ErrorState
              title="Oops! May problema"
              message={error}
              onRetry={handleRetry}
              onHome={goHome}
            />
          )}

          {isCalculating && (
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner message="Kina-calculate ang iyong resulta..." size="lg" />
            </div>
          )}

          {!error && !isCalculating && (
            <div
              className={currentPage === 'questionnaire' ? '' : 'mobile-spacing'}
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
                />
              )}

              {currentPage === 'results' && responses.length > 0 && (
                <Results
                  responses={responses}
                  onRetake={startQuestionnaire}
                  onHome={goHome}
                />
              )}

              {currentPage === 'results' && responses.length === 0 && (
                <ErrorState
                  title="Walang resulta"
                  message="Magsimula muna ng assessment."
                  onRetry={startQuestionnaire}
                  onHome={goHome}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
