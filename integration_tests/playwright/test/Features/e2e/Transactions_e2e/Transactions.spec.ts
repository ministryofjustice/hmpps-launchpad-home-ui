import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadPortalLocators from '../../../pages/Launchpad_Portal/launchpadPortalLocators'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad Timetable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
  })

  test('Assert that the user can see the calendar module', async ({ page }) => {
    const timetableLink = page.locator(launchpadPortalLocators.timetableLink)

    await expect(timetableLink).toBeVisible()
    await expect(timetableLink).toHaveText('View my timetable')
  })
})
