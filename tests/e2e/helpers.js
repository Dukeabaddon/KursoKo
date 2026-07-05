/** Shared Playwright selectors and helpers for KursoKo e2e. */

export const LANDING_HEADING = /Free RIASEC Career Test for Filipino Students/i

export const RESULTS_HEADING = /Profession matches for you/i

/** Accept leave-assessment confirm when quiz has saved answers. */
export function acceptLeaveConfirm(page) {
  page.on('dialog', (dialog) => dialog.accept())
}
