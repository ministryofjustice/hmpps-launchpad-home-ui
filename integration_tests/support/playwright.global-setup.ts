import { chromium } from '@playwright/test'
import auth from '../mockApis/auth'

export default async function globalSetup() {
  // Set up Wiremock auth stubs

  // Setup authentication stubs for Wiremock
  await auth.stubAuthPing()
  await auth.stubSignIn()
  await auth.stubAuthUser('Test User')

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Navigate to the app which should redirect to sign-in
    await page.goto(`${process.env.BASE_URL || 'http://localhost:3000'}/sign-in`)

    // Wait for redirect and authentication to complete
    await page.waitForURL(`${process.env.BASE_URL || 'http://localhost:3000'}/`, { timeout: 10000 })

    // eslint-disable-next-line no-console
    console.log('✓ Authentication setup completed successfully')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('✗ Authentication setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}
