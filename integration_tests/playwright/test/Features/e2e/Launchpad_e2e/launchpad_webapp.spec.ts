import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad Web App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
  })

  test('Assert that the User has logged into Launchpad', async ({ page }) => {
    await expect(page).toHaveURL(`${baseURL}`)
  })

  test('Assert that the user can see the calendar module', async ({ page }) => {
    const timetableLink = page.locator('a.govuk-link#view-timetable-link[href="/timetable"]')

    await expect(timetableLink).toBeVisible()
    await expect(timetableLink).toHaveText('View my timetable')
  })

  test('Assert that the user can see their profile details module', async ({ page }) => {
    const profileTile = page.locator('div.internal-link-tile#internal-link-tile-profile')
    await profileTile.waitFor({ state: 'visible', timeout: 5000 })

    const profileLink = profileTile.locator('a[href="/profile"][rel="noreferrer noopener"]')
    await profileLink.waitFor({ state: 'visible', timeout: 5000 })

    const profileHeading = profileLink.locator('h2:has-text("Profile")')
    await profileHeading.waitFor({ state: 'visible', timeout: 5000 })

    await expect(profileTile).toBeVisible()
    await expect(profileLink).toBeVisible()
    await expect(profileHeading).toHaveText('Profile')
    await expect(profileLink.locator('p')).toHaveText(
      'Check money, visits, incentives (IEP), adjudications and timetable.',
    )
  })
})
