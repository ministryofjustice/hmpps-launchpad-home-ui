import dotenv from 'dotenv'
import { test, expect } from '../../../Framework/utils/authenticatedTest'
import launchpadPortalLocators from '../../../Framework/pages/LaunchPad_Portal/launchpadPortalLocators'
import TransactionsPage from '../../../Framework/pages/Transactions_Portal/TransactionsPage'
import acceptDataAccessModal from '../../../Framework/utils/acceptDataAccessModal'

dotenv.config()

test.describe('Launchpad Timetable @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await acceptDataAccessModal(page)
  })

  test('Assert that the user can see the calendar module', async ({ page }) => {
    const timetableLink = page.locator(launchpadPortalLocators.timetableLink)

    await timetableLink.waitFor({ state: 'visible' })
    await expect(timetableLink).toHaveText('View my timetable')
  })

  test('Assert that the spends transactions table contains populated data', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page)

    await transactionsPage.open('/transactions/spends')
    await transactionsPage.expectTitle('Transactions')
    await transactionsPage.expectBalance('£234.50')
    await transactionsPage.expectTableContains('Workshop pay from', 'Canteen purchase', 'Berwyn (HMP)')
  })

  test('Assert that the private and savings transaction tables are populated', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page)

    await transactionsPage.open('/transactions/private')
    await transactionsPage.expectBalance('£12.00')
    await transactionsPage.expectTableContains('Private cash deposit', 'Phone credit top-up')

    await transactionsPage.open('/transactions/savings')
    await transactionsPage.expectBalance('£500.00')
    await transactionsPage.expectTableContains('Savings transfer in', 'Savings transfer out')
  })

  test('Assert that the damage obligations table is populated', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page)

    await transactionsPage.open('/transactions/damage-obligations')
    await transactionsPage.expectTitle('Transactions')
    await transactionsPage.expectBalance('£24')
    await transactionsPage.expectTableContains('1077480', 'Replacement headphones', 'Damaged kettle')
  })
})
