/** Shared Playwright selectors and helpers for KursoKo e2e. */

export const LANDING_HEADING = /There's more than one path for you/i

export const RESULTS_HEADING = /Profession matches for you/i

/** Accept leave-assessment confirm when quiz has saved answers. */
export function acceptLeaveConfirm(page) {
  page.on('dialog', (dialog) => dialog.accept())
}
