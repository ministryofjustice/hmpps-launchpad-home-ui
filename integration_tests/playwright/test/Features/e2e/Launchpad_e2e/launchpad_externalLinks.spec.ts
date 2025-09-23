import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad External Web Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
  })

  test('Assert that the user can see the content hub module', async ({ page }) => {
    const contentHubLink = page.locator('a[href="/external/content-hub"][rel="noreferrer noopener"][target="_blank"]')
    await contentHubLink.waitFor({ state: 'visible', timeout: 5000 })

    const contentHubImg = contentHubLink.locator('img[alt="link tile image"]')
    await contentHubImg.waitFor({ state: 'visible', timeout: 5000 })

    await expect(contentHubLink).toBeVisible()
    await expect(contentHubImg).toBeVisible()
    await expect(contentHubLink.locator('h3.govuk-heading-m')).toHaveText('Content Hub')
    await expect(contentHubLink.locator('p.govuk-body')).toHaveText(
      'Watch, read and listen to local and national content.',
    )
  })

  test('Assert that the user can see the National Prison Radio module', async ({ page }) => {
    const prisonRadioLink = page.locator('a[href="/external/prison-radio"][rel="noreferrer noopener"][target="_blank"]')
    await expect(prisonRadioLink).toBeVisible()
    await expect(prisonRadioLink.locator('img[alt="link tile image"]')).toBeVisible()
    await expect(prisonRadioLink.locator('h3.govuk-heading-m')).toHaveText('National Prison Radio')
    await expect(prisonRadioLink.locator('p.govuk-body')).toHaveText(
      'Listen to 24/7 music, talk, requests and playback',
    )
  })

  test('Assert that the user can see the inside time module', async ({ page }) => {
    const insideTimeLink = page.locator('a[href="/external/inside-time"][rel="noreferrer noopener"][target="_blank"]')
    await expect(insideTimeLink).toBeVisible()
    await expect(insideTimeLink.locator('img[alt="link tile image"]')).toBeVisible()
    await expect(insideTimeLink.locator('h3.govuk-heading-m')).toHaveText('Inside Time')
    await expect(insideTimeLink.locator('p.govuk-body')).toHaveText(
      'Read the national newspaper for prisoners and detainees.',
    )
  })
})
