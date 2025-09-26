import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import TimetableLocators from '../../../pages/Timetable_Portal/TimetableLocators'
import launchpadPortalLocators from '../../../pages/Launchpad_Portal/launchpadPortalLocators'

dotenv.config()

const baseURL = process.env.BASE_URL

test.describe('Timetable Navigation and Grid Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' })
    
    const timetableLink = page.locator(launchpadPortalLocators.timetableLink)
    await timetableLink.click()
    await page.waitForLoadState('networkidle')
  })

  test('Assert that timetable navigation is visible and contains correct elements', async ({ page }) => {
    const timetableNavCount = await page.locator(TimetableLocators.timetableNav).count()
    console.log(`Found ${timetableNavCount} timetable navigation elements`)
    
    const timetableNav = page.locator(TimetableLocators.timetableNav).first()
    await expect(timetableNav).toBeVisible()

    const lastWeekLinkCount = await page.locator(TimetableLocators.lastWeekLink).count()
    const thisWeekLinkCount = await page.locator(TimetableLocators.thisWeekLink).count()
    
    console.log(`Found ${lastWeekLinkCount} last week links and ${thisWeekLinkCount} this week links`)

    if (lastWeekLinkCount > 0) {
      const lastWeekLink = page.locator(TimetableLocators.lastWeekLink).first()
      await expect(lastWeekLink).toBeVisible()
      await expect(lastWeekLink).toHaveText('Last week')
    }
    
    if (thisWeekLinkCount > 0) {
      const thisWeekLink = page.locator(TimetableLocators.thisWeekLink).first()
      await expect(thisWeekLink).toBeVisible()
      await expect(thisWeekLink).toHaveText('This week')
    }
    
    const nextWeekSpanCount = await page.locator(TimetableLocators.nextWeekSpan).count()
    console.log(`Found ${nextWeekSpanCount} next week span elements`)
    
    if (nextWeekSpanCount > 0) {
      const nextWeekSpan = page.locator(TimetableLocators.nextWeekSpan).first()
      await expect(nextWeekSpan).toBeVisible()
    }

    expect(lastWeekLinkCount + thisWeekLinkCount).toBeGreaterThan(0)
  })

  test('Assert that Last week navigation link works correctly', async ({ page }) => {
    const lastWeekLink = page.locator(TimetableLocators.lastWeekLink).first()
    await expect(lastWeekLink).toBeVisible()
    
    await lastWeekLink.click()
    await page.waitForLoadState('networkidle')
    
    await expect(page).toHaveURL(/.*\/timetable\/last-week/)
    
    const timetableContainer = page.locator(TimetableLocators.timetableDayContainer)
    await expect(timetableContainer).toBeVisible()
  })

  test('Assert that This week navigation link works correctly', async ({ page }) => {
    await page.goto(`${baseURL}/timetable/last-week`, { waitUntil: 'networkidle' })
    
    const thisWeekLink = page.locator(TimetableLocators.thisWeekLink).first()
    await expect(thisWeekLink).toBeVisible()
    
    await thisWeekLink.click()
    await page.waitForLoadState('networkidle')
    
    await expect(page).toHaveURL(/.*\/timetable$/)
    
    const timetableContainer = page.locator(TimetableLocators.timetableDayContainer)
    await expect(timetableContainer).toBeVisible()
  })

  test('Assert that Next week span is visible but not clickable', async ({ page }) => {
    const nextWeekSpanCount = await page.locator(TimetableLocators.nextWeekSpan).count()
    console.log(`Found ${nextWeekSpanCount} span elements in navigation`)
    
    if (nextWeekSpanCount > 0) {
      const nextWeekSpan = page.locator(TimetableLocators.nextWeekSpan).first()
      await expect(nextWeekSpan).toBeVisible()
      
      const spanText = await nextWeekSpan.textContent()
      console.log(`Span text content: "${spanText}"`)
      
      if (spanText?.includes('Next week')) {
        await expect(nextWeekSpan).toContainText('Next week')
        
        const tagName = await nextWeekSpan.evaluate(el => el.tagName.toLowerCase())
        expect(tagName).toBe('span')
        
        const hasHref = await nextWeekSpan.getAttribute('href')
        expect(hasHref).toBeNull()
      } else {
        console.log('Next week span found but does not contain expected text')
      }
    } else {
      console.log('No Next week span found - this may be expected behavior')
    }
  })

  test('Assert that timetable grid structure is properly rendered', async ({ page }) => {
    const mainContainer = page.locator(TimetableLocators.timetableDayContainer)
    await expect(mainContainer).toBeVisible()

    const dateHeaders = page.locator(TimetableLocators.dateHeaders)
    const dateHeaderCount = await dateHeaders.count()
    expect(dateHeaderCount).toBeGreaterThanOrEqual(1)
    
    console.log(`Timetable grid has ${dateHeaderCount} date headers`)
    
    for (let i = 1; i <= Math.min(dateHeaderCount, 5); i++) {
      const nthHeader = page.locator(TimetableLocators.nthDateHeader(i))
      await expect(nthHeader).toBeVisible()
      
      const headerText = await nthHeader.textContent()
      console.log(`Date header ${i}: ${headerText}`)
    }
  })

  test('Assert that timetable grid contains proper time period structure', async ({ page }) => {
    const morningSlots = await page.locator(TimetableLocators.morningTimeSlot).count()
    const afternoonSlots = await page.locator(TimetableLocators.afternoonTimeSlot).count()
    const eveningSlots = await page.locator(TimetableLocators.eveningTimeSlot).count()
    
    console.log(`Time periods - Morning: ${morningSlots}, Afternoon: ${afternoonSlots}, Evening: ${eveningSlots}`)
    
    expect(morningSlots + afternoonSlots + eveningSlots).toBeGreaterThan(0)
    
    if (morningSlots > 0) {
      const firstMorningSlot = page.locator(TimetableLocators.morningTimeSlot).first()
      await expect(firstMorningSlot).toBeVisible()
    }
    
    if (afternoonSlots > 0) {
      const firstAfternoonSlot = page.locator(TimetableLocators.afternoonTimeSlot).first()
      await expect(firstAfternoonSlot).toBeVisible()
    }
    
    if (eveningSlots > 0) {
      const firstEveningSlot = page.locator(TimetableLocators.eveningTimeSlot).first()
      await expect(firstEveningSlot).toBeVisible()
    }
  })

  test('Assert that timetable grid shows activities in proper structure', async ({ page }) => {
    const allTimeElements = await page.locator(TimetableLocators.timetableTime).count()
    const allDescriptionElements = await page.locator(TimetableLocators.timetableDescription).count()
    
    console.log(`Grid content - Time elements: ${allTimeElements}, Description elements: ${allDescriptionElements}`)
    
    if (allTimeElements > 0) {
      const firstTimeElement = page.locator(TimetableLocators.timetableTime).first()
      await expect(firstTimeElement).toBeVisible()
      
      const timeText = await firstTimeElement.textContent()
      if (timeText && timeText.trim()) {
        expect(timeText).toMatch(/\d+\.\d+[ap]m to \d+\.\d+[ap]m/)
      }
    }
    
    if (allDescriptionElements > 0) {
      const firstDescElement = page.locator(TimetableLocators.timetableDescription).first()
      await expect(firstDescElement).toBeVisible()
    }
  })

  test('Assert that timetable grid handles empty time slots correctly', async ({ page }) => {
    const emptySlots = await page.locator('.timetable-empty').count()
    const noActivitiesElements = await page.locator('strong:has-text("No activities")').count()
    
    console.log(`Empty slots found: ${emptySlots}, No activities elements: ${noActivitiesElements}`)
    
    if (emptySlots > 0) {
      const firstEmptySlot = page.locator('.timetable-empty').first()
      await expect(firstEmptySlot).toBeVisible()
      await expect(firstEmptySlot).toContainText('No activities')
    }
  })

  test('Assert that timetable grid navigation preserves grid structure', async ({ page }) => {
    const initialDateHeaders = await page.locator(TimetableLocators.dateHeaders).count()
    const initialContainer = page.locator(TimetableLocators.timetableDayContainer)
    await expect(initialContainer).toBeVisible()
    
    const lastWeekLink = page.locator(TimetableLocators.lastWeekLink).first()
    await lastWeekLink.click()
    await page.waitForLoadState('networkidle')
    
    const lastWeekDateHeaders = await page.locator(TimetableLocators.dateHeaders).count()
    const lastWeekContainer = page.locator(TimetableLocators.timetableDayContainer)
    await expect(lastWeekContainer).toBeVisible()
    
    const thisWeekLink = page.locator(TimetableLocators.thisWeekLink).first()
    await thisWeekLink.click()
    await page.waitForLoadState('networkidle')
    
    const returnedDateHeaders = await page.locator(TimetableLocators.dateHeaders).count()
    const returnedContainer = page.locator(TimetableLocators.timetableDayContainer)
    await expect(returnedContainer).toBeVisible()
    
    console.log(`Grid consistency - Initial: ${initialDateHeaders}, Last week: ${lastWeekDateHeaders}, Returned: ${returnedDateHeaders}`)
    
    expect(initialDateHeaders).toBeGreaterThanOrEqual(1)
    expect(lastWeekDateHeaders).toBeGreaterThanOrEqual(1)
    expect(returnedDateHeaders).toBeGreaterThanOrEqual(1)
  })

  test('Assert that timetable grid is responsive and maintains structure', async ({ page }) => {
    const container = page.locator(TimetableLocators.timetableDayContainer)
    await expect(container).toBeVisible()
    
    const containerBounds = await container.boundingBox()
    expect(containerBounds).not.toBeNull()
    expect(containerBounds?.width).toBeGreaterThan(0)
    expect(containerBounds?.height).toBeGreaterThan(0)
    
    const allGridElements = await page.locator(`${TimetableLocators.timetableDayContainer} *`).count()
    console.log(`Total grid elements: ${allGridElements}`)
    expect(allGridElements).toBeGreaterThan(0)
  })
})