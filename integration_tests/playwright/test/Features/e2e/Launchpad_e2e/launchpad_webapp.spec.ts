import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadPortalLocators from '../../../Framework/pages/LaunchPad_Portal/launchpadPortalLocators'
import acceptDataAccessModal from '../../../Framework/utils/acceptDataAccessModal'

dotenv.config()

test.describe('Launchpad Web App @regression', () => {
  test.beforeEach(async ({ page }) => {
    // Add retry logic for navigation to handle application instability
    const targetUrl = '/'
    const baseURL = process.env.HMPPS_AUTH_URL || 'http://localhost:3000'
    const fullUrl = `${baseURL}${targetUrl}`

    // eslint-disable-next-line no-console
    console.log(`🌐 Navigating to: ${fullUrl}`)

    let retries = 3
    while (retries > 0) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 })

        // If the consent modal appears, approve it before continuing.
        // eslint-disable-next-line no-await-in-loop
        await acceptDataAccessModal(page)

        if (response) {
          // eslint-disable-next-line no-console
          console.log(`✅ Navigation successful: ${response.status()} ${response.statusText()} - ${page.url()}`)
        }
        break
      } catch (error) {
        retries -= 1
        const errorMessage = error instanceof Error ? error.message : String(error)

        if (retries === 0) {
          // eslint-disable-next-line no-console
          console.log(`❌ Navigation failed permanently: ${errorMessage} - URL: ${fullUrl}`)
          throw error
        }

        // eslint-disable-next-line no-console
        console.log(`⚠️ Navigation failed, retrying... (${retries} attempts left) - Error: ${errorMessage}`)
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
