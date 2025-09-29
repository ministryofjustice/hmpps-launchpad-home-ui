const { chromium } = require('@playwright/test')

module.exports = async function globalSetup() {
  // Environment URL mapping using environment variables (secure approach)
  const getEnvironmentUrl = env => {
    switch (env) {
      case 'test':
        return process.env.TEST_INGRESS_URL || 'http://localhost:3000'
      case 'dev':
        return process.env.DEV_INGRESS_URL || 'http://localhost:3000'
      case 'staging':
        return process.env.STAGING_INGRESS_URL || 'http://localhost:3000'
      case 'preprod':
        return process.env.PREPROD_INGRESS_URL || 'http://localhost:3000'
      case 'prod':
        return process.env.PROD_INGRESS_URL || 'http://localhost:3000'
      default:
        return process.env.INGRESS_URL || 'http://localhost:3000'
    }
  }

  // Determine base URL with priority: TEST_ENV > INGRESS_URL > default localhost
  let baseURL

  if (process.env.TEST_ENV) {
    baseURL = getEnvironmentUrl(process.env.TEST_ENV)
  } else {
    baseURL = process.env.INGRESS_URL || 'http://localhost:3000'
  }

  // eslint-disable-next-line no-console
  console.log(`=== Playwright Environment Setup ===`)
  // eslint-disable-next-line no-console
  console.log(`🌍 TEST_ENV: ${process.env.TEST_ENV || 'default (local)'}`)
  // eslint-disable-next-line no-console
  console.log(`🔐 MS_USERNAME: ${process.env.MS_USERNAME ? 'set ✅' : 'not set ❌'}`)
  // eslint-disable-next-line no-console
  console.log(`🔐 MS_PASSWORD: ${process.env.MS_PASSWORD ? 'set ✅' : 'not set ❌'}`)

  // Check for required Microsoft SSO credentials
  if (!process.env.MS_USERNAME || !process.env.MS_PASSWORD) {
    throw new Error(
      'Missing required environment variables: MS_USERNAME and MS_PASSWORD must be set for authentication',
    )
  }

  const browser = await chromium.launch()
  const page = await browser.newPage()

  // eslint-disable-next-line no-console
  console.log(`🚀 Navigating to: ${baseURL}`)
  await page.goto(`${baseURL}`)

  // Wait for the page to load and check what we actually got
  await page.waitForLoadState('networkidle')
  const currentUrl = page.url()
  // eslint-disable-next-line no-console
  console.log(`Current URL after navigation: ${currentUrl}`)

  // Check if we're already logged in or if auth is bypassed
  const isAlreadyLoggedIn = (await page.locator('input#i0116').count()) === 0

  if (isAlreadyLoggedIn) {
    // eslint-disable-next-line no-console
    console.log('No Microsoft login form found - assuming already authenticated or auth bypassed')
  } else {
    // eslint-disable-next-line no-console
    console.log('Microsoft login form detected - proceeding with authentication')

    // Wait for Microsoft login form to appear with longer timeout
    try {
      await page.waitForSelector('input#i0116', { timeout: 30000 })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Microsoft login form not found. Page content:')
      // eslint-disable-next-line no-console
      console.log(await page.textContent('body'))
      // eslint-disable-next-line no-console
      console.log('Original error:', error.message)
      throw new Error(`Microsoft login form not found at ${currentUrl}. Expected input#i0116 selector.`)
    }

    await page.fill('input#i0116', process.env.MS_USERNAME)
    await page.click('button:has-text("Next"), input#idSIButton9')

    // Wait for password field
    await page.waitForSelector('input#i0118', { timeout: 15000 })
    await page.fill('input#i0118', process.env.MS_PASSWORD)
    await page.click('input[type="submit"]')
    await page.waitForSelector('input#idSIButton9', { timeout: 10000 })
    await page.click('input#idSIButton9')
  }

  // Save storage state for reuse
  await page.context().storageState({ path: 'storageState.json' })
  await browser.close()
}
