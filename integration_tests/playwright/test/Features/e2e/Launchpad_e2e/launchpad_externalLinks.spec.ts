import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadExternalLinksLocators from 'pages/launchpad/launchlinks'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad External Web Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
  })

  test('Assert that the user can see the content hub module', async ({ page }) => {
    const contentHubLink = page.locator(launchpadExternalLinksLocators.contentHubLink)
    await contentHubLink.waitFor({ state: 'visible', timeout: 5000 })

    const contentHubImg = contentHubLink.locator(launchpadExternalLinksLocators.contentHubImg)
    await contentHubImg.waitFor({ state: 'visible', timeout: 5000 })

    await expect(contentHubLink).toBeVisible()
    await expect(contentHubImg).toBeVisible()
    await expect(contentHubLink.locator(launchpadExternalLinksLocators.contentHubHeading)).toHaveText('Content Hub')
    await expect(contentHubLink.locator(launchpadExternalLinksLocators.contentHubDescription)).toHaveText(
      'Watch, read and listen to local and national content.',
    )
  })

  test('Assert that the user can see the National Prison Radio module', async ({ page }) => {
    const prisonRadioLink = page.locator(launchpadExternalLinksLocators.prisonRadioLink)
    await expect(prisonRadioLink).toBeVisible()

    await expect(prisonRadioLink.locator(launchpadExternalLinksLocators.prisonRadioImg)).toBeVisible()
    await expect(prisonRadioLink.locator(launchpadExternalLinksLocators.prisonRadioHeading)).toHaveText(
      'National Prison Radio',
    )
    await expect(prisonRadioLink.locator(launchpadExternalLinksLocators.prisonRadioDescription)).toHaveText(
      'Listen to 24/7 music, talk, requests and playback',
    )
  })

  test('Assert that the user can see the inside time module', async ({ page }) => {
    const insideTimeLink = page.locator(launchpadExternalLinksLocators.insideTimeLink)
    await expect(insideTimeLink).toBeVisible()

    await expect(insideTimeLink.locator(launchpadExternalLinksLocators.insideTimeImg)).toBeVisible()
    await expect(insideTimeLink.locator(launchpadExternalLinksLocators.insideTimeHeading)).toHaveText('Inside Time')
    await expect(insideTimeLink.locator(launchpadExternalLinksLocators.insideTimeDescription)).toHaveText(
      'Read the national newspaper for prisoners and detainees.',
    )
  })
})
