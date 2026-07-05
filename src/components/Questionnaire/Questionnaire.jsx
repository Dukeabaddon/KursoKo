import { useState, useEffect, useCallback, useRef } from 'react'
import questionsData from '../../data/questions.json'
import { AssessmentChoiceCard, AssessmentShell, useAssessmentScrollReveal } from '../shared/assessment'
import {
  assessmentGhostBtn,
  assessmentPrimaryBtn,
  ASSESSMENT_EXIT_MS,
  SPARK_ACCENT,
  SPARK_PURPLE
} from '../shared/assessment/assessmentClasses'
import { ClickSpark } from '../shared/ui'
import { saveAssessmentProgress } from '../../utils/assessmentPersistence'
import {
  getQuestionnaireImage,
  loadQuestionnaireImage,
  prefetchQuestionImages,
} from './questionnaireAssets'

function Questionnaire({ onComplete, onBack, onProgressUpdate, initialProgress = null }) {
  const [currentQuestion, setCurrentQuestion] = useState(() => initialProgress?.currentQuestion ?? 0)
  const [responses, setResponses] = useState(() => initialProgress?.responses ?? [])
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animPhase, setAnimPhase] = useState('idle')
  const [choiceImages, setChoiceImages] = useState({ a: null, b: null })
  const timersRef = useRef([])
  const scrollRef = useRef(null)
  const instantRevealRef = useRef(false)

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
      const restored = initialProgress?.currentQuestion ?? 0
      onProgressUpdate?.({ current: restored, total: questionsData.questions.length })
    }
    setIsLoading(false)
  }, [initialProgress?.currentQuestion, onProgressUpdate])

  useEffect(() => () => clearTimers(), [clearTimers])

  useEffect(() => {
    if (isLoading || questions.length === 0) return undefined

    const timeoutId = window.setTimeout(() => {
      saveAssessmentProgress({ currentQuestion, responses })
    }, 200)

    return () => window.clearTimeout(timeoutId)
  }, [currentQuestion, responses, isLoading, questions.length])

  const questionId = questions[currentQuestion]?.id
  useAssessmentScrollReveal(scrollRef, questionId, instantRevealRef)

  useEffect(() => {
    if (!questionId || questions.length === 0) return undefined

    let cancelled = false
    setChoiceImages({
      a: getQuestionnaireImage(questionId, 'A'),
      b: getQuestionnaireImage(questionId, 'B'),
    })

    Promise.all([
      loadQuestionnaireImage(questionId, 'A'),
      loadQuestionnaireImage(questionId, 'B'),
    ]).then(([a, b]) => {
      if (!cancelled) setChoiceImages({ a, b })
    })

    const nextQuestion = questions[currentQuestion + 1]
    if (nextQuestion?.id) {
      prefetchQuestionImages(nextQuestion.id)
    }

    return () => {
      cancelled = true
    }
  }, [questionId, currentQuestion, questions])

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
      instantRevealRef.current = true
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
      instantRevealRef.current = true
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
      !window.confirm('Leave assessment? Your progress stays saved in this browser tab.')
    ) {
      return
    }
    onBack()
  }

  const progress =
    questions.length > 0 ? Math.round((responses.length / questions.length) * 100) : 0

  const getChoiceImage = (option) => (option === 'A' ? choiceImages.a : choiceImages.b)

  const navFooter = (
    <div className="assessment-nav-row">
      {currentQuestion > 0 ? (
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
      ) : (
        <span className="inline-block min-w-[5.5rem]" aria-hidden="true" />
      )}

      <ClickSpark {...SPARK_PURPLE} className="inline-flex">
        <button
          type="button"
          onClick={handleNext}
          disabled={isAnimating || !selectedOption || !selectedRating}
          className={`${assessmentPrimaryBtn} disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {currentQuestion >= questions.length - 1 ? 'Complete' : 'Next'}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </ClickSpark>
    </div>
  )

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
  const gridMotionClass = animPhase === 'exit' ? 'is-exiting' : ''

  return (
    <AssessmentShell onExitHome={handleExitHome} scrollRef={scrollRef} footer={navFooter}>
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col px-3 pb-4 pt-2 sm:px-4">
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

        <div className="assessment-question-body flex min-h-0 flex-1 flex-col justify-center">
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
          <div className="assessment-reveal assessment-reveal-delay-1 flex min-h-0 flex-col items-center justify-center py-2">
            <div className="assessment-choices-panel w-full">
              <div
                key={`choices-${questionId}`}
                className={`assessment-choices-grid ${gridMotionClass} ${isAnimating ? 'is-busy' : ''}`}
                aria-busy={isAnimating}
              >
                <AssessmentChoiceCard
                  optionKey="A"
                  title={currentQ.optionA.text}
                  imageSrc={getChoiceImage('A')}
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
                  imageSrc={getChoiceImage('B')}
                  isSelected={selectedOption === 'B'}
                  isDimmed={Boolean(selectedOption && selectedOption !== 'B')}
                  selectedRating={selectedOption === 'B' ? selectedRating : null}
                  onRate={(rating) => handleOptionRatingSelect('B', rating)}
                  disabled={isAnimating}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssessmentShell>
  )
}

export default Questionnaire
