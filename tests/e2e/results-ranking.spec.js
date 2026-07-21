import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const questionsPath = fileURLToPath(new URL('../../src/data/questions.json', import.meta.url))
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8')).questions
const visionaryCodeByPair = {
  RI: 'R',
  AS: 'S',
  SA: 'S',
  EC: 'E',
  EI: 'E',
  IC: 'I',
  RC: 'C',
  RS: 'R',
}

const builderCodeByPair = {
  RI: 'R',
  AS: 'S',
  SA: 'S',
  EC: 'E',
  EI: 'I',
  IC: 'I',
  RC: 'R',
  RS: 'R',
}

function buildResponses(preferredCodeByPair) {
  return questions.map((question) => {
    const pair = `${question.optionA.code}${question.optionB.code}`
    const selectedCode = preferredCodeByPair[pair]
    if (!selectedCode) throw new Error(`Missing Visionary choice for ${pair}`)
    const selectedOption = question.optionA.code === selectedCode ? 'A' : 'B'
    const selected = selectedOption === 'A' ? question.optionA : question.optionB

    return {
      questionId: question.id,
      selectedOption,
      selectedCode,
      rating: 3,
      questionText: question.text,
      selectedText: selected.text,
    }
  })
}

test('Visionary ranking has no uniformed-service option', async ({ page }) => {
  const responses = buildResponses(visionaryCodeByPair)
  await page.addInitScript((snapshot) => {
    sessionStorage.setItem(
      'kursoko_results_snapshot',
      JSON.stringify({ responses: snapshot, completedAt: Date.now() }),
    )
    sessionStorage.setItem('kursoko_app_route', 'results')
  }, responses)

  await page.goto('/')

  await expect(page.getByText('Top pattern: E + R/S tie.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Flight Attendant' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Military Officer (AFP)' })).toHaveCount(0)
  await expect(page.getByText('Specialized service careers')).toHaveCount(0)
  await expect(page.getByRole('checkbox', { name: /military officer paths/i })).toHaveCount(0)

  const courseSection = page
    .getByRole('heading', { name: 'Recommended college path' })
    .locator('xpath=ancestor::section')
  await expect(courseSection).not.toContainText('Military Officer')
})

test('Builder seafarer path shows maritime schools and broad scholarships', async ({ page }) => {
  const responses = buildResponses(builderCodeByPair)
  await page.addInitScript((snapshot) => {
    sessionStorage.setItem(
      'kursoko_results_snapshot',
      JSON.stringify({ responses: snapshot, completedAt: Date.now() }),
    )
    sessionStorage.setItem('kursoko_app_route', 'results')
  }, responses)

  await page.goto('/')

  const seafarerCard = page
    .getByRole('heading', { name: 'Seafarer / Deck Officer' })
    .locator('xpath=ancestor::article')
  await seafarerCard.getByRole('button').first().click()

  await expect(seafarerCard.getByRole('heading', { name: 'Asian Institute of Maritime Studies' })).toBeVisible()
  await expect(seafarerCard.getByText('Philippine State College of Aeronautics')).toHaveCount(0)
  await expect(seafarerCard.getByText('MAAP Cadetship Scholarship')).toBeVisible()
  await expect(seafarerCard.getByText('OWWA Education for Development Scholarship Program (EDSP)')).toBeVisible()
  await expect(seafarerCard.getByText('6 ranked')).toBeVisible()
})
