/**
 * Validation Configuration for KursoKo Career Assessment
 * Defines security rules and data integrity checks
 */

import { getSessionDuration, getLastSubmitTime, recordSubmission } from './sessionManager';

export const VALIDATION_CONFIG = {
  // Questionnaire settings
  TOTAL_QUESTIONS: 60,
  VALID_SCORE_RANGE: [1, 5],
  
  // Session security
  MAX_SESSION_DURATION: 3600000, // 1 hour in milliseconds
  MIN_SUBMIT_INTERVAL: 5000, // 5 seconds between submissions
  
  // Response timing (prevent bots)
  MIN_TIME_PER_QUESTION: 2000, // 2 seconds minimum per question
  MAX_TIME_PER_QUESTION: 300000, // 5 minutes maximum per question
};

/**
 * Helpers extracted to reduce cyclomatic complexity in validateResponses
 */
const checkResponsesArray = (responses, errors) => {
  if (!responses || !Array.isArray(responses)) {
    errors.push('Responses must be an array');
    return false;
  }
  return true;
};

const checkResponseCount = (responses, errors) => {
  if (responses.length !== VALIDATION_CONFIG.TOTAL_QUESTIONS) {
    errors.push(
      `Expected ${VALIDATION_CONFIG.TOTAL_QUESTIONS} responses, got ${responses.length}`
    );
  }
};

const validateSingleResponse = (response, index, errors, seenIds) => {
  const num = index + 1;
  if (!response || typeof response !== 'object') {
    errors.push(`Response ${num} is invalid`);
    return;
  }
  if (!('questionId' in response)) {
    errors.push(`Response ${num} missing questionId`);
  }
  if (!('score' in response)) {
    errors.push(`Response ${num} missing score`);
  }
  const qId = response.questionId;
  if (typeof qId !== 'number' || qId < 1 || qId > VALIDATION_CONFIG.TOTAL_QUESTIONS) {
    errors.push(`Response ${num} has invalid questionId: ${qId}`);
  }
  if (seenIds.has(qId)) {
    errors.push(`Duplicate questionId detected: ${qId}`);
  }
  seenIds.add(qId);
  const [minScore, maxScore] = VALIDATION_CONFIG.VALID_SCORE_RANGE;
  const score = response.score;
  if (typeof score !== 'number' || score < minScore || score > maxScore) {
    errors.push(
      `Response ${num} has invalid score: ${score} (must be ${minScore}-${maxScore})`
    );
  }
  if ('timestamp' in response) {
    const ts = response.timestamp;
    if (typeof ts !== 'number' || ts <= 0) {
      errors.push(`Response ${num} has invalid timestamp`);
    }
  }
}

/**
 * Validates questionnaire responses structure and integrity
 * 
 * @param {Array} responses - Array of user responses
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateResponses = (responses) => {
  const errors = [];

  // Step 1: basic array and count checks
  if (!checkResponsesArray(responses, errors)) {
    return { isValid: false, errors };
  }
  checkResponseCount(responses, errors);

  // Step 2: detailed per-response validation
  const seenIds = new Set();
  responses.forEach((resp, idx) =>
    validateSingleResponse(resp, idx, errors, seenIds)
  );

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates response timing to prevent bot submissions
 * 
 * @param {Array} responses - Array with timestamps
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateResponseTiming = (responses) => {
  const errors = [];

  if (!responses || responses.length === 0) {
    return { isValid: true, errors };
  }

  // Check if timestamps exist
  const hasTimestamps = responses.every(r => r.timestamp);
  if (!hasTimestamps) {
    // Timestamps optional - skip timing validation
    return { isValid: true, errors };
  }

  // Sort by timestamp
  const sorted = [...responses].sort((a, b) => a.timestamp - b.timestamp);

  // Check time between first and last response
  const totalTime = sorted[sorted.length - 1].timestamp - sorted[0].timestamp;
  const minTotalTime = VALIDATION_CONFIG.MIN_TIME_PER_QUESTION * responses.length;

  if (totalTime < minTotalTime) {
    errors.push(
      `Responses completed too quickly (${Math.round(totalTime / 1000)}s). Possible bot detected.`
    );
  }

  // Check individual question timing
  for (let i = 1; i < sorted.length; i++) {
    const timeDiff = sorted[i].timestamp - sorted[i - 1].timestamp;
    
    if (timeDiff < VALIDATION_CONFIG.MIN_TIME_PER_QUESTION) {
      errors.push(
        `Question ${sorted[i].questionId} answered too quickly (${timeDiff}ms)`
      );
    }

    if (timeDiff > VALIDATION_CONFIG.MAX_TIME_PER_QUESTION) {
      errors.push(
        `Question ${sorted[i].questionId} took too long (${Math.round(timeDiff / 1000)}s). Session may have expired.`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes response data to prevent XSS
 * 
 * @param {Array} responses - Raw responses
 * @returns {Array} Sanitized responses
 */
export const sanitizeResponses = (responses) => {
  if (!Array.isArray(responses)) {
    return [];
  }

  return responses.map(response => ({
    questionId: parseInt(response.questionId, 10),
    score: parseInt(response.score, 10),
    timestamp: response.timestamp ? parseInt(response.timestamp, 10) : Date.now(),
  }));
};

/**
 * Pre-validate session duration and submission interval.
 * @param {Array} responses
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const preValidateSession = () => {
  const errors = [];
  const sessionAge = getSessionDuration();
  if (sessionAge > VALIDATION_CONFIG.MAX_SESSION_DURATION) {
    errors.push('Session expired. Please restart the assessment.');
  }
  const last = getLastSubmitTime();
  if (last && Date.now() - last < VALIDATION_CONFIG.MIN_SUBMIT_INTERVAL) {
    errors.push('Please wait a few seconds before resubmitting the questionnaire.');
  }
  return { isValid: errors.length === 0, errors };
};

/**
 * Complete validation pipeline
 * 
 * @param {Array} responses - User responses
 * @returns {Object} { isValid: boolean, sanitizedResponses: Array, errors: string[] }
 */
export const validateAndSanitize = (responses) => {
  const allErrors = [];

  // Step 0: session and rate-limit enforcement
  const sessionCheck = preValidateSession();
  if (!sessionCheck.isValid) {
    return {
      isValid: false,
      sanitizedResponses: [],
      errors: sessionCheck.errors
    };
  }

   // Step 1: Structure validation
   const structureValidation = validateResponses(responses);
   if (!structureValidation.isValid) {
     return {
       isValid: false,
       sanitizedResponses: [],
       errors: structureValidation.errors
     };
   }

   // Step 2: Timing validation (optional but recommended)
   const timingValidation = validateResponseTiming(responses);
   if (!timingValidation.isValid) {
     allErrors.push(...timingValidation.errors);
     // Don't fail - just warn
     console.warn('Timing validation warnings:', timingValidation.errors);
   }

   // Step 3: sanitize data (assign timestamps after validation)
   const sanitized = sanitizeResponses(responses);
  
  // Record this submission for next interval check
  recordSubmission();

   return {
     isValid: true,
     sanitizedResponses: sanitized,
     errors: allErrors
   };
 };
