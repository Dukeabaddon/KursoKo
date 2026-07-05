import { test, expect } from '@playwright/test'
import { LANDING_HEADING } from './helpers.js'

test.describe('Landing page', () => {
  test('shows hero and start CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: LANDING_HEADING })).toBeVisible()
    await expect(page.getByRole('button', { name: /Start Assessment/i }).first()).toBeVisible()
  })

  test('starts questionnaire from hero', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Start Assessment/i }).first().click()
    await expect(page.getByText(/Question 1 of/i)).toBeVisible({ timeout: 15000 })
  })
})
