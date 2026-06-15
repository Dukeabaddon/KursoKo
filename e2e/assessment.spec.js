import { test, expect } from '@playwright/test'

test.describe('Assessment page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Start Assessment/i }).first().click()
    await expect(page.getByText(/Question 1 of/i)).toBeVisible({ timeout: 15000 })
  })

  test('starts at 0% progress', async ({ page }) => {
    await expect(page.getByText('0% complete')).toBeVisible()
  })

  test('shows home button in header', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Home', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'KursoKo Home' })).toBeVisible()
  })

  test('returns to landing from home button', async ({ page }) => {
    await page.getByRole('button', { name: /^Home$/i }).click()
    await expect(page.getByRole('heading', { name: /Find the perfect path for your future/i })).toBeVisible()
  })
})
