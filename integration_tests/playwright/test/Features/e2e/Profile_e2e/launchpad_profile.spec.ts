import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import launchpadPortalLocators from '../../../pages/Launchpad_Portal/launchpadPortalLocators'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
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

  test('Assert that the user can navigate to their profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)
  })

  test('Assert that the User can see todays Timetable on their profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)

    const todayTimetable = page.locator(launchpadPortalLocators.todayTimetable)
    await todayTimetable.waitFor({ state: 'visible', timeout: 5000 })
    await expect(todayTimetable).toBeVisible()
    await expect(todayTimetable).toHaveText("Today's timetable")
  })

  test('Assert that the User can see the View my timetable link on their profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)

    const viewMyTimetableLink = page.locator(launchpadPortalLocators.viewMyTimetableLink)
    await viewMyTimetableLink.waitFor({ state: 'visible', timeout: 5000 })
    await expect(viewMyTimetableLink).toBeVisible()
    await expect(viewMyTimetableLink).toHaveText('View my timetable')
  })

  test('Assert that the User can see their Incentive Level on their profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)

    const incentivesHeading = page.locator(launchpadPortalLocators.incentivesHeading)
    const incentiveLevel = page.locator(launchpadPortalLocators.incentiveLevel)
    await incentiveLevel.waitFor({ state: 'visible', timeout: 5000 })
    await expect(incentivesHeading).toBeVisible()
    await expect(incentivesHeading).toHaveText('Incentives (IEP)')
    await expect(incentiveLevel).toBeVisible()
    await expect(incentiveLevel).toHaveText('Current level:')
  })

  test('Assert that the User can see their Account Balance on their profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)

    const accountBalance = page.locator(launchpadPortalLocators.accountBalance)
    await accountBalance.waitFor({ state: 'visible', timeout: 5000 })
    await expect(accountBalance).toBeVisible()
    await expect(accountBalance).toHaveText('Money')
  })

  test('As a User I can expand the Spends section on my profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)

    const spendsSection = page.locator(launchpadPortalLocators.spendsSection)
    await spendsSection.waitFor({ state: 'visible', timeout: 5000 })
    await expect(spendsSection).toBeVisible()
    await expect(spendsSection).toHaveText('Spends')

    const spendsExpandBtn = page.locator(launchpadPortalLocators.spendsExpandBtn)
    await spendsExpandBtn.waitFor({ state: 'visible', timeout: 5000 })
    await expect(spendsExpandBtn).toBeVisible()
    await spendsExpandBtn.click()

    const spendsDetails = page.locator(launchpadPortalLocators.spendsDetails)
    await spendsDetails.waitFor({ state: 'visible', timeout: 5000 })
    await expect(spendsDetails).toBeVisible()
    await expect(spendsDetails).toContainText('My current balance is:')
  })

  test('As a User I can expand the Private section on my profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)

    const privateSection = page.locator(launchpadPortalLocators.privateSection)
    await privateSection.waitFor({ state: 'visible', timeout: 5000 })
    await expect(privateSection).toBeVisible()
    await expect(privateSection).toHaveText('Private')

    const privateExpandBtn = page.locator(launchpadPortalLocators.privateExpandBtn)
    await privateExpandBtn.waitFor({ state: 'visible', timeout: 5000 })
    await expect(privateExpandBtn).toBeVisible()
    await privateExpandBtn.click()

    const privateDetails = page.locator(launchpadPortalLocators.privateDetails)
    await privateDetails.waitFor({ state: 'visible', timeout: 5000 })
    await expect(privateDetails).toBeVisible()
    await expect(privateDetails).toContainText('My current balance is:')
  })

  test('As a User I can expand the Savings section on my profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)

    const savingsSection = page.locator(launchpadPortalLocators.savingsSection)
    await savingsSection.waitFor({ state: 'visible', timeout: 5000 })
    await expect(savingsSection).toBeVisible()
    await expect(savingsSection).toHaveText('Savings')

    const savingsExpandBtn = page.locator(launchpadPortalLocators.savingsExpandBtn)
    await savingsExpandBtn.waitFor({ state: 'visible', timeout: 5000 })
    await expect(savingsExpandBtn).toBeVisible()
    await savingsExpandBtn.click()

    const savingsDetails = page.locator(launchpadPortalLocators.savingsDetails)
    await savingsDetails.waitFor({ state: 'visible', timeout: 5000 })
    await expect(savingsDetails).toBeVisible()
    await expect(savingsDetails).toContainText('My current balance is:')
  })

  test('Assert that the User can see their Visits on their profile page', async ({ page }) => {
    const profileLink = page.locator(launchpadPortalLocators.profileLink)
    await profileLink.click()
    await expect(page).toHaveURL(/.*\/profile/)

    const visitsSection = page.locator(launchpadPortalLocators.visitsSection)
    await visitsSection.waitFor({ state: 'visible', timeout: 5000 })
    await expect(visitsSection).toBeVisible()
    await expect(visitsSection).toHaveText('Visits')

    const nextVisitCard = page.locator(launchpadPortalLocators.nextVisitCard)
    await nextVisitCard.waitFor({ state: 'visible', timeout: 5000 })
    await expect(nextVisitCard).toBeVisible()
    await expect(nextVisitCard).toHaveText('Next visit')

    const visitsLeftCard = page.locator(launchpadPortalLocators.visitsLeftCard)
    await visitsLeftCard.waitFor({ state: 'visible', timeout: 5000 })
    await expect(visitsLeftCard).toBeVisible()
    await expect(visitsLeftCard).toHaveText("Visits I've got left")
  })
})
