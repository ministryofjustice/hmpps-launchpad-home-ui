import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadExternalLinksLocators from '../../../pages/Launchpad_Portal/launchpadExternalLinksLocators'

dotenv.config()

test.describe('Launchpad External Web Links - Inside Time', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('Assert that the user can see the inside time module', async ({ page }) => {
    const insideTimeLink = page.locator(launchpadExternalLinksLocators.insideTimeLink)
    await expect(insideTimeLink).toBeVisible()

    await expect(insideTimeLink.locator(launchpadExternalLinksLocators.insideTimeImg)).toBeVisible()
    await expect(insideTimeLink.locator(launchpadExternalLinksLocators.insideTimeHeading)).toHaveText('Inside Time')
    await expect(insideTimeLink.locator(launchpadExternalLinksLocators.insideTimeDescription)).toHaveText(
      'Read the national newspaper for prisoners and detainees.',
    )
  })
})
