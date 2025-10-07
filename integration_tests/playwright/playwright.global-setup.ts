import { chromium } from '@playwright/test'
import auth from './test/mockApis/auth'
import tokenVerification from './test/mockApis/tokenVerification'

export default async function globalSetup() {
  // eslint-disable-next-line no-console
  console.log('🎭 Initializing basic WireMock stubs for CI...')

  await auth.stubAuthPing()
  await auth.stubSignIn()
  await auth.stubAuthUser()
  await tokenVerification.stubTokenVerificationPing()
  await tokenVerification.stubVerifyToken()

  const baseURL = 'http://127.0.0.1:3000'

  const browser = await chromium.launch()
  const page = await browser.newPage()

  // eslint-disable-next-line no-console
  console.log(`=== Playwright Environment Setup ===`)
  // eslint-disable-next-line no-console
  console.log(`🔐 MS_USERNAME: ${process.env.MS_USERNAME ? 'set ✅' : 'not set ❌'}`)
  // eslint-disable-next-line no-console
  console.log(`🔐 MS_PASSWORD: ${process.env.MS_PASSWORD ? 'set ✅' : 'not set ❌'}`)

  // eslint-disable-next-line no-console
  console.log(`🔍 Exact URL being navigated to: "${baseURL}"`)

  try {
    page.on('response', response => {
      if (response.status() >= 300 && response.status() < 400) {
        // eslint-disable-next-line no-console
        console.log(`Redirect: ${response.status()} from ${response.url()}`)
        const location = response.headers().location || 'No location header'
        // eslint-disable-next-line no-console
        console.log(`  -> Location: ${location}`)
      } else {
        // eslint-disable-next-line no-console
        console.log(`Final response: ${response.status()} - ${response.url()}`)
      }
    })

    await page.goto(baseURL, { timeout: 30000 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`❌ Navigation failed: ${error.message}`)
    // eslint-disable-next-line no-console
    console.log(`🔍 Failed URL was: "${baseURL}"`)

    throw error
  }
  throw Error('do not pass')
  // Try to get current page URL and title even on failure
  try {
    const failedUrl = page.url()
    const failedTitle = await page.title()
    // eslint-disable-next-line no-console
    console.log(`🔍 Page URL after failure: "${failedUrl}"`)
    // eslint-disable-next-line no-console
    console.log(`🔍 Page title after failure: "${failedTitle}"`)

    // NEW: Capture page content to see what's actually being served
    try {
      const pageContent = await page.content()
      const bodyText = await page.textContent('body').catch(() => 'Could not extract body text')

      // eslint-disable-next-line no-console
      console.log(`🔍 Page content analysis:`)
      // eslint-disable-next-line no-console
      console.log(`   - Content length: ${pageContent.length} characters`)
      // eslint-disable-next-line no-console
      console.log(`   - Body text preview: ${bodyText.substring(0, 300)}...`)

      // Check for common error patterns
      if (pageContent.includes('Cannot GET')) {
        // eslint-disable-next-line no-console
        console.log(`❌ DETECTED: Express.js "Cannot GET" error - route not found`)
      } else if (pageContent.includes('ERR_CONNECTION_REFUSED')) {
        // eslint-disable-next-line no-console
        console.log(`❌ DETECTED: Connection refused error`)
      } else if (pageContent.includes('ENOTFOUND') || pageContent.includes('DNS')) {
        // eslint-disable-next-line no-console
        console.log(`❌ DETECTED: DNS resolution failure`)
      } else if (pageContent.includes('timeout')) {
        // eslint-disable-next-line no-console
        console.log(`❌ DETECTED: Timeout error`)
      } else if (pageContent.includes('500') || pageContent.includes('Internal Server Error')) {
        // eslint-disable-next-line no-console
        console.log(`❌ DETECTED: Server error (500)`)
      } else if (pageContent.length < 100) {
        // eslint-disable-next-line no-console
        console.log(`❌ DETECTED: Very short response - likely error page`)
      } else {
        // eslint-disable-next-line no-console
        console.log(`🔍 Page loaded but navigation failed - content looks normal`)
      }
    } catch (contentError) {
      // eslint-disable-next-line no-console
      console.log(`⚠️ Could not capture page content: ${contentError.message}`)
    }
  } catch (pageInfoError) {
    // eslint-disable-next-line no-console
    console.log(`⚠️ Could not get page info: ${pageInfoError.message}`)
  }

  // Additional debugging for CI
  // eslint-disable-next-line no-console
  console.log(`🔍 Debugging navigation failure:`)

  const currentUrl = page.url()

  // Enhanced page detection and diagnostics
  const loginFormExists = (await page.locator('input#i0116').count()) > 0
  const currentUrlObj = new URL(currentUrl)
  const isLaunchpadPage = currentUrlObj.host !== 'login.microsoftonline.com'
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
      // Check for error conditions even on trusted hosts
      if (
        pageTitle.toLowerCase().includes('403') ||
        pageTitle.toLowerCase().includes('forbidden') ||
        pageTitle.toLowerCase().includes('error')
      ) {
        // eslint-disable-next-line no-console
        console.log('❌ ERROR: Access denied on trusted host - authentication may have failed')
        // eslint-disable-next-line no-console
        console.log('   🚨 This indicates a firewall, permission, or authentication issue')
      } else {
        // eslint-disable-next-line no-console
        console.log('🎯 Already authenticated - landed directly on Launchpad portal')
      }
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
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.log('Microsoft login form not found. Page content:')
      // eslint-disable-next-line no-console
      console.log(await page.textContent('body'))
      // eslint-disable-next-line no-console
      console.log('Original error:', _error.message)
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
        return urlObj.host === '127.0.0.1'
      },
      { timeout: 30000 },
    )
    // eslint-disable-next-line no-console
    console.log('✅ Authentication completed successfully')
  }

  // Verify authentication was successful before saving storage state
  const finalUrl = page.url()
  const finalUrlObj = new URL(finalUrl)
  const finalPageTitle = await page.title()

  const isNotMicrosoftLogin = finalUrlObj.host !== 'login.microsoftonline.com'
  const isTrustedHost = finalUrlObj.host === '127.0.0.1'

  // Check for error conditions that indicate failed authentication
  const hasErrorTitle =
    finalPageTitle.toLowerCase().includes('403') ||
    finalPageTitle.toLowerCase().includes('forbidden') ||
    finalPageTitle.toLowerCase().includes('access denied') ||
    finalPageTitle.toLowerCase().includes('unauthorized') ||
    finalPageTitle.toLowerCase().includes('error')

  const isAuthenticated = isTrustedHost && isNotMicrosoftLogin && !hasErrorTitle

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
    console.log(`   Final Page Title: "${finalPageTitle}"`)

    if (hasErrorTitle) {
      // eslint-disable-next-line no-console
      console.log('   🚨 ERROR PAGE DETECTED: Access denied or authentication failed')
      // eslint-disable-next-line no-console
      console.log('   🔍 Possible causes:')
      // eslint-disable-next-line no-console
      console.log('      - Firewall blocking access after authentication')
      // eslint-disable-next-line no-console
      console.log('      - Insufficient permissions for authenticated user')
      // eslint-disable-next-line no-console
      console.log('      - Service temporarily unavailable')
    } else {
      // eslint-disable-next-line no-console
      console.log('   Tests may fail due to missing authentication state')
    }
  }

  await browser.close()
}
