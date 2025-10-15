import dotenv from 'dotenv'
import { test, expect } from '../../../../../support/fixtures'

dotenv.config()

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

test('User can access application with bypassed authentication', async ({ page, enhancedLogging }) => {
  enhancedLogging.logNavigation(baseURL, 'testing authentication bypass')

  try {
    await page.goto('/')
    enhancedLogging.logNavigation(page.url(), 'successfully loaded homepage')

    await expect(page).toHaveURL(`${baseURL}/`)
    enhancedLogging.logNavigation(`${baseURL}/`, 'URL assertion passed')
  } catch (error) {
    enhancedLogging.logError(`Authentication bypass test failed: ${error.message}`, 'Login Test')
    throw error
  }
})
