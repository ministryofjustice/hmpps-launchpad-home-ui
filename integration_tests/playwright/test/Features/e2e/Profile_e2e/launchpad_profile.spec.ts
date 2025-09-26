import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import ProfileLocators from '../../../pages/Profile_Portal/ProfileLocators'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })

    const profileLink = page.locator(ProfileLocators.profileLink)
    await profileLink.click()
  })

  test('Assert that the user can see their profile details module', async ({ page }) => {
    await page.goBack()

    const profileTile = page.locator(ProfileLocators.profileTile)
    await profileTile.waitFor({ state: 'visible', timeout: 5000 })

    const profileLink = profileTile.locator(ProfileLocators.profileLink)
    await profileLink.waitFor({ state: 'visible', timeout: 5000 })

    const profileHeading = profileLink.locator(ProfileLocators.profileHeading)
    await profileHeading.waitFor({ state: 'visible', timeout: 5000 })

    await expect(profileTile).toBeVisible()
    await expect(profileLink).toBeVisible()
    await expect(profileHeading).toHaveText('Profile')
    await expect(profileLink.locator(ProfileLocators.profileDescription)).toHaveText(
      'Check money, visits, incentives (IEP), adjudications and timetable.',
    )
  })

  test('Assert that the user can navigate to their profile page', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/profile/)
  })

  test('Assert that the User can see todays Timetable on their profile page', async ({ page }) => {
    const todayTimetable = page.locator(ProfileLocators.todayTimetable)
    await todayTimetable.waitFor({ state: 'visible', timeout: 5000 })
    await expect(todayTimetable).toBeVisible()
    await expect(todayTimetable).toHaveText("Today's timetable")
  })

  test('Assert that the User can see the View my timetable link on their profile page', async ({ page }) => {
    const viewMyTimetableLink = page.locator(ProfileLocators.viewMyTimetableLink)
    await viewMyTimetableLink.waitFor({ state: 'visible', timeout: 5000 })
    await expect(viewMyTimetableLink).toBeVisible()
    await expect(viewMyTimetableLink).toHaveText('View my timetable')
  })

  test('Assert that the User can see their Incentive Level on their profile page', async ({ page }) => {
    const incentivesHeading = page.locator(ProfileLocators.incentivesHeading)
    const incentiveLevel = page.locator(ProfileLocators.incentiveLevel)
    await incentiveLevel.waitFor({ state: 'visible', timeout: 5000 })
    await expect(incentivesHeading).toBeVisible()
    await expect(incentivesHeading).toHaveText('Incentives (IEP)')
    await expect(incentiveLevel).toBeVisible()
    await expect(incentiveLevel).toHaveText('Current level:')
  })

  test('Assert that the User can see their Account Balance on their profile page', async ({ page }) => {
    const accountBalance = page.locator(ProfileLocators.accountBalance)
    await accountBalance.waitFor({ state: 'visible', timeout: 5000 })
    await expect(accountBalance).toBeVisible()
    await expect(accountBalance).toHaveText('Money')
  })

  test('As a User I can expand the Spends section on my profile page', async ({ page }) => {
    const spendsSection = page.locator(ProfileLocators.spendsSection)
    await spendsSection.waitFor({ state: 'visible', timeout: 5000 })
    await expect(spendsSection).toBeVisible()
    await expect(spendsSection).toHaveText('Spends')

    const spendsExpandBtn = page.locator(ProfileLocators.spendsExpandBtn)
    await spendsExpandBtn.waitFor({ state: 'visible', timeout: 5000 })
    await expect(spendsExpandBtn).toBeVisible()
    await spendsExpandBtn.click()

    const spendsDetails = page.locator(ProfileLocators.spendsDetails)
    await spendsDetails.waitFor({ state: 'visible', timeout: 5000 })
    await expect(spendsDetails).toBeVisible()
    await expect(spendsDetails).toContainText('My current balance is:')
  })

  test('As a User I can expand the Private section on my profile page', async ({ page }) => {
    const privateSection = page.locator(ProfileLocators.privateSection)
    await privateSection.waitFor({ state: 'visible', timeout: 5000 })
    await expect(privateSection).toBeVisible()
    await expect(privateSection).toHaveText('Private')

    const privateExpandBtn = page.locator(ProfileLocators.privateExpandBtn)
    await privateExpandBtn.waitFor({ state: 'visible', timeout: 5000 })
    await expect(privateExpandBtn).toBeVisible()
    await privateExpandBtn.click()

    const privateDetails = page.locator(ProfileLocators.privateDetails)
    await privateDetails.waitFor({ state: 'visible', timeout: 5000 })
    await expect(privateDetails).toBeVisible()
    await expect(privateDetails).toContainText('My current balance is:')
  })

  test('As a User I can expand the Savings section on my profile page', async ({ page }) => {
    const savingsSection = page.locator(ProfileLocators.savingsSection)
    await savingsSection.waitFor({ state: 'visible', timeout: 5000 })
    await expect(savingsSection).toBeVisible()
    await expect(savingsSection).toHaveText('Savings')

    const savingsExpandBtn = page.locator(ProfileLocators.savingsExpandBtn)
    await savingsExpandBtn.waitFor({ state: 'visible', timeout: 5000 })
    await expect(savingsExpandBtn).toBeVisible()
    await savingsExpandBtn.click()

    const savingsDetails = page.locator(ProfileLocators.savingsDetails)
    await savingsDetails.waitFor({ state: 'visible', timeout: 5000 })
    await expect(savingsDetails).toBeVisible()
    await expect(savingsDetails).toContainText('My current balance is:')
  })

  test('Assert that the User can select and navigate into View transactions on their profile page', async ({
    page,
  }) => {
    const transactionsLink = page.locator(ProfileLocators.transactionsLink)
    await transactionsLink.waitFor({ state: 'visible', timeout: 5000 })
    await expect(transactionsLink).toBeVisible()
    await transactionsLink.click()
  })

  test('Assert that the User can see their Visits on their profile page', async ({ page }) => {
    const visitsSection = page.locator(ProfileLocators.visitsSection)
    await visitsSection.waitFor({ state: 'visible', timeout: 5000 })
    await expect(visitsSection).toBeVisible()
    await expect(visitsSection).toHaveText('Visits')

    const nextVisitCard = page.locator(ProfileLocators.nextVisitCard)
    await nextVisitCard.waitFor({ state: 'visible', timeout: 5000 })
    await expect(nextVisitCard).toBeVisible()
    await expect(nextVisitCard).toHaveText('Next visit')

    const visitsLeftCard = page.locator(ProfileLocators.visitsLeftCard)
    await visitsLeftCard.waitFor({ state: 'visible', timeout: 5000 })
    await expect(visitsLeftCard).toBeVisible()
    await expect(visitsLeftCard).toHaveText("Visits I've got left")
  })
})
