import { test, expect } from '@playwright/test'

test.describe('SEO meta tags', () => {
  test('homepage has description, canonical, and JSON-LD', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /RIASEC.*Philippines/i,
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /^https:\/\/kursoko\.ph\/?$/,
    )
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1)

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
    const parsed = JSON.parse(jsonLd)
    const types = parsed['@graph'].map((node) => node['@type'])
    expect(types).toContain('FAQPage')
  })

  test('llms.txt is served for AI agents', async ({ request }) => {
    const response = await request.get('/llms.txt')
    expect(response.ok()).toBeTruthy()
    const body = await response.text()
    expect(body).toMatch(/KursoKo/)
    expect(body).toMatch(/RIASEC/)
  })

  test('robots.txt allows GPTBot', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text()
    expect(body).toMatch(/GPTBot/)
    expect(body).toMatch(/Sitemap:/)
  })
})
