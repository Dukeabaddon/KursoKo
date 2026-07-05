import { useState, useCallback, useEffect, useRef } from 'react'
import {
  HomePage,
  Questionnaire,
  Results,
  ErrorBoundary,
  LoadingSpinner,
  ErrorState,
  SkipLinks,
} from './components'
import { SpotlightCursor, spotlightScopeProps } from './components/shared/ui'
import { validateAndSanitize } from './utils/validation'
import {
  startSession,
  isSessionValid,
  clearSession,
  checkRateLimit,
  recordSubmission,
} from './utils/sessionManager'
import {
  APP_PAGES,
  resolveInitialAppState,
  saveResultsSnapshot,
  saveAppRoute,
  clearAllAssessmentData,
} from './utils/assessmentPersistence'

function App() {
  const [currentPage, setCurrentPage] = useState(APP_PAGES.HOME)
  const [responses, setResponses] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState(null)
  const [questionnaireRestore, setQuestionnaireRestore] = useState(null)
  const [isHydrating, setIsHydrating] = useState(true)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    const initial = resolveInitialAppState()
    setCurrentPage(initial.page)
    setResponses(initial.responses)
    setQuestionnaireRestore(initial.questionnaireRestore)

    if (initial.page === APP_PAGES.QUESTIONNAIRE && !isSessionValid()) {
      startSession()
    }

    setIsHydrating(false)
  }, [])

  const startQuestionnaire = useCallback(() => {
    clearAllAssessmentData()
    clearSession()
    const sessionId = startSession()
    console.log('New assessment session started:', sessionId)

    setQuestionnaireRestore(null)
    setResponses([])
    setError(null)
    saveAppRoute(APP_PAGES.QUESTIONNAIRE)
    setCurrentPage(APP_PAGES.QUESTIONNAIRE)
  }, [])

  const completeQuestionnaire = useCallback(async (questionnaireResponses) => {
    try {
      setError(null)

      if (!isSessionValid()) {
        startSession()
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
      saveResultsSnapshot(validation.sanitizedResponses)
      clearSession()
      setQuestionnaireRestore(null)
      setCurrentPage(APP_PAGES.RESULTS)
    } catch (err) {
      console.error('Error completing questionnaire:', err)
      setError(err.message || 'Failed to submit questionnaire')
      setIsCalculating(false)
    }
  }, [])

  const goHome = useCallback(() => {
    clearAllAssessmentData()
    clearSession()
    setQuestionnaireRestore(null)
    setCurrentPage(APP_PAGES.HOME)
    setResponses([])
    setError(null)
  }, [])

  const leaveQuestionnaire = useCallback(() => {
    saveAppRoute(APP_PAGES.HOME)
    setCurrentPage(APP_PAGES.HOME)
    setError(null)
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    if (currentPage === APP_PAGES.QUESTIONNAIRE) {
      startQuestionnaire()
    }
  }, [currentPage, startQuestionnaire])

  if (isHydrating) {
    return (
      <div
        className="relative isolate flex min-h-screen flex-col bg-landing-paper"
        {...spotlightScopeProps}
      >
        <SpotlightCursor />
        <div className="spotlight-content-layer flex flex-1 items-center justify-center">
          <LoadingSpinner message="Loading…" size="md" />
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary onReset={goHome}>
      <SkipLinks />
      <div
        className="relative isolate flex min-h-screen flex-col safe-area-padding"
        role="application"
        aria-label="KursoKo Career Assessment System"
        {...spotlightScopeProps}
      >
        <SpotlightCursor />

        <div className="spotlight-content-layer">
        <main
          id="main"
          className={`flex-1 ${currentPage === APP_PAGES.QUESTIONNAIRE ? 'overflow-hidden' : 'mobile-spacing'}`}
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
              className={currentPage === APP_PAGES.QUESTIONNAIRE ? '' : 'mobile-spacing'}
              role="region"
              aria-live="polite"
              aria-atomic="true"
            >
              {currentPage === APP_PAGES.HOME && (
                <HomePage onStartQuestionnaire={startQuestionnaire} />
              )}

              {currentPage === APP_PAGES.QUESTIONNAIRE && (
                <Questionnaire
                  key={questionnaireRestore?.updatedAt ?? 'fresh'}
                  initialProgress={questionnaireRestore}
                  onComplete={completeQuestionnaire}
                  onBack={leaveQuestionnaire}
                />
              )}

              {currentPage === APP_PAGES.RESULTS && responses.length > 0 && (
                <Results
                  responses={responses}
                  onRetake={startQuestionnaire}
                  onHome={goHome}
                />
              )}

              {currentPage === APP_PAGES.RESULTS && responses.length === 0 && (
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
      </div>
    </ErrorBoundary>
  )
}

export default App
