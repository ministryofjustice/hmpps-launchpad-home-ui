const { chromium } = require('@playwright/test')

module.exports = async function globalSetup() {
  // Generate trusted hostnames from environment variables for security
  const getTrustedHosts = () => {
    const hosts = ['localhost:3000'] // Always allow localhost for development

    // Add environment-specific hosts from environment variables
    if (process.env.DEV_INGRESS_URL) {
      hosts.push(new URL(process.env.DEV_INGRESS_URL).host)
    }
    if (process.env.STAGING_INGRESS_URL) {
      hosts.push(new URL(process.env.STAGING_INGRESS_URL).host)
    }
    if (process.env.TEST_INGRESS_URL && !process.env.TEST_INGRESS_URL.includes('localhost')) {
      hosts.push(new URL(process.env.TEST_INGRESS_URL).host)
    }
    if (process.env.INGRESS_URL && !process.env.INGRESS_URL.includes('localhost')) {
      hosts.push(new URL(process.env.INGRESS_URL).host)
    }

    return [...new Set(hosts)] // Remove duplicates
  }

  const TRUSTED_HOSTS = getTrustedHosts()

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

  try {
    await page.goto(`${baseURL}`, { timeout: 30000 })

    // Wait for the page to load and check what we actually got
    await page.waitForLoadState('networkidle')
    const currentUrl = page.url()
    // eslint-disable-next-line no-console
    console.log(`✅ Successfully navigated to: ${currentUrl}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`❌ Navigation failed: ${error.message}`)
    // eslint-disable-next-line no-console
    console.log(`🔍 This could indicate:`)
    // eslint-disable-next-line no-console
    console.log(`   - Firewall blocking CI access to ${baseURL}`)
    // eslint-disable-next-line no-console
    console.log(`   - Network connectivity issues`)
    // eslint-disable-next-line no-console
    console.log(`   - Environment not accessible from CI IP range`)
    // eslint-disable-next-line no-console
    console.log(`📧 Contact infrastructure team to whitelist CircleCI IPs`)
    throw error
  }

  const currentUrl = page.url()

  // Enhanced page detection and diagnostics
  const loginFormExists = (await page.locator('input#i0116').count()) > 0
  const currentUrlObj = new URL(currentUrl)
  const isLaunchpadPage =
    TRUSTED_HOSTS.includes(currentUrlObj.host) && currentUrlObj.host !== 'login.microsoftonline.com'
  const isLocalhost = currentUrlObj.host === 'localhost:3000'

  // eslint-disable-next-line no-console
  console.log(`🔍 Page Analysis:`)
  // eslint-disable-next-line no-console
  console.log(`   📍 Current URL: ${currentUrl}`)
  // eslint-disable-next-line no-console
  console.log(`   🔑 Microsoft login form: ${loginFormExists ? 'Found ✅' : 'Not found ❌'}`)
  // eslint-disable-next-line no-console
  console.log(`   🏠 Is Launchpad page: ${isLaunchpadPage ? 'Yes ✅' : 'No ❌'}`)
  // eslint-disable-next-line no-console
  console.log(`   💻 Is localhost: ${isLocalhost ? 'Yes' : 'No'}`)

  // Get page title and some content for debugging
  const pageTitle = await page.title()
  // eslint-disable-next-line no-console
  console.log(`   📄 Page title: "${pageTitle}"`)

  if (!loginFormExists) {
    // Check what kind of page we landed on
    if (isLaunchpadPage) {
      // eslint-disable-next-line no-console
      console.log('🎯 Already authenticated - landed directly on Launchpad portal')
    } else if (isLocalhost) {
      // eslint-disable-next-line no-console
      console.log('🏠 On localhost - authentication likely bypassed')
    } else {
      // eslint-disable-next-line no-console
      console.log('❓ Unexpected page - not Microsoft login, not Launchpad')
      // Get some page content for debugging
      const bodyText = await page.locator('body').textContent()
      const firstWords = (bodyText && bodyText.substring(0, 200)) || 'No content found'
      // eslint-disable-next-line no-console
      console.log(`   📝 Page content preview: "${firstWords}..."`)
    }
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

    // Wait for successful authentication and redirect back to the app
    // eslint-disable-next-line no-console
    console.log('⏳ Waiting for authentication to complete...')
    await page.waitForURL(
      url => {
        const urlObj = new URL(url.toString())
        return TRUSTED_HOSTS.includes(urlObj.host)
      },
      { timeout: 30000 },
    )
    // eslint-disable-next-line no-console
    console.log('✅ Authentication completed successfully')
  }

  // Verify authentication was successful before saving storage state
  const finalUrl = page.url()
  const finalUrlObj = new URL(finalUrl)
  const isNotMicrosoftLogin = finalUrlObj.host !== 'login.microsoftonline.com'
  const isTrustedHost = TRUSTED_HOSTS.includes(finalUrlObj.host)
  const isAuthenticated = isTrustedHost && isNotMicrosoftLogin

  if (isAuthenticated) {
    // eslint-disable-next-line no-console
    console.log('💾 Saving authenticated storage state')
    await page.context().storageState({ path: 'storageState.json' })
  } else {
    // eslint-disable-next-line no-console
    console.log('⚠️  WARNING: Not saving storage state - authentication not verified')
    // eslint-disable-next-line no-console
    console.log(`   Final URL: ${finalUrl}`)
    // eslint-disable-next-line no-console
    console.log('   Tests may fail due to missing authentication state')
  }

  await browser.close()
}
