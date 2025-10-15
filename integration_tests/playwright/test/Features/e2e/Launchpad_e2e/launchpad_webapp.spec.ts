import dotenv from 'dotenv'
import { test, expect } from '../../../../../support/fixtures'
import launchpadPortalLocators from '../../../Framework/pages/LaunchPad_Portal/launchpadPortalLocators'

dotenv.config()

test.describe('Launchpad Web App', () => {
  test.beforeEach(async ({ page, enhancedLogging }) => {
    // Enhanced retry logic with detailed logging for navigation
    let retries = 3
    const targetUrl = '/'

    enhancedLogging.logNavigation(targetUrl, 'starting retry loop')

    while (retries > 0) {
      try {
        enhancedLogging.logNavigation(targetUrl, `attempting (${4 - retries}/3)`)

        // eslint-disable-next-line no-await-in-loop
        const response = await page.goto(targetUrl, {
          waitUntil: 'networkidle',
          timeout: 30000,
        })

        // Log response status
        if (response) {
          enhancedLogging.logNavigation(
            `${targetUrl} -> Status: ${response.status()} ${response.statusText()}`,
            'successful response',
          )
        }

        // Verify page is actually loaded
        // eslint-disable-next-line no-await-in-loop
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 })

        enhancedLogging.logNavigation(page.url(), 'navigation completed successfully')
        break
      } catch (error) {
        retries -= 1
        const errorMessage = error instanceof Error ? error.message : String(error)

        enhancedLogging.logError(`Navigation attempt failed: ${errorMessage}`, `Retry ${4 - retries}/3`)

        if (retries === 0) {
          enhancedLogging.logError(`All navigation attempts failed for ${targetUrl}`, 'Final failure')
          throw error
        }

        enhancedLogging.logNavigation(targetUrl, `retrying in 2s (${retries} attempts left)`)

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
