import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadExternalLinksLocators from '../../../pages/Launchpad_Portal/launchpadExternalLinksLocators'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad External Web Links - Content Hub', () => {
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
})
