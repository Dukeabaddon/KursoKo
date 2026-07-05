/** Dev-only logging — stripped from production bundles when unused. */
const IS_DEV = import.meta.env.DEV

export function devLog(...args) {
  if (IS_DEV) console.log(...args)
}

export function devWarn(...args) {
  if (IS_DEV) console.warn(...args)
}

export function devError(...args) {
  if (IS_DEV) console.error(...args)
}

export const DEV_DARK_MODE_NOTICE =
  'From Dev: no dark mode because my assets are all in light mode T_T'

const PAGE_LABELS = {
  home: 'Landing',
  questionnaire: 'Assessment',
  results: 'Results',
}

/** Console note on every app page — always visible (harmless dev easter egg). */
export function logDevPageNotice(page) {
  const label = PAGE_LABELS[page] ?? page
  console.info(DEV_DARK_MODE_NOTICE)
  console.info(`[KursoKo · ${label}]`)
  console.log(
    `%cFrom Dev:%c no dark mode because my assets are all in light mode T_T`,
    'font-weight:bold;color:#6E4FB8',
    'color:inherit',
  )
  console.log(`%c[KursoKo · ${label}]%c`, 'font-weight:bold;color:#6E4FB8', 'color:gray')
}
