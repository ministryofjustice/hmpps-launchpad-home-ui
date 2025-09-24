import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadPortalLocators from 'pages/Launchpad_Portal/launchpadPortalLocators'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
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
