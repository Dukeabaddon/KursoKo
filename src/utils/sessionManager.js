/**
 * Session Management for KursoKo Career Assessment
 * Handles session creation, validation, and security
 */

const SESSION_STORAGE_KEY = 'kursoko_assessment_session';
const LAST_SUBMIT_KEY = 'kursoko_last_submit';

/**
 * Generates a unique session ID
 * 
 * @returns {string} UUID session ID
 */
export const createSessionId = () => {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: generate random UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Starts a new assessment session
 * 
 * @returns {string} New session ID
 */
export const startSession = () => {
  const sessionId = createSessionId();
  const sessionData = {
    id: sessionId,
    startTime: Date.now(),
    isActive: true
  };
  
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    return sessionId;
  } catch (error) {
    console.error('Failed to create session:', error);
    return sessionId; // Return ID even if storage fails
  }
};

/**
 * Gets current active session
 * 
 * @returns {Object|null} Session data or null
 */
export const getSession = () => {
  try {
    const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;
    
    const session = JSON.parse(data);
    
    // Check if session is still valid (not expired)
    const now = Date.now();
    const sessionAge = now - session.startTime;
    const maxAge = 3600000; // 1 hour
    
    if (sessionAge > maxAge) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
};

/**
 * Validates if current session is active
 * 
 * @returns {boolean} True if session is valid
 */
export const isSessionValid = () => {
  const session = getSession();
  return session !== null && session.isActive === true;
};

/**
 * Clears current session
 */
export const clearSession = () => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(LAST_SUBMIT_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};

/**
 * Rate limiting check
 * Prevents rapid submissions
 * 
 * @param {number} minInterval - Minimum milliseconds between submissions
 * @returns {Object} { allowed: boolean, waitTime: number }
 */
export const checkRateLimit = (minInterval = 5000) => {
  try {
    const lastSubmit = sessionStorage.getItem(LAST_SUBMIT_KEY);
    
    if (!lastSubmit) {
      return { allowed: true, waitTime: 0 };
    }
    
    const lastSubmitTime = parseInt(lastSubmit, 10);
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    
    if (timeSinceLastSubmit < minInterval) {
      const waitTime = minInterval - timeSinceLastSubmit;
      return { allowed: false, waitTime };
    }
    
    return { allowed: true, waitTime: 0 };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true, waitTime: 0 }; // Allow on error
  }
};

/**
 * Records submission timestamp
 */
export const recordSubmission = () => {
  try {
    sessionStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to record submission:', error);
  }
};

/**
 * Gets the last submission timestamp
 * 
 * @returns {number|null} Timestamp or null
 */
export const getLastSubmitTime = () => {
  try {
    const lastSubmit = sessionStorage.getItem(LAST_SUBMIT_KEY);
    if (!lastSubmit) return null;
    
    return parseInt(lastSubmit, 10);
  } catch (error) {
    console.error('Failed to get last submit time:', error);
    return null;
  }
};

/**
 * Gets session duration in milliseconds
 * 
 * @returns {number} Duration or 0
 */
export const getSessionDuration = () => {
  const session = getSession();
  if (!session) return 0;
  
  return Date.now() - session.startTime;
};
