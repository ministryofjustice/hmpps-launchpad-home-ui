import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'

dotenv.config()

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

test('User can access application with bypassed authentication', async ({ page }) => {
  const fullUrl = `${baseURL}/`

  // eslint-disable-next-line no-console
  console.log(`🌐 Testing authentication bypass - Navigating to: ${fullUrl}`)

  try {
    await page.goto('/')

    // eslint-disable-next-line no-console
    console.log(`✅ Authentication bypass successful - Current URL: ${page.url()}`)

    await expect(page).toHaveURL(`${baseURL}/`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    // eslint-disable-next-line no-console
    console.log(`❌ Authentication bypass failed: ${errorMessage} - Target URL: ${fullUrl}`)
    throw error
  }
})
