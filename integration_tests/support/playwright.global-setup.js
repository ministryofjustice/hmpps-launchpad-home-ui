const { chromium } = require('@playwright/test')
const fs = require('fs')

module.exports = async function globalSetup() {
  // 🏗️  CI Service Startup Script
  // ===============================
  // eslint-disable-next-line no-console
  console.log('🚀 Starting CI service health checks...')

  // Enhanced CI Environment Debugging
  // eslint-disable-next-line no-console
  console.log('=== CI Environment Debug Information ===')
  // eslint-disable-next-line no-console
  console.log(`🖥️  CI: ${process.env.CI || 'false'}`)
  // eslint-disable-next-line no-console
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`)
  // eslint-disable-next-line no-console
  console.log(`🔧 TEST_ENV: ${process.env.TEST_ENV || 'undefined'}`)
  // eslint-disable-next-line no-console
  console.log(`📍 Working Directory: ${process.cwd()}`)
  // eslint-disable-next-line no-console
  console.log(`🏠 HOME: ${process.env.HOME || 'undefined'}`)
  // eslint-disable-next-line no-console
  console.log(`🌐 HOSTNAME: ${process.env.HOSTNAME || 'undefined'}`)
  // eslint-disable-next-line no-console
  console.log(`🐳 DOCKER: ${process.env.DOCKER ? 'true' : 'false'}`)
  // eslint-disable-next-line no-console
  console.log('=============================================')
  // eslint-disable-next-line no-console
  console.log('🔍 Checking WireMock...')

  // Wait for WireMock to be ready
  const maxAttempts = 15
  let attempts = 0
  let wiremockReady = false

  while (attempts < maxAttempts && !wiremockReady) {
    attempts += 1
    // eslint-disable-next-line no-console
    console.log(`⏳ Waiting for WireMock (attempt ${attempts}/${maxAttempts})...`)

    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch('http://localhost:9091/__admin/mappings')
      if (response.ok) {
        wiremockReady = true
        // eslint-disable-next-line no-console
        console.log(`✅ WireMock is ready after ${attempts} attempts`)
      }
      // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      // WireMock not ready yet, continue waiting
      if (attempts < maxAttempts) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => {
          setTimeout(resolve, 3000) // Wait 3 seconds to match working script
        })
      }
    }
  }

  if (!wiremockReady) {
    // eslint-disable-next-line no-console
    console.log('❌ WireMock failed to start after maximum attempts')
    throw new Error('WireMock service is not available')
  }

  // eslint-disable-next-line no-console
  console.log('🎭 Initializing basic WireMock stubs for CI...')

  try {
    // Try multiple possible paths for the compiled modules
    let auth
    let tokenVerification

    try {
      // eslint-disable-next-line global-require, import/extensions
      auth = require('../../dist/integration_tests/mockApis/auth.js')
      // eslint-disable-next-line global-require, import/extensions
      tokenVerification = require('../../dist/integration_tests/mockApis/tokenVerification.js')
    } catch (distError) {
      try {
        // Fallback to source files
        // eslint-disable-next-line global-require, import/extensions
        auth = require('../mockApis/auth.ts')
        // eslint-disable-next-line global-require, import/extensions
        tokenVerification = require('../mockApis/tokenVerification.ts')
      } catch (srcError) {
        throw new Error(
          `Cannot find auth modules. Tried dist and src paths. Dist error: ${distError.message}, Src error: ${srcError.message}`,
        )
      }
    }

    await auth.default.stubSignIn()
    await auth.default.stubAuthUser()
    await auth.default.stubAuthPing()
    await tokenVerification.default.stubVerifyToken()
    await tokenVerification.default.stubTokenVerificationPing()

    // eslint-disable-next-line no-console
    console.log('✅ Basic WireMock stubs initialized')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('⚠️ WireMock stub initialization failed:', error.message)
    // eslint-disable-next-line no-console
    console.log('⚠️ Continuing without custom stubs - using basic HTTP stubs only')
  }

  // eslint-disable-next-line no-console
  console.log('⏳ Allowing WireMock stubs to propagate...')
  await new Promise(resolve => {
    setTimeout(resolve, 1000) // Wait 1 second for propagation
  })

  // eslint-disable-next-line no-console
  console.log('🎉 WireMock is ready with authentication stubs!')
  // eslint-disable-next-line no-console
  console.log('🎯 Ready for Node.js application startup')
  // eslint-disable-next-line no-console
  console.log('===============================')
  // eslint-disable-next-line no-console
  console.log('✅ Services and stubs initialized successfully')
  // eslint-disable-next-line no-console
  console.log('')

  // Wait for application to start
  // eslint-disable-next-line no-console
  console.log('⏳ Waiting for application to start...')

  const maxAppAttempts = 15
  let appAttempts = 0
  let appReady = false

  while (appAttempts < maxAppAttempts && !appReady) {
    appAttempts += 1
    // eslint-disable-next-line no-console
    console.log(`⏳ Waiting for app health check (attempt ${appAttempts}/${maxAppAttempts})...`)

    try {
      // Use 127.0.0.1 for consistency with service URLs in CI
      const healthUrl = process.env.CI ? 'http://127.0.0.1:3000/health' : 'http://localhost:3000/health'
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(healthUrl)
      if (response.ok) {
        appReady = true
        // eslint-disable-next-line no-console
        console.log(`✅ Application health check passed after ${appAttempts} attempts (using ${healthUrl})`)

        // Extra wait to ensure app is fully stable after health check
        // eslint-disable-next-line no-console
        console.log(`⏳ Waiting additional 3 seconds for app stabilization...`)
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => {
          setTimeout(resolve, 3000)
        })
      }
      // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      // App not ready yet, continue waiting
      if (appAttempts < maxAppAttempts) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => {
          setTimeout(resolve, 2000) // Wait 2 seconds
        })
      }
    }
  }

  if (!appReady) {
    // eslint-disable-next-line no-console
    console.log('❌ Application failed to start after maximum attempts')
    throw new Error('Application is not responding to health checks')
  }

  // Generate trusted hostnames from environment variables for security
  const getTrustedHosts = () => {
    // Use 127.0.0.1 in CI for consistency, localhost for development
    const hosts = process.env.CI ? ['127.0.0.1:3000'] : ['localhost:3000']

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
    // Use 127.0.0.1 in CI for DNS consistency, localhost for development
    const defaultUrl = process.env.CI ? 'http://127.0.0.1:3000' : 'http://localhost:3000'
    
    switch (env) {
      case 'test':
        return process.env.TEST_INGRESS_URL || defaultUrl
      case 'dev':
        return process.env.DEV_INGRESS_URL || defaultUrl
      case 'staging':
        return process.env.STAGING_INGRESS_URL || defaultUrl
      case 'preprod':
        return process.env.PREPROD_INGRESS_URL || defaultUrl
      case 'prod':
        return process.env.PROD_INGRESS_URL || defaultUrl
      default:
        return process.env.INGRESS_URL || defaultUrl
    }
  }

  // Dynamic localhost detection function using Playwright's page
  const detectLocalhost = async browser => {
    // eslint-disable-next-line no-console
    console.log('🔍 Dynamically detecting localhost...')

    // Test common ports
    const ports = [3000, 3001, 3002, 8080, 8081]

    // Test each port sequentially using reduce to avoid await-in-loop
    const result = await ports.reduce(async (previousPromise, port) => {
      const foundUrl = await previousPromise
      if (foundUrl) return foundUrl // Already found a working port

      // Use 127.0.0.1 in CI for DNS consistency, localhost for development
      const hostname = process.env.CI ? '127.0.0.1' : 'localhost'
      const testUrl = `http://${hostname}:${port}`
      const testPage = await browser.newPage()

      try {
        // Test health endpoint first
        // eslint-disable-next-line no-console
        console.log(`🔍 Testing port ${port}...`)
        await testPage.goto(`${testUrl}/health`, { timeout: 3000 })
        // eslint-disable-next-line no-console
        console.log(`✅ Found app on port ${port} (health check)`)
        await testPage.close()
        return testUrl
        // eslint-disable-next-line no-unused-vars
      } catch (_healthError) {
        // Health endpoint failed, try homepage
        try {
          await testPage.goto(testUrl, { timeout: 3000 })
          // eslint-disable-next-line no-console
          console.log(`✅ Found app on port ${port} (homepage)`)
          await testPage.close()
          return testUrl
          // eslint-disable-next-line no-unused-vars
        } catch (_homeError) {
          // eslint-disable-next-line no-console
          console.log(`❌ Port ${port}: not available`)
          await testPage.close()
          return null
        }
      }
    }, Promise.resolve(null))

    if (result) {
      return result
    }

    // Use 127.0.0.1 in CI for DNS consistency, localhost for development
    const defaultUrl = process.env.CI ? 'http://127.0.0.1:3000' : 'http://localhost:3000'
    // eslint-disable-next-line no-console
    console.log(`⚠️  No running app detected, defaulting to ${defaultUrl}`)
    return defaultUrl
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

  // Determine base URL with priority: TEST_ENV > dynamic localhost detection
  let baseURL

  if (process.env.TEST_ENV && process.env.TEST_ENV !== 'test') {
    baseURL = getEnvironmentUrl(process.env.TEST_ENV)
  } else {
    // For test environment or no TEST_ENV, use dynamic detection
    baseURL = await detectLocalhost(browser)
  }

  const page = await browser.newPage()

  // Final health check right before navigation
  // eslint-disable-next-line no-console
  console.log(`🔍 Final health check before navigation...`)
  try {
    // Use 127.0.0.1 in CI for consistency with service URLs
    const finalHealthUrl = process.env.CI ? 'http://127.0.0.1:3000/health' : 'http://localhost:3000/health'
    const finalHealthCheck = await fetch(finalHealthUrl)
    if (finalHealthCheck.ok) {
      // eslint-disable-next-line no-console
      console.log(`✅ App still healthy immediately before navigation (using ${finalHealthUrl})`)
    } else {
      // eslint-disable-next-line no-console
      console.log(`⚠️ App health check returned ${finalHealthCheck.status} (using ${finalHealthUrl})`)
    }
  } catch (finalError) {
    // eslint-disable-next-line no-console
    console.log(`❌ Final health check failed: ${finalError.message}`)
  }

  // eslint-disable-next-line no-console
  console.log(`🚀 Navigating to: ${baseURL}`)
  // eslint-disable-next-line no-console
  console.log(`🔍 Exact URL being navigated to: "${baseURL}"`)

  try {
    await page.goto(`${baseURL}`, { timeout: 30000 })

    // Wait for the page to load and check what we actually got
    await page.waitForLoadState('networkidle')
    const currentUrl = page.url()
    const pageTitle = await page.title()

    // eslint-disable-next-line no-console
    console.log(`✅ Successfully navigated to: ${currentUrl}`)
    // eslint-disable-next-line no-console
    console.log(`🔍 Page title: "${pageTitle}"`)
    // eslint-disable-next-line no-console
    console.log(`🔍 URL comparison - Expected: "${baseURL}", Actual: "${currentUrl}"`)

    // Parse and show URL components
    try {
      const urlObj = new URL(currentUrl)
      // eslint-disable-next-line no-console
      console.log(`🔍 Final URL breakdown:`)
      // eslint-disable-next-line no-console
      console.log(`   - Protocol: ${urlObj.protocol}`)
      // eslint-disable-next-line no-console
      console.log(`   - Host: ${urlObj.host}`)
      // eslint-disable-next-line no-console
      console.log(`   - Pathname: ${urlObj.pathname}`)
      // eslint-disable-next-line no-console
      console.log(`   - Search: ${urlObj.search || '(none)'}`)
      // eslint-disable-next-line no-console
      console.log(`   - Hash: ${urlObj.hash || '(none)'}`)
    } catch (urlParseError) {
      // eslint-disable-next-line no-console
      console.log(`⚠️ Could not parse final URL: ${urlParseError.message}`)
    }

    // Capture success screenshot for CI verification
    if (process.env.CI) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const screenshotPath = `integration_tests/screenshots/ci-navigation-success-${timestamp}.png`
        await page.screenshot({ path: screenshotPath, fullPage: true })
        // eslint-disable-next-line no-console
        console.log(`📸 Success screenshot saved to: ${screenshotPath}`)
      } catch (screenshotError) {
        // eslint-disable-next-line no-console
        console.log(`⚠️ Could not capture success screenshot: ${screenshotError.message}`)
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`❌ Navigation failed: ${error.message}`)
    // eslint-disable-next-line no-console
    console.log(`🔍 Failed URL was: "${baseURL}"`)

    // Capture screenshot on failure for CI debugging
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const screenshotPath = `integration_tests/screenshots/ci-navigation-failure-${timestamp}.png`
      await page.screenshot({ path: screenshotPath, fullPage: true })
      // eslint-disable-next-line no-console
      console.log(`📸 Screenshot saved to: ${screenshotPath}`)
    } catch (screenshotError) {
      // eslint-disable-next-line no-console
      console.log(`⚠️ Could not capture screenshot: ${screenshotError.message}`)
    }

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

        // Save page HTML for detailed analysis
        if (process.env.CI) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
          const htmlPath = `integration_tests/screenshots/ci-page-content-${timestamp}.html`
          fs.writeFileSync(htmlPath, pageContent)
          // eslint-disable-next-line no-console
          console.log(`📄 Page HTML saved to: ${htmlPath}`)
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

    // Test multiple URL variations
    const urlsToTest = [baseURL, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://0.0.0.0:3000']

    for (const testUrl of urlsToTest) {
      if (testUrl !== baseURL) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const testPage = await browser.newPage()
          // eslint-disable-next-line no-console
          console.log(`🔍 Testing URL: "${testUrl}"`)
          // eslint-disable-next-line no-await-in-loop
          await testPage.goto(testUrl, { timeout: 5000 })
          // eslint-disable-next-line no-console
          console.log(`✅ "${testUrl}" is accessible from browser`)
          // eslint-disable-next-line no-await-in-loop
          await testPage.close()
          break // Found a working URL
        } catch (testError) {
          // eslint-disable-next-line no-console
          console.log(`❌ "${testUrl}" failed: ${testError.message}`)
        }
      }
    }

    // Test health endpoint specifically
    try {
      const healthPage = await browser.newPage()
      // eslint-disable-next-line no-console
      console.log(`🔍 Testing health endpoint: "${baseURL}/health"`)
      await healthPage.goto(`${baseURL}/health`, { timeout: 10000 })
      const healthContent = await healthPage.textContent('body')
      // eslint-disable-next-line no-console
      console.log(`✅ Health endpoint accessible from browser context`)
      // eslint-disable-next-line no-console
      console.log(`🔍 Health response preview: ${healthContent.substring(0, 200)}...`)
      await healthPage.close()
    } catch (healthError) {
      // eslint-disable-next-line no-console
      console.log(`❌ Health endpoint also not accessible from browser: ${healthError.message}`)
    }

    // Check if the app is using 127.0.0.1 vs 0.0.0.0 binding
    // eslint-disable-next-line no-console
    console.log(`🔍 Possible causes:`)
    // eslint-disable-next-line no-console
    console.log(`   - App bound to 127.0.0.1 instead of 0.0.0.0 (CI containers need 0.0.0.0)`)
    // eslint-disable-next-line no-console
    console.log(`   - Port 3000 not exposed in CI container`)
    // eslint-disable-next-line no-console
    console.log(`   - App process terminated between health check and navigation`)
    // eslint-disable-next-line no-console
    console.log(`   - Network policy blocking browser access vs curl access`)
    // eslint-disable-next-line no-console
    console.log(`   - Browser security policy preventing localhost access`)

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
  const finalPageTitle = await page.title()

  const isNotMicrosoftLogin = finalUrlObj.host !== 'login.microsoftonline.com'
  const isTrustedHost = TRUSTED_HOSTS.includes(finalUrlObj.host)

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
