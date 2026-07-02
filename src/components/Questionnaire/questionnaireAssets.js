/** Lazy map of generated questionnaire choice PNGs in src/assets/questionnaire/ */

const modules = import.meta.glob('../../assets/questionnaire/*.png', {
  eager: true,
  import: 'default',
})

/**
 * @param {number} questionId 1–30
 * @param {'A'|'B'} option
 * @returns {string|null} resolved asset URL or null if PNG not added yet
 */
export function getQuestionnaireImage(questionId, option) {
  const slot = option === 'A' ? '1' : '2'
  const file = `../../assets/questionnaire/${String(questionId).padStart(2, '0')}.${slot}.png`
  return modules[file] ?? null
}
