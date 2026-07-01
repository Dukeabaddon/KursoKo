import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotDir = path.join(__dirname, 'screenshots')

async function answerAllQuestions(page) {
  for (let i = 0; i < 30; i += 1) {
    await page.locator('.questionnaire-card').first().locator('.questionnaire-rating-option').last().click()
    await page.getByRole('button', { name: /Next|Complete/i }).click()
  }
}

test.describe('UI screenshots', () => {
  test.beforeAll(() => {
    fs.mkdirSync(screenshotDir, { recursive: true })
  })

  test('landing page screenshot', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Find Your Perfect Career Path/i })).toBeVisible()
    await page.screenshot({
      path: path.join(screenshotDir, '01-landing.png'),
      fullPage: true,
    })
  })

  test('questionnaire screenshot', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Start Assessment/i }).first().click()
    await expect(page.getByText(/Question 1 of/i)).toBeVisible({ timeout: 15000 })
    await page.screenshot({
      path: path.join(screenshotDir, '02-questionnaire.png'),
      fullPage: true,
    })
  })

  test('results page screenshot', async ({ page }) => {
    test.setTimeout(120000)
    await page.goto('/')
    await page.getByRole('button', { name: /Start Assessment/i }).first().click()
    await answerAllQuestions(page)
    await expect(page.getByRole('heading', { name: /Scholarships for you/i })).toBeVisible({
      timeout: 20000,
    })
    await page.screenshot({
      path: path.join(screenshotDir, '03-results-full.png'),
      fullPage: true,
    })
    await page.locator('.results-editorial').screenshot({
      path: path.join(screenshotDir, '04-results-viewport.png'),
    })
  })
})
