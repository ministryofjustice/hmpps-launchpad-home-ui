import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadPortalLocators from '../../../pages/Launchpad_Portal/launchpadPortalLocators'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad External Web Links - Content Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
  })

  test("Assert that the user can see today's events section", async ({ page }) => {
    // Check for events summary section
    const eventsSummaryWrapper = page.locator(launchpadPortalLocators.eventsSummaryWrapper)
    const eventsSummary = page.locator(launchpadPortalLocators.eventsSummary)
    const todaysEventsHeading = page.locator(launchpadPortalLocators.todaysEventsHeading)

    await expect(eventsSummaryWrapper).toBeVisible()
    await expect(eventsSummary).toBeVisible()
    await expect(todaysEventsHeading).toBeVisible()
  })
})
