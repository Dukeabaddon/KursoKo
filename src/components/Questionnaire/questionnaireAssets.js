/** Lazy map of generated questionnaire choice WebPs in src/assets/questionnaire/ */

const loaders = import.meta.glob('../../assets/questionnaire/*.webp', {
  import: 'default',
})

const imageCache = new Map()

function assetKey(questionId, option) {
  const slot = option === 'A' ? '1' : '2'
  return `${String(questionId).padStart(2, '0')}.${slot}`
}

function assetPath(questionId, option) {
  const slot = option === 'A' ? '1' : '2'
  return `../../assets/questionnaire/${String(questionId).padStart(2, '0')}.${slot}.webp`
}

/**
 * @param {number} questionId 1–30
 * @param {'A'|'B'} option
 * @returns {Promise<string|null>}
 */
export function loadQuestionnaireImage(questionId, option) {
  const key = assetKey(questionId, option)
  if (imageCache.has(key)) {
    return Promise.resolve(imageCache.get(key))
  }

  const loader = loaders[assetPath(questionId, option)]
  if (!loader) {
    imageCache.set(key, null)
    return Promise.resolve(null)
  }

  return loader().then((url) => {
    imageCache.set(key, url)
    return url
  })
}

/**
 * Cached URL only — null until loadQuestionnaireImage resolves.
 * @param {number} questionId 1–30
 * @param {'A'|'B'} option
 * @returns {string|null}
 */
export function getQuestionnaireImage(questionId, option) {
  return imageCache.get(assetKey(questionId, option)) ?? null
}

/** Prefetch both choice images for a question (e.g. next question while answering). */
export function prefetchQuestionImages(questionId) {
  return Promise.all([
    loadQuestionnaireImage(questionId, 'A'),
    loadQuestionnaireImage(questionId, 'B'),
  ])
}
