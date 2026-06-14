/**
 * Validation Configuration for KursoKo Career Assessment
 * Defines security rules and data integrity checks
 */

import { getSessionDuration, getLastSubmitTime } from './sessionManager'

export const VALIDATION_CONFIG = {
  TOTAL_QUESTIONS: 30,
  VALID_RATING_RANGE: [1, 3],
  VALID_RIASEC_CODES: ['R', 'I', 'A', 'S', 'E', 'C'],
  MAX_SESSION_DURATION: 3600000,
  MIN_SUBMIT_INTERVAL: 5000,
  MIN_TIME_PER_QUESTION: 2000,
  MAX_TIME_PER_QUESTION: 300000,
}

const checkResponsesArray = (responses, errors) => {
  if (!responses || !Array.isArray(responses)) {
    errors.push('Responses must be an array')
    return false
  }
  return true
}

const checkResponseCount = (responses, errors) => {
  if (responses.length !== VALIDATION_CONFIG.TOTAL_QUESTIONS) {
    errors.push(
      `Expected ${VALIDATION_CONFIG.TOTAL_QUESTIONS} responses, got ${responses.length}`,
    )
  }
}

const validateSingleResponse = (response, index, errors, seenIds) => {
  const num = index + 1
  if (!response || typeof response !== 'object') {
    errors.push(`Response ${num} is invalid`)
    return
  }
  if (!('questionId' in response)) {
    errors.push(`Response ${num} missing questionId`)
  }
  if (!('rating' in response)) {
    errors.push(`Response ${num} missing rating`)
  }
  if (!('selectedCode' in response)) {
    errors.push(`Response ${num} missing selectedCode`)
  }

  const qId = response.questionId
  if (typeof qId !== 'number' || qId < 1 || qId > VALIDATION_CONFIG.TOTAL_QUESTIONS) {
    errors.push(`Response ${num} has invalid questionId: ${qId}`)
  }
  if (seenIds.has(qId)) {
    errors.push(`Duplicate questionId detected: ${qId}`)
  }
  seenIds.add(qId)

  const [minRating, maxRating] = VALIDATION_CONFIG.VALID_RATING_RANGE
  const rating = response.rating
  if (typeof rating !== 'number' || rating < minRating || rating > maxRating) {
    errors.push(
      `Response ${num} has invalid rating: ${rating} (must be ${minRating}-${maxRating})`,
    )
  }

  const code = response.selectedCode
  if (!VALIDATION_CONFIG.VALID_RIASEC_CODES.includes(code)) {
    errors.push(`Response ${num} has invalid selectedCode: ${code}`)
  }

  if ('timestamp' in response) {
    const ts = response.timestamp
    if (typeof ts !== 'number' || ts <= 0) {
      errors.push(`Response ${num} has invalid timestamp`)
    }
  }
}

export const validateResponses = (responses) => {
  const errors = []

  if (!checkResponsesArray(responses, errors)) {
    return { isValid: false, errors }
  }
  checkResponseCount(responses, errors)

  const seenIds = new Set()
  responses.forEach((resp, idx) => validateSingleResponse(resp, idx, errors, seenIds))

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateResponseTiming = (responses) => {
  const errors = []

  if (!responses || responses.length === 0) {
    return { isValid: true, errors }
  }

  const hasTimestamps = responses.every((r) => r.timestamp)
  if (!hasTimestamps) {
    return { isValid: true, errors }
  }

  const sorted = [...responses].sort((a, b) => a.timestamp - b.timestamp)
  const totalTime = sorted[sorted.length - 1].timestamp - sorted[0].timestamp
  const minTotalTime = VALIDATION_CONFIG.MIN_TIME_PER_QUESTION * responses.length

  if (totalTime < minTotalTime) {
    errors.push(
      `Responses completed too quickly (${Math.round(totalTime / 1000)}s). Possible bot detected.`,
    )
  }

  for (let i = 1; i < sorted.length; i += 1) {
    const timeDiff = sorted[i].timestamp - sorted[i - 1].timestamp

    if (timeDiff < VALIDATION_CONFIG.MIN_TIME_PER_QUESTION) {
      errors.push(`Question ${sorted[i].questionId} answered too quickly (${timeDiff}ms)`)
    }

    if (timeDiff > VALIDATION_CONFIG.MAX_TIME_PER_QUESTION) {
      errors.push(
        `Question ${sorted[i].questionId} took too long (${Math.round(timeDiff / 1000)}s). Session may have expired.`,
      )
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

const stripText = (value, max = 500) =>
  String(value ?? '')
    .replace(/[<>]/g, '')
    .slice(0, max)

export const sanitizeResponses = (responses) => {
  if (!Array.isArray(responses)) {
    return []
  }

  return responses.map((response) => ({
    questionId: parseInt(response.questionId, 10),
    selectedOption: response.selectedOption === 'B' ? 'B' : 'A',
    selectedCode: VALIDATION_CONFIG.VALID_RIASEC_CODES.includes(response.selectedCode)
      ? response.selectedCode
      : 'R',
    rating: parseInt(response.rating, 10),
    questionText: stripText(response.questionText),
    selectedText: stripText(response.selectedText),
    timestamp: response.timestamp ? parseInt(response.timestamp, 10) : Date.now(),
  }))
}

const preValidateSession = () => {
  const errors = []
  const sessionAge = getSessionDuration()
  if (sessionAge > VALIDATION_CONFIG.MAX_SESSION_DURATION) {
    errors.push('Session expired. Please restart the assessment.')
  }
  const last = getLastSubmitTime()
  if (last && Date.now() - last < VALIDATION_CONFIG.MIN_SUBMIT_INTERVAL) {
    errors.push('Please wait a few seconds before resubmitting the questionnaire.')
  }
  return { isValid: errors.length === 0, errors }
}

export const validateAndSanitize = (responses) => {
  const allErrors = []

  const sessionCheck = preValidateSession()
  if (!sessionCheck.isValid) {
    return {
      isValid: false,
      sanitizedResponses: [],
      errors: sessionCheck.errors,
    }
  }

  const structureValidation = validateResponses(responses)
  if (!structureValidation.isValid) {
    return {
      isValid: false,
      sanitizedResponses: [],
      errors: structureValidation.errors,
    }
  }

  const timingValidation = validateResponseTiming(responses)
  if (!timingValidation.isValid) {
    allErrors.push(...timingValidation.errors)
    console.warn('Timing validation warnings:', timingValidation.errors)
  }

  const sanitized = sanitizeResponses(responses)

  return {
    isValid: true,
    sanitizedResponses: sanitized,
    errors: allErrors,
  }
}
