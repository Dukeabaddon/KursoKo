import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotDir = path.join(__dirname, 'screenshots')

async function answerAllQuestions(page) {
  for (let i = 0; i < 30; i += 1) {
    await expect(page.getByText(new RegExp(`Question ${i + 1} of`, 'i'))).toBeVisible({
      timeout: 15000,
    })
    await page.locator('.questionnaire-card').first().locator('.questionnaire-rating-option').last().click()
    const next = page.getByRole('button', { name: /Next|Complete/i })
    await expect(next).toBeVisible({ timeout: 10000 })
    await next.click({ timeout: 30000 })
  }
}

test.describe('Assessment flow', () => {
  test('completes 30 questions and shows archetype results', async ({ page }) => {
    test.setTimeout(180000)
    await page.goto('/')
    await page.getByRole('button', { name: /Start Assessment/i }).first().click()
    await answerAllQuestions(page)
    await expect(page.getByText(/Your archetype/i)).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('button', { name: /Share text/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Top career matches/i })).toBeVisible()
    await expect(page.locator('details summary span.tabular-nums').first()).toBeVisible()
  })
})

test.describe('Report page sections', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000)
    await page.goto('/')
    await page.getByRole('button', { name: /Start Assessment/i }).first().click()
    await answerAllQuestions(page)
    await expect(page.getByText(/Your archetype/i)).toBeVisible({ timeout: 20000 })
  })

  test('shows scholarships section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Scholarships for you/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Official application link/i }).first()).toBeVisible()
  })

  test('shows strengths and learning style', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Strengths' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Learning style' })).toBeVisible()
  })

  test('share buttons are clickable', async ({ page }) => {
    await page.getByRole('button', { name: /Share text/i }).click()
    await expect(page.getByRole('status')).toBeVisible({ timeout: 5000 })
  })
})
