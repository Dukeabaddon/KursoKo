/**
 * Client-side assessment progress, results, and route restore (sessionStorage, tab-scoped).
 */

import { devError } from './devLogger.js'

const PROGRESS_KEY = 'kursoko_assessment_progress'
const RESULTS_KEY = 'kursoko_results_snapshot'
const ROUTE_KEY = 'kursoko_app_route'
const MAX_AGE_MS = 3600000 // 1 hour — matches sessionManager

export const APP_PAGES = {
  HOME: 'home',
  QUESTIONNAIRE: 'questionnaire',
  RESULTS: 'results',
}

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

export function saveAppRoute(page) {
  try {
    sessionStorage.setItem(ROUTE_KEY, page)
  } catch (error) {
    devError('Failed to save app route:', error)
  }
}

export function loadAppRoute() {
  try {
    return sessionStorage.getItem(ROUTE_KEY)
  } catch {
    return null
  }
}

export function clearAppRoute() {
  try {
    sessionStorage.removeItem(ROUTE_KEY)
  } catch (error) {
    devError('Failed to clear app route:', error)
  }
}

export function saveAssessmentProgress({ currentQuestion, responses }) {
  try {
    sessionStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        currentQuestion,
        responses,
        updatedAt: Date.now(),
      }),
    )
    saveAppRoute(APP_PAGES.QUESTIONNAIRE)
  } catch (error) {
    devError('Failed to save assessment progress:', error)
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
    devError('Failed to clear assessment progress:', error)
  }
}

export function saveResultsSnapshot(responses) {
  try {
    sessionStorage.setItem(
      RESULTS_KEY,
      JSON.stringify({
        responses,
        completedAt: Date.now(),
      }),
    )
    saveAppRoute(APP_PAGES.RESULTS)
    clearAssessmentProgress()
  } catch (error) {
    devError('Failed to save results snapshot:', error)
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
    devError('Failed to clear results snapshot:', error)
  }
}

export function clearAllAssessmentData() {
  clearAssessmentProgress()
  clearResultsSnapshot()
  clearAppRoute()
}

/**
 * Decide which page to show after a full reload.
 * Landing stays landing when user explicitly navigated home; in-progress quiz still restores.
 */
export function resolveInitialAppState() {
  const savedResults = loadResultsSnapshot()
  if (savedResults?.responses?.length) {
    return {
      page: APP_PAGES.RESULTS,
      responses: savedResults.responses,
      questionnaireRestore: null,
    }
  }

  const route = loadAppRoute()
  const savedProgress = loadAssessmentProgress()

  if (route === APP_PAGES.HOME) {
    return {
      page: APP_PAGES.HOME,
      responses: [],
      questionnaireRestore: null,
    }
  }

  if (savedProgress && route !== APP_PAGES.HOME) {
    return {
      page: APP_PAGES.QUESTIONNAIRE,
      responses: [],
      questionnaireRestore: savedProgress,
    }
  }

  return {
    page: APP_PAGES.HOME,
    responses: [],
    questionnaireRestore: null,
  }
}
