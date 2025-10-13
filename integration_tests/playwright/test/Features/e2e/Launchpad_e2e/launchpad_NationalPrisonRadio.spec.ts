import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadExternalLinksLocators from '../../../Framework/pages/LaunchPad_Portal/launchpadExternalLinksLocators'

dotenv.config()

test.describe('Launchpad External Web Links - National Prison Radio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
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
})
