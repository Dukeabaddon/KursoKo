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

  test('shows floating footer with start CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Find your path/i })).toBeVisible()
    await page.getByRole('contentinfo').getByRole('button', { name: /Start Assessment/i }).click()
    await expect(page.getByText(/Question 1 of/i)).toBeVisible({ timeout: 15000 })
  })

  test('nav Types link scrolls to section centered', async ({ page }, testInfo) => {
    await page.goto('/')
    if (testInfo.project.name === 'mobile') {
      await page.getByRole('button', { name: /Open menu/i }).click()
      await page.locator('.landing-nav-mobile-menu').getByRole('link', { name: 'Types', exact: true }).click()
      await expect(page.locator('.landing-nav-mobile-menu')).toHaveCount(0, { timeout: 3000 })
    } else {
      await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Types', exact: true }).click()
    }

    await expect(page.locator('#riasec-heading')).toBeVisible({ timeout: 10000 })
    await expect.poll(
      async () => {
        const box = await page.locator('#riasec-heading').boundingBox()
        const viewport = page.viewportSize()
        if (!box || !viewport) return -1
        const minY = viewport.height * 0.28
        const maxY = viewport.height * 0.58
        if (box.y < minY || box.y > maxY) return box.y
        return 0
      },
      { timeout: 10000 },
    ).toBe(0)
  })
})
