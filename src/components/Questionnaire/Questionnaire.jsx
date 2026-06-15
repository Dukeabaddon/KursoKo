import { useState, useEffect, useCallback, useRef } from 'react'
import questionsData from '../../data/questions.json'
import { AssessmentChoiceCard, AssessmentShell, useAssessmentScrollReveal } from '../assessment'
import {
  assessmentGhostBtn,
  assessmentPrimaryBtn,
  ASSESSMENT_EXIT_MS,
  SPARK_ACCENT,
  SPARK_PURPLE
} from '../assessment/assessmentClasses'
import { ClickSpark } from '../ui'

function Questionnaire({ onComplete, onBack, onProgressUpdate }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animPhase, setAnimPhase] = useState('idle')
  const timersRef = useRef([])
  const scrollRef = useRef(null)

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const schedule = useCallback((fn, ms) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])

  useEffect(() => {
    if (questionsData?.questions) {
      setQuestions(questionsData.questions)
      onProgressUpdate?.({ current: 0, total: questionsData.questions.length })
    }
    setIsLoading(false)
  }, [onProgressUpdate])

  useEffect(() => () => clearTimers(), [clearTimers])

  const questionId = questions[currentQuestion]?.id
  useAssessmentScrollReveal(scrollRef, questionId)

  const isAnimating = animPhase !== 'idle'

  const handleOptionRatingSelect = (option, rating) => {
    if (isAnimating) return
    if (selectedOption === option && selectedRating === rating) {
      setSelectedOption(null)
      setSelectedRating(null)
    } else {
      setSelectedOption(option)
      setSelectedRating(rating)
    }
  }

  const advanceQuestion = useCallback(
    (updatedResponses, nextQuestion) => {
      scrollToTop()
      setResponses(updatedResponses)
      setCurrentQuestion(nextQuestion)
      setSelectedOption(null)
      setSelectedRating(null)
      setAnimPhase('idle')
      onProgressUpdate?.({ current: nextQuestion, total: questions.length })
    },
    [onProgressUpdate, questions.length, scrollToTop]
  )

  const handleNext = useCallback(() => {
    if (!selectedOption || !selectedRating || isAnimating) return

    const currentQ = questions[currentQuestion]
    const selectedOptionData = selectedOption === 'A' ? currentQ.optionA : currentQ.optionB

    const newResponse = {
      questionId: currentQ.id,
      selectedOption,
      selectedCode: selectedOptionData.code,
      rating: selectedRating,
      questionText: currentQ.text,
      selectedText: selectedOptionData.text
    }

    const updatedResponses = [...responses, newResponse]

    if (currentQuestion >= questions.length - 1) {
      onComplete(updatedResponses)
      return
    }

    setAnimPhase('exit')

    schedule(() => {
      advanceQuestion(updatedResponses, currentQuestion + 1)
    }, ASSESSMENT_EXIT_MS)
  }, [
    selectedOption,
    selectedRating,
    isAnimating,
    questions,
    currentQuestion,
    responses,
    onComplete,
    advanceQuestion,
    schedule
  ])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && selectedOption && selectedRating && !isAnimating) {
        handleNext()
      } else if (event.key === 'Escape' && !isAnimating) {
        setSelectedOption(null)
        setSelectedRating(null)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedOption, selectedRating, handleNext, isAnimating])

  const handlePrevious = () => {
    if (currentQuestion <= 0 || isAnimating) return

    setAnimPhase('exit')
    schedule(() => {
      scrollToTop()
      const prevQuestion = currentQuestion - 1
      setResponses(responses.slice(0, -1))
      setCurrentQuestion(prevQuestion)
      setSelectedOption(null)
      setSelectedRating(null)
      setAnimPhase('idle')
      onProgressUpdate?.({ current: prevQuestion, total: questions.length })
    }, ASSESSMENT_EXIT_MS)
  }

  const handleExitHome = () => {
    if (
      responses.length > 0 &&
      !window.confirm('Leave assessment? Your progress will not be saved.')
    ) {
      return
    }
    onBack()
  }

  const progress =
    questions.length > 0 ? Math.round((responses.length / questions.length) * 100) : 0

  const getAssetPath = (questionId, option) => {
    const assetNumber = option === 'A' ? 1 : 2
    return `/assets/${questionId}.${assetNumber}.png`
  }

  if (isLoading || questions.length === 0) {
    return (
      <AssessmentShell onExitHome={handleExitHome}>
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <div
              className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-landing-accent border-t-transparent"
              aria-hidden="true"
            />
            <p className="text-sm text-landing-muted">Loading questions…</p>
          </div>
        </div>
      </AssessmentShell>
    )
  }

  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion >= questions.length - 1
  const gridMotionClass = animPhase === 'exit' ? 'is-exiting' : ''

  return (
    <AssessmentShell onExitHome={handleExitHome} scrollRef={scrollRef}>
      <div className="mx-auto flex min-h-[108dvh] w-full max-w-3xl flex-col px-3 pb-8 pt-2 sm:px-4">
        {/* Progress */}
        <div className="mb-1.5 shrink-0 sm:mb-2">
          <div className="mb-1 flex items-center justify-between text-xs text-landing-muted sm:text-sm">
            <span className="font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="font-semibold text-landing-accent">{progress}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-landing-ink/10">
            <div
              className="h-full rounded-full bg-landing-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Assessment progress"
            />
          </div>
        </div>

        {/* Prompt — reveals on scroll */}
        <div key={`prompt-${questionId}`} className="assessment-reveal mb-1.5 shrink-0 text-center sm:mb-2">
          <h2
            id="question-prompt"
            className="font-[family-name:var(--font-display)] text-sm font-bold leading-snug text-landing-ink sm:text-base md:text-lg"
          >
            {currentQ.text}
          </h2>
          <p className="mt-0.5 hidden text-xs text-landing-muted sm:block">
            Pick one activity and rate how much you&apos;d enjoy it.
          </p>
        </div>

        {/* Options — reveals on scroll */}
        <div className="assessment-reveal assessment-reveal-delay-1 flex min-h-[50vh] flex-1 flex-col items-center justify-center sm:min-h-[46vh]">
          <div className="assessment-choices-panel">
            <div
              key={`choices-${questionId}`}
              className={`assessment-choices-grid ${gridMotionClass} ${isAnimating ? 'is-busy' : ''}`}
              aria-busy={isAnimating}
            >
              <AssessmentChoiceCard
                optionKey="A"
                title={currentQ.optionA.text}
                imageSrc={questionId <= 14 ? getAssetPath(questionId, 'A') : null}
                isSelected={selectedOption === 'A'}
                isDimmed={Boolean(selectedOption && selectedOption !== 'A')}
                selectedRating={selectedOption === 'A' ? selectedRating : null}
                onRate={(rating) => handleOptionRatingSelect('A', rating)}
                disabled={isAnimating}
              />

              <div className="questionnaire-or-wrap flex items-center justify-center self-center">
                <div className="questionnaire-or-divider" aria-hidden="true">
                  OR
                </div>
              </div>

              <AssessmentChoiceCard
                optionKey="B"
                title={currentQ.optionB.text}
                imageSrc={questionId <= 14 ? getAssetPath(questionId, 'B') : null}
                isSelected={selectedOption === 'B'}
                isDimmed={Boolean(selectedOption && selectedOption !== 'B')}
                selectedRating={selectedOption === 'B' ? selectedRating : null}
                onRate={(rating) => handleOptionRatingSelect('B', rating)}
                disabled={isAnimating}
              />
            </div>
          </div>
        </div>

        {/* Footer nav — reveals on scroll */}
        <div className="assessment-reveal assessment-reveal-delay-2 mt-1 flex shrink-0 items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            {currentQuestion > 0 && (
              <ClickSpark {...SPARK_ACCENT} className="inline-flex">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={isAnimating}
                  className={`${assessmentGhostBtn} disabled:opacity-40`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              </ClickSpark>
            )}
          </div>

          <ClickSpark {...SPARK_PURPLE} className="ml-auto inline-flex">
            <button
              type="button"
              onClick={handleNext}
              disabled={isAnimating || !selectedOption || !selectedRating}
              className={`${assessmentPrimaryBtn} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {isLastQuestion ? 'Complete' : 'Next'}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </ClickSpark>
        </div>
      </div>
    </AssessmentShell>
  )
}

export default Questionnaire
