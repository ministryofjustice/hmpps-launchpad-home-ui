import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadPortalLocators from '../../../pages/Launchpad_Portal/launchpadPortalLocators'

dotenv.config()

test.describe('Launchpad Web App', () => {
  test.beforeEach(async ({ page }) => {
    // Add retry logic for navigation to handle application instability
    let retries = 3
    while (retries > 0) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 })
        break
      } catch (error) {
        retries -= 1
        if (retries === 0) throw error
        // eslint-disable-next-line no-console
        console.log(`Navigation failed, retrying... (${retries} attempts left)`)
        // eslint-disable-next-line no-await-in-loop
        await page.waitForTimeout(2000) // Wait 2 seconds before retry
      }
    }
  })

  test('Assert that the user can see the calendar module', async ({ page }) => {
    const timetableLink = page.locator(launchpadPortalLocators.timetableLink)

    await expect(timetableLink).toBeVisible()
    await expect(timetableLink).toHaveText('View my timetable')
  })

  test('Assert that the user can see their profile details module', async ({ page }) => {
    const profileTile = page.locator(launchpadPortalLocators.profileTile)
    await profileTile.waitFor({ state: 'visible', timeout: 5000 })

    const profileLink = profileTile.locator(launchpadPortalLocators.profileLink)
    await profileLink.waitFor({ state: 'visible', timeout: 5000 })

    const profileHeading = profileLink.locator(launchpadPortalLocators.profileHeading)
    await profileHeading.waitFor({ state: 'visible', timeout: 5000 })

    await expect(profileTile).toBeVisible()
    await expect(profileLink).toBeVisible()
    await expect(profileHeading).toHaveText('Profile')
    await expect(profileLink.locator(launchpadPortalLocators.profileDescription)).toHaveText(
      'Check money, visits, incentives (IEP), adjudications and timetable.',
    )
  })
})
