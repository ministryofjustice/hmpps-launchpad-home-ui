import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadPortalLocators from '../../../Framework/pages/LaunchPad_Portal/launchpadPortalLocators'
import { acceptDataAccessModal } from '../../../Framework/utils/acceptDataAccessModal'

dotenv.config()

test.describe('Launchpad Timetable @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await acceptDataAccessModal(page)
  })

  test('Assert that the user can see the calendar module', async ({ page }) => {
    const timetableLink = page.locator(launchpadPortalLocators.timetableLink)

    await expect(timetableLink).toBeVisible()
    await expect(timetableLink).toHaveText('View my timetable')
  })
})
