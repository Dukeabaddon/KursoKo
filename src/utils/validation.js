/**
 * Validation Configuration for KursoKo Career Assessment
 * Defines security rules and data integrity checks
 */

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
 * Validates questionnaire responses structure and integrity
 * 
 * @param {Array} responses - Array of user responses
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateResponses = (responses) => {
  const errors = [];

  // Check if responses exist
  if (!responses || !Array.isArray(responses)) {
    errors.push('Responses must be an array');
    return { isValid: false, errors };
  }

  // Check response count
  if (responses.length !== VALIDATION_CONFIG.TOTAL_QUESTIONS) {
    errors.push(
      `Expected ${VALIDATION_CONFIG.TOTAL_QUESTIONS} responses, got ${responses.length}`
    );
  }

  // Validate each response
  const questionIds = new Set();
  
  responses.forEach((response, index) => {
    // Check response structure
    if (!response || typeof response !== 'object') {
      errors.push(`Response ${index + 1} is invalid`);
      return;
    }

    // Check required fields
    if (!response.hasOwnProperty('questionId')) {
      errors.push(`Response ${index + 1} missing questionId`);
    }

    if (!response.hasOwnProperty('score')) {
      errors.push(`Response ${index + 1} missing score`);
    }

    // Validate question ID
    if (
      typeof response.questionId !== 'number' ||
      response.questionId < 1 ||
      response.questionId > VALIDATION_CONFIG.TOTAL_QUESTIONS
    ) {
      errors.push(`Response ${index + 1} has invalid questionId: ${response.questionId}`);
    }

    // Check for duplicate question IDs
    if (questionIds.has(response.questionId)) {
      errors.push(`Duplicate questionId detected: ${response.questionId}`);
    }
    questionIds.add(response.questionId);

    // Validate score range
    const [minScore, maxScore] = VALIDATION_CONFIG.VALID_SCORE_RANGE;
    if (
      typeof response.score !== 'number' ||
      response.score < minScore ||
      response.score > maxScore
    ) {
      errors.push(
        `Response ${index + 1} has invalid score: ${response.score} (must be ${minScore}-${maxScore})`
      );
    }

    // Validate timestamp if present
    if (response.timestamp) {
      if (typeof response.timestamp !== 'number' || response.timestamp <= 0) {
        errors.push(`Response ${index + 1} has invalid timestamp`);
      }
    }
  });

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
 * Complete validation pipeline
 * 
 * @param {Array} responses - User responses
 * @returns {Object} { isValid: boolean, sanitizedResponses: Array, errors: string[] }
 */
export const validateAndSanitize = (responses) => {
  const allErrors = [];

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

  // Step 3: Sanitize data
  const sanitized = sanitizeResponses(responses);

  return {
    isValid: true,
    sanitizedResponses: sanitized,
    errors: allErrors
  };
};
