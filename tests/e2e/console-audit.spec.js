import { test, expect } from '@playwright/test'

const DEV_DARK_MODE_NOTICE =
  'From Dev: no dark mode because my assets are all in light mode T_T'

test.describe('Console audit', () => {
  test('landing shows dev notice and no noisy logs', async ({ page }) => {
    const messages = []
    page.on('console', (msg) => {
      messages.push({ type: msg.type(), text: msg.text() })
    })

    await page.goto('/')
    await expect(page.getByRole('button', { name: /Start Assessment/i }).first()).toBeVisible()

    const texts = messages.map((m) => m.text)
    expect(texts.some((t) => t.includes(DEV_DARK_MODE_NOTICE))).toBe(true)
    expect(texts.some((t) => t.includes('[KursoKo · Landing]'))).toBe(true)

    const noisy = texts.filter(
      (t) =>
        /session started|Validation errors|Failed to save|Failed to create session|render time/i.test(
          t,
        ),
    )
    expect(noisy).toEqual([])
  })

  test('assessment page logs dev notice on navigation', async ({ page }) => {
    const messages = []
    page.on('console', (msg) => messages.push(msg.text()))

    await page.goto('/')
    await page.getByRole('button', { name: /Start Assessment/i }).first().click()
    await expect(page.getByText(/Question 1 of/i)).toBeVisible({ timeout: 15000 })

    expect(messages.some((t) => t.includes('[KursoKo · Assessment]'))).toBe(true)
  })
})
