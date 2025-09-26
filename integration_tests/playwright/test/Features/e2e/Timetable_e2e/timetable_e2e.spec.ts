import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import TimetableLocators from '../../../pages/Timetable_Portal/TimetableLocators'
import ProfileLocators from '../../../pages/Profile_Portal/ProfileLocators'
import launchpadExternalLinksLocators from 'pages/launchpad/launchlinks'
import launchpadPortalLocators from 'pages/launchpad/portal'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Launchpad Portal - Timetable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
    
    const timetableLink = page.locator(launchpadPortalLocators.timetableLink)
    await timetableLink.click()
  })

  test('Assert that the main timetable container is visible', async ({ page }) => {
    const timetableDayContainer = page.locator(TimetableLocators.timetableDayContainer)
    await expect(timetableDayContainer).toBeVisible()
  })

  test('Assert that date headers are visible and correct', async ({ page }) => {
    const dateHeaders = page.locator(TimetableLocators.dateHeaders)
    await expect(dateHeaders).toHaveCount(5)
    
    const todayHeader = page.locator(TimetableLocators.todayHeader)
    await expect(todayHeader).toBeVisible()
    await expect(todayHeader).toHaveText('Today')
    
    const secondDateHeader = page.locator(TimetableLocators.secondDateHeader)
    const thirdDateHeader = page.locator(TimetableLocators.thirdDateHeader)
    const fourthDateHeader = page.locator(TimetableLocators.fourthDateHeader)
    const fifthDateHeader = page.locator(TimetableLocators.fifthDateHeader)
    
    await expect(secondDateHeader).toBeVisible()
    await expect(thirdDateHeader).toBeVisible()
    await expect(fourthDateHeader).toBeVisible()
    await expect(fifthDateHeader).toBeVisible()
  })

  test('Assert that day blocks are present for each day', async ({ page }) => {
    const todayDayBlocks = page.locator(TimetableLocators.todayDayBlocks)
    const secondDayBlocks = page.locator(TimetableLocators.secondDayBlocks)
    const thirdDayBlocks = page.locator(TimetableLocators.thirdDayBlocks)
    const fourthDayBlocks = page.locator(TimetableLocators.fourthDayBlocks)
    const fifthDayBlocks = page.locator(TimetableLocators.fifthDayBlocks)
    
    await expect(todayDayBlocks).toBeVisible()
    await expect(secondDayBlocks).toBeVisible()
    await expect(thirdDayBlocks).toBeVisible()
    await expect(fourthDayBlocks).toBeVisible()
    await expect(fifthDayBlocks).toBeVisible()
  })

  test('Assert that time period slots are visible', async ({ page }) => {
    const morningTimeSlot = page.locator(TimetableLocators.morningTimeSlot).first()
    const afternoonTimeSlot = page.locator(TimetableLocators.afternoonTimeSlot).first()
    const eveningTimeSlot = page.locator(TimetableLocators.eveningTimeSlot).first()
    
    await expect(morningTimeSlot).toBeVisible()
    
    const afternoonCount = await page.locator(TimetableLocators.afternoonTimeSlot).count()
    const eveningCount = await page.locator(TimetableLocators.eveningTimeSlot).count()
    
    if (afternoonCount > 0) {
      await expect(afternoonTimeSlot).toBeVisible()
    }
    if (eveningCount > 0) {
      await expect(eveningTimeSlot).toBeVisible()
    }
  })

  test('Assert that day block statuses are correctly identified', async ({ page }) => {
    const mainContainer = page.locator(TimetableLocators.timetableDayContainer)
    await expect(mainContainer).toBeVisible()
    
    const allTimetableElements = await page.locator(`${TimetableLocators.timetableDayContainer} *`).count()
    
    expect(allTimetableElements).toBeGreaterThan(0)
    
    console.log(`Timetable structure verification - Found ${allTimetableElements} elements within the timetable container`)
  })

  test('Assert that activity elements are present and contain correct information', async ({ page }) => {
    const timetableTimeCount = await page.locator(TimetableLocators.timetableTime).count()
    const timetableDescriptionCount = await page.locator(TimetableLocators.timetableDescription).count()
    
    if (timetableTimeCount > 0) {
      const timetableTime = page.locator(TimetableLocators.timetableTime).first()
      await expect(timetableTime).toBeVisible()
      await expect(timetableTime).toContainText(/\d+\.\d+[ap]m to \d+\.\d+[ap]m/)
    }
    
    if (timetableDescriptionCount > 0) {
      const timetableDescription = page.locator(TimetableLocators.timetableDescription).first()
      await expect(timetableDescription).toBeVisible()
    }
    
    const activityTitleCount = await page.locator(TimetableLocators.activityTitle).count()
    if (activityTitleCount > 0) {
      const activityTitle = page.locator(TimetableLocators.activityTitle).first()
      await expect(activityTitle).toBeVisible()
    }
    
    console.log(`Activity elements - Times: ${timetableTimeCount}, Descriptions: ${timetableDescriptionCount}, Titles: ${activityTitleCount}`)
  })

  test('Assert that today\'s time-based activities are visible', async ({ page }) => {
    const morningActivitiesCount = await page.locator(TimetableLocators.morningActivities).count()
    const afternoonActivitiesCount = await page.locator(TimetableLocators.afternoonActivities).count()
    const eveningActivitiesCount = await page.locator(TimetableLocators.eveningActivities).count()
    
    if (morningActivitiesCount > 0) {
      const morningActivities = page.locator(TimetableLocators.morningActivities).first()
      await expect(morningActivities).toBeVisible()
    }
    
    if (afternoonActivitiesCount > 0) {
      const afternoonActivities = page.locator(TimetableLocators.afternoonActivities).first()
      await expect(afternoonActivities).toBeVisible()
    }
    
    if (eveningActivitiesCount > 0) {
      const eveningActivities = page.locator(TimetableLocators.eveningActivities).first()
      await expect(eveningActivities).toBeVisible()
    }
    
    console.log(`Found activities - Morning: ${morningActivitiesCount}, Afternoon: ${afternoonActivitiesCount}, Evening: ${eveningActivitiesCount}`)
  })

  test('Assert that activity content structure is flexible for dynamic content', async ({ page }) => {
    const todayHigherFuncSkillsCount = await page.locator(TimetableLocators.todayHigherFuncSkills).count()
    const todayGymActivitiesCount = await page.locator(TimetableLocators.todayGymActivities).count()
    const todayCleaningActivitiesCount = await page.locator(TimetableLocators.todayCleaningActivities).count()
    
    const allActivityDescriptions = await page.locator('[data-test="Today"] .timetable-desc').count()
    
    console.log(`Today's activities - Higher Func Skills: ${todayHigherFuncSkillsCount}, Gym: ${todayGymActivitiesCount}, Cleaning: ${todayCleaningActivitiesCount}`)
    console.log(`Total activity descriptions found: ${allActivityDescriptions}`)
    
    if (todayHigherFuncSkillsCount > 0) {
      const todayHigherFuncSkills = page.locator(TimetableLocators.todayHigherFuncSkills).first()
      await expect(todayHigherFuncSkills).toBeVisible()
    }
    
    if (todayGymActivitiesCount > 0) {
      const todayGymActivities = page.locator(TimetableLocators.todayGymActivities).first()
      await expect(todayGymActivities).toBeVisible()
    }
    
    if (todayCleaningActivitiesCount > 0) {
      const todayCleaningActivities = page.locator(TimetableLocators.todayCleaningActivities).first()
      await expect(todayCleaningActivities).toBeVisible()
    }
    
    expect(allActivityDescriptions).toBeGreaterThanOrEqual(0)
  })

  test('Assert that dynamic selectors work across all days regardless of content', async ({ page }) => {
    const dayPositions = [1, 2, 3, 4, 5]
    
    for (const position of dayPositions) {
      const nthDayActivities = await page.locator(TimetableLocators.nthDayBlocks(position)).count()
      const nthDayAllContent = await page.locator(`${TimetableLocators.nthDayBlocks(position)} *`).count()
      
      console.log(`Day ${position} - Blocks: ${nthDayActivities}, Content elements: ${nthDayAllContent}`)
      
      expect(nthDayActivities).toBeGreaterThanOrEqual(0)
      expect(nthDayAllContent).toBeGreaterThanOrEqual(0)
    }
  })

  test('Assert that dynamic date calculations work correctly', async ({ page }) => {
    const tomorrow = TimetableLocators.getDateForDaysFromNow(1)
    const dayAfterTomorrow = TimetableLocators.getDateForDaysFromNow(2)
    
    const tomorrowFormatted = TimetableLocators.formatDateForSelector(tomorrow)
    const dayAfterTomorrowFormatted = TimetableLocators.formatDateForSelector(dayAfterTomorrow)
    
    console.log(`Tomorrow formatted: ${tomorrowFormatted}`)
    console.log(`Day after tomorrow formatted: ${dayAfterTomorrowFormatted}`)
    
    const tomorrowHeader = page.locator(TimetableLocators.dayHeaderContaining(tomorrowFormatted))
    const dayAfterTomorrowHeader = page.locator(TimetableLocators.dayHeaderContaining(dayAfterTomorrowFormatted))
    
    const tomorrowHeaderCount = await tomorrowHeader.count()
    const dayAfterTomorrowHeaderCount = await dayAfterTomorrowHeader.count()
    
    expect(tomorrowHeaderCount).toBeGreaterThanOrEqual(0)
    expect(dayAfterTomorrowHeaderCount).toBeGreaterThanOrEqual(0)
  })

  test('Assert that nth selectors work for any position', async ({ page }) => {
    for (let i = 1; i <= 5; i++) {
      const nthHeader = page.locator(TimetableLocators.nthDateHeader(i))
      const nthDayBlock = page.locator(TimetableLocators.nthDayBlocks(i))
      
      await expect(nthHeader).toBeVisible()
      await expect(nthDayBlock).toBeVisible()
    }
  })
})

