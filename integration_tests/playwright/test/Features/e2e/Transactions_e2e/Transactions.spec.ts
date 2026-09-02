import dotenv from 'dotenv'
import { test, expect } from '../../../Framework/utils/authenticatedTest'
import launchpadPortalLocators from '../../../Framework/pages/LaunchPad_Portal/launchpadPortalLocators'
import acceptDataAccessModal from '../../../Framework/utils/acceptDataAccessModal'

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

  test('Assert that the spends transactions table contains populated data', async ({ page }) => {
    await page.goto('/transactions/spends', { waitUntil: 'networkidle' })

    await expect(page.locator('h1#title')).toHaveText('Transactions')
    await expect(page.locator('.transaction__balances p')).toHaveText('£234.50')
    await expect(page.locator('.govuk-table')).toContainText('Workshop pay from')
    await expect(page.locator('.govuk-table')).toContainText('Canteen purchase')
    await expect(page.locator('.govuk-table')).toContainText('Berwyn (HMP)')
  })

  test('Assert that the private and savings transaction tables are populated', async ({ page }) => {
    await page.goto('/transactions/private', { waitUntil: 'networkidle' })
    await expect(page.locator('.transaction__balances p')).toHaveText('£12.00')
    await expect(page.locator('.govuk-table')).toContainText('Private cash deposit')
    await expect(page.locator('.govuk-table')).toContainText('Phone credit top-up')

    await page.goto('/transactions/savings', { waitUntil: 'networkidle' })
    await expect(page.locator('.transaction__balances p')).toHaveText('£500.00')
    await expect(page.locator('.govuk-table')).toContainText('Savings transfer in')
    await expect(page.locator('.govuk-table')).toContainText('Savings transfer out')
  })

  test('Assert that the damage obligations table is populated', async ({ page }) => {
    await page.goto('/transactions/damage-obligations', { waitUntil: 'networkidle' })

    await expect(page.locator('h1#title')).toHaveText('Transactions')
    await expect(page.locator('.transaction__balances p')).toHaveText('£24')
    await expect(page.locator('.govuk-table')).toContainText('1077480')
    await expect(page.locator('.govuk-table')).toContainText('Replacement headphones')
    await expect(page.locator('.govuk-table')).toContainText('Damaged kettle')
  })
})
