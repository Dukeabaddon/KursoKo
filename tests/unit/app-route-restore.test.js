import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  APP_PAGES,
  clearAllAssessmentData,
  resolveInitialAppState,
  saveAppRoute,
  saveAssessmentProgress,
  saveResultsSnapshot,
} from '../../src/utils/assessmentPersistence.js'

function createSessionStorage() {
  const store = new Map()
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  }
}

describe('resolveInitialAppState', () => {
  beforeEach(() => {
    globalThis.sessionStorage = createSessionStorage()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-05T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns home when route is home even if progress exists', () => {
    saveAssessmentProgress({ currentQuestion: 16, responses: [{ q: 1 }] })
    saveAppRoute(APP_PAGES.HOME)

    expect(resolveInitialAppState()).toEqual({
      page: APP_PAGES.HOME,
      responses: [],
      questionnaireRestore: null,
    })
  })

  it('restores questionnaire when route is questionnaire and progress exists', () => {
    saveAssessmentProgress({ currentQuestion: 16, responses: [{ q: 1 }] })

    const state = resolveInitialAppState()
    expect(state.page).toBe(APP_PAGES.QUESTIONNAIRE)
    expect(state.questionnaireRestore?.currentQuestion).toBe(16)
  })

  it('restores results when snapshot exists', () => {
    saveResultsSnapshot([{ questionId: 1, value: 3 }])

    expect(resolveInitialAppState()).toEqual({
      page: APP_PAGES.RESULTS,
      responses: [{ questionId: 1, value: 3 }],
      questionnaireRestore: null,
    })
  })

  it('returns home when no saved state', () => {
    expect(resolveInitialAppState()).toEqual({
      page: APP_PAGES.HOME,
      responses: [],
      questionnaireRestore: null,
    })
  })

  it('clears everything with clearAllAssessmentData', () => {
    saveAssessmentProgress({ currentQuestion: 2, responses: [] })
    saveAppRoute(APP_PAGES.QUESTIONNAIRE)
    clearAllAssessmentData()

    expect(resolveInitialAppState().page).toBe(APP_PAGES.HOME)
  })
})
