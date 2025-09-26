import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import ProfileLocators from 'pages/Profile_Portal/ProfileLocators'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Profile - Timetable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
  })

  test('Assert that the user can see the calendar module', async ({ page }) => {
    const timetableLink = page.locator(ProfileLocators.timetableLink)

    await expect(timetableLink).toBeVisible()
    await expect(timetableLink).toHaveText('View my timetable')
  })

  test('Assert that the user can see the timetable link', async ({ page }) => {
    const timetableLink = page.locator(ProfileLocators.timetableLink)
    await timetableLink.click()
    await expect(page).toHaveURL(/.*\/timetable/)
  })

  test('Assert that the user can see the timetable events', async ({ page }) => {
    const profileLink = page.locator(ProfileLocators.profileLink)
    await profileLink.click()

    const viewMyTimetableLink = page.locator(ProfileLocators.viewMyTimetableLink)
    await viewMyTimetableLink.waitFor({ state: 'visible', timeout: 5000 })

    await expect(viewMyTimetableLink).toBeVisible()
    await expect(viewMyTimetableLink).toHaveText('View my timetable')
    await viewMyTimetableLink.click()
    await expect(page).toHaveURL(/.*\/timetable/)
  })
})

