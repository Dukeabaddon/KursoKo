/**
 * Image utility functions for questionnaire assets
 * Simplified version since white background removal is no longer needed
 * due to white container backgrounds
 */

/**
 * Simple image loading utility (for future use if needed)
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>} - Promise that resolves when image loads
 */
export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Check if image is loaded
 * @param {HTMLImageElement} img - Image element to check
 * @returns {boolean} - True if image is loaded
 */
export const isImageLoaded = (img) => {
  return img && img.complete && img.naturalHeight !== 0
}

// Note: White background processing functions removed
// since illustration containers now have white backgrounds
