/**
 * Client-side assessment progress + results restore (sessionStorage, tab-scoped).
 */

const PROGRESS_KEY = 'kursoko_assessment_progress'
const RESULTS_KEY = 'kursoko_results_snapshot'
const MAX_AGE_MS = 3600000 // 1 hour — matches sessionManager

function readJson(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isFresh(record) {
  if (!record?.updatedAt && !record?.completedAt) return false
  const ts = record.updatedAt ?? record.completedAt
  return Date.now() - ts < MAX_AGE_MS
}

export function saveAssessmentProgress({ currentQuestion, responses }) {
  try {
    sessionStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        currentQuestion,
        responses,
        updatedAt: Date.now(),
      })
    )
  } catch (error) {
    console.error('Failed to save assessment progress:', error)
  }
}

export function loadAssessmentProgress() {
  const data = readJson(PROGRESS_KEY)
  if (!data || !isFresh(data)) {
    clearAssessmentProgress()
    return null
  }
  if (!Array.isArray(data.responses) || typeof data.currentQuestion !== 'number') {
    clearAssessmentProgress()
    return null
  }
  return data
}

export function clearAssessmentProgress() {
  try {
    sessionStorage.removeItem(PROGRESS_KEY)
  } catch (error) {
    console.error('Failed to clear assessment progress:', error)
  }
}

export function saveResultsSnapshot(responses) {
  try {
    sessionStorage.setItem(
      RESULTS_KEY,
      JSON.stringify({
        responses,
        completedAt: Date.now(),
      })
    )
    clearAssessmentProgress()
  } catch (error) {
    console.error('Failed to save results snapshot:', error)
  }
}

export function loadResultsSnapshot() {
  const data = readJson(RESULTS_KEY)
  if (!data || !isFresh(data)) {
    clearResultsSnapshot()
    return null
  }
  if (!Array.isArray(data.responses) || data.responses.length === 0) {
    clearResultsSnapshot()
    return null
  }
  return data
}

export function clearResultsSnapshot() {
  try {
    sessionStorage.removeItem(RESULTS_KEY)
  } catch (error) {
    console.error('Failed to clear results snapshot:', error)
  }
}

export function clearAllAssessmentData() {
  clearAssessmentProgress()
  clearResultsSnapshot()
}
