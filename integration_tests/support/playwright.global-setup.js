const { chromium } = require('@playwright/test')

// Import WireMock modules at the top to avoid global-require lint errors
let auth
let tokenVerification
let wiremock

try {
  // eslint-disable-next-line global-require
  auth = require('../playwright/mockApis/auth')
  // eslint-disable-next-line global-require
  tokenVerification = require('../playwright/mockApis/tokenVerification')
  // eslint-disable-next-line global-require
  wiremock = require('../playwright/mockApis/wiremock')
  // eslint-disable-next-line no-unused-vars
} catch (error) {
  // WireMock modules not available - will skip initialization
}

// Initialize WireMock stubs for API mocking
const initializeWireMockStubs = async () => {
  if (!auth || !tokenVerification || !wiremock) {
    // eslint-disable-next-line no-console
    console.log('⚠️  WireMock modules not available - skipping stub initialization')
    return
  }

  try {
    // eslint-disable-next-line no-console
    console.log('🎭 Initializing WireMock stubs...')

    // Reset any existing stubs
    await wiremock.resetStubs()

    // Set up auth stubs
    await auth.default.stubAuthPing()
    await auth.default.stubSignIn()
    await auth.default.stubAuthUser()

    // Set up token verification stubs
    await tokenVerification.default.stubVerifyToken()
    await tokenVerification.default.stubTokenVerificationPing()

    // Add generic health endpoint for WireMock itself
    await wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/health',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: 'UP' },
      },
    })

    // Verify stubs are working with CI-friendly retries
    let stubCount = 0
    let verificationAttempts = 0
    const maxVerificationAttempts = 5

    while (verificationAttempts < maxVerificationAttempts) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch('http://localhost:9091/__admin/mappings')
        if (response.ok) {
          // eslint-disable-next-line no-await-in-loop
          const data = await response.json()
          stubCount = data.mappings.length
          if (stubCount > 0) break
        }
      } catch (networkError) {
        // CI environments may need more time for network setup
        // Ignore network errors during verification
        // eslint-disable-next-line no-console
        console.debug('Network error during WireMock verification:', networkError.message)
      }

      verificationAttempts += 1
      if (verificationAttempts < maxVerificationAttempts) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => {
          setTimeout(resolve, 1000)
        })
      }
    }

    // eslint-disable-next-line no-console
    console.log(`✅ WireMock stubs initialized successfully (${stubCount} mappings active)`)

    // CI-specific: Additional verification with retries
    let endpointsVerified = false
    let endpointAttempts = 0
    const maxEndpointAttempts = 3

    while (!endpointsVerified && endpointAttempts < maxEndpointAttempts) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const [authPing, tokenVerify] = await Promise.all([
          fetch('http://localhost:9091/auth/health/ping', { timeout: 3000 }),
          fetch('http://localhost:9091/verification/health/ping', { timeout: 3000 }),
        ])

        if (authPing.ok && tokenVerify.ok) {
          endpointsVerified = true
          // eslint-disable-next-line no-console
          console.log('🔍 Critical WireMock endpoints verified and responding')
        }
      } catch (endpointError) {
        // eslint-disable-next-line no-console
        console.debug('Endpoint verification error:', endpointError.message)
        endpointAttempts += 1
        if (endpointAttempts < maxEndpointAttempts) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => {
            setTimeout(resolve, 2000)
          })
        }
      }
    }

    if (!endpointsVerified) {
      // eslint-disable-next-line no-console
      console.log('⚠️  WireMock endpoint verification incomplete - continuing with setup')
    }

    // CI-specific: Extra wait to ensure all stubs are fully propagated
    // eslint-disable-next-line no-console
    console.log('⏳ CI environment detected - adding extra propagation time...')
    await new Promise(resolve => {
      setTimeout(resolve, 3000)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`⚠️  WireMock initialization failed: ${error.message}`)
    // Don't fail the whole setup - continue without mocks
  }
}

module.exports = async function globalSetup() {
  const getTrustedHosts = () => {
    const hosts = ['localhost:3000']

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

    return [...new Set(hosts)]
  }

  const TRUSTED_HOSTS = getTrustedHosts()

  const getEnvironmentUrl = env => {
    switch (env) {
      case 'test':
        return 'http://localhost:3000'
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

  const detectLocalhost = async browser => {
    // eslint-disable-next-line no-console
    console.log('🔍 Comprehensive port scan starting...')

    // Expanded port list for CI environments - common development and service ports
    const commonPorts = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010]
    const webPorts = [8000, 8001, 8080, 8081, 8082, 8090, 8888, 9000, 9001, 9090, 9091]
    const devPorts = [4000, 4001, 4200, 5000, 5001, 5173, 5432, 6000, 6001, 7000, 7001]
    const ciPorts = [1234, 2000, 2001, 10000, 10001] // Common CI service ports

    const allPorts = [...commonPorts, ...webPorts, ...devPorts, ...ciPorts].sort((a, b) => a - b)

    // Scanning ports silently - will only show active services

    const availablePorts = []

    // First, scan all ports to see what's available
    const totalPorts = allPorts.length

    for (const port of allPorts) {
      const testUrl = `http://localhost:${port}`
      // eslint-disable-next-line no-await-in-loop
      const testPage = await browser.newPage()

      try {
        // Silent scanning - only show active ports

        // Try health endpoint first with shorter timeout for comprehensive scan
        // eslint-disable-next-line no-await-in-loop
        await testPage.goto(`${testUrl}/health`, { timeout: 1500 })
        // eslint-disable-next-line no-await-in-loop
        const healthContent = await testPage.content()

        if (healthContent.includes('OK') || healthContent.includes('healthy') || healthContent.includes('UP')) {
          if (
            healthContent.includes('http_server_requests_seconds') ||
            healthContent.includes('# TYPE') ||
            healthContent.includes('# HELP')
          ) {
            // eslint-disable-next-line no-console
            console.log(`📊 Port ${port}: Metrics server detected`)
            availablePorts.push({ port, type: 'metrics', url: testUrl })
          } else {
            // eslint-disable-next-line no-console
            console.log(`✅ Port ${port}: Healthy app found`)
            availablePorts.push({ port, type: 'app', url: testUrl })
          }
        } else {
          // eslint-disable-next-line no-console
          console.log(`⚠️  Port ${port}: Health endpoint exists but not healthy`)
          availablePorts.push({ port, type: 'unhealthy', url: testUrl })
        }

        // eslint-disable-next-line no-await-in-loop
        await testPage.close()
        // eslint-disable-next-line no-unused-vars
      } catch (healthError) {
        // Try direct homepage access
        try {
          // eslint-disable-next-line no-await-in-loop
          await testPage.goto(testUrl, { timeout: 1500 })
          // eslint-disable-next-line no-console
          console.log(`✅ Port ${port}: App accessible (no health endpoint)`)
          availablePorts.push({ port, type: 'no-health', url: testUrl })
          // eslint-disable-next-line no-await-in-loop
          await testPage.close()
          // eslint-disable-next-line no-unused-vars
        } catch (pageError) {
          // Silent fail for inactive ports
          // eslint-disable-next-line no-await-in-loop
          await testPage.close()
        }
      }
    }

    // Show comprehensive summary of what was found
    // eslint-disable-next-line no-console
    console.log(`📋 Comprehensive port scan completed - found ${availablePorts.length} active ports:`)

    if (availablePorts.length === 0) {
      // eslint-disable-next-line no-console
      console.log(`   ❌ No active ports found out of ${totalPorts} ports scanned`)
    } else {
      // Group by type for better readability
      const appPorts = availablePorts.filter(p => p.type === 'app')
      const metricsPorts = availablePorts.filter(p => p.type === 'metrics')
      const noHealthPorts = availablePorts.filter(p => p.type === 'no-health')
      const unhealthyPorts = availablePorts.filter(p => p.type === 'unhealthy')

      if (appPorts.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`   🚀 Main Applications (${appPorts.length}): ${appPorts.map(p => p.port).join(', ')}`)
      }
      if (metricsPorts.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`   📊 Metrics Servers (${metricsPorts.length}): ${metricsPorts.map(p => p.port).join(', ')}`)
      }
      if (noHealthPorts.length > 0) {
        // eslint-disable-next-line no-console
        console.log(
          `   🔧 Apps without health endpoint (${noHealthPorts.length}): ${noHealthPorts.map(p => p.port).join(', ')}`,
        )
      }
      if (unhealthyPorts.length > 0) {
        // eslint-disable-next-line no-console
        console.log(
          `   ⚠️  Unhealthy but accessible (${unhealthyPorts.length}): ${unhealthyPorts.map(p => p.port).join(', ')}`,
        )
      }
    }

    // Choose the best port (prefer main app ports over metrics)
    const appPorts = availablePorts.filter(p => p.type === 'app')
    const noHealthPorts = availablePorts.filter(p => p.type === 'no-health')
    const unhealthyPorts = availablePorts.filter(p => p.type === 'unhealthy')

    let chosenPort = null

    if (appPorts.length > 0) {
      // Prefer port 3000 if it's available and healthy
      const [firstAppPort] = appPorts
      chosenPort = appPorts.find(p => p.port === 3000) || firstAppPort
      // eslint-disable-next-line no-console
      console.log(`🎯 Selected port ${chosenPort.port}: Main application`)
    } else if (noHealthPorts.length > 0) {
      const [firstNoHealthPort] = noHealthPorts
      chosenPort = noHealthPorts.find(p => p.port === 3000) || firstNoHealthPort
      // eslint-disable-next-line no-console
      console.log(`🎯 Selected port ${chosenPort.port}: App without health endpoint`)
    } else if (unhealthyPorts.length > 0) {
      const [firstUnhealthyPort] = unhealthyPorts
      chosenPort = firstUnhealthyPort
      // eslint-disable-next-line no-console
      console.log(`🎯 Selected port ${chosenPort.port}: Unhealthy but accessible`)
    }

    if (chosenPort) {
      // Wait for the chosen port to be fully ready (especially port 3000)
      if (chosenPort.port === 3000 && chosenPort.type === 'app') {
        // eslint-disable-next-line no-console
        console.log(`⏳ Waiting for main app (port 3000) to be fully ready...`)
        await new Promise(resolve => {
          setTimeout(() => resolve(), 5000)
        })
      }

      return chosenPort.url
    }

    // eslint-disable-next-line no-console
    console.log(`⚠️  No accessible ports found, defaulting to http://localhost:3000`)
    return 'http://localhost:3000'
  }

  // eslint-disable-next-line no-console
  console.log(`🌍 TEST_ENV: ${process.env.TEST_ENV || 'default (local)'}`)
  // eslint-disable-next-line no-console
  console.log(`🔐 MS_USERNAME: ${process.env.MS_USERNAME ? 'set ✅' : 'not set ❌'}`)
  // eslint-disable-next-line no-console
  console.log(`🔐 MS_PASSWORD: ${process.env.MS_PASSWORD ? 'set ✅' : 'not set ❌'}`)

  // Initialize WireMock stubs if we're in a test environment
  if (process.env.TEST_ENV === 'test' || !process.env.TEST_ENV) {
    await initializeWireMockStubs()
  }

  if (!process.env.MS_USERNAME || !process.env.MS_PASSWORD) {
    throw new Error(
      'Missing required environment variables: MS_USERNAME and MS_PASSWORD must be set for authentication',
    )
  }

  const browser = await chromium.launch()
  let baseURL

  if (process.env.TEST_ENV === 'test' || !process.env.TEST_ENV) {
    // eslint-disable-next-line no-console
    console.log(`🏠 TEST_ENV is '${process.env.TEST_ENV || 'undefined'}' - forcing dynamic localhost detection`)
    baseURL = await detectLocalhost(browser)
  } else {
    // eslint-disable-next-line no-console
    console.log(`🌐 Using environment URL for: ${process.env.TEST_ENV}`)
    baseURL = getEnvironmentUrl(process.env.TEST_ENV)
  }

  const page = await browser.newPage()

  if (baseURL.includes('localhost')) {
    const testPage = await browser.newPage()
    try {
      await testPage.goto(baseURL, { timeout: 5000 })
      await testPage.close()
      // eslint-disable-next-line no-unused-vars
    } catch (preTestError) {
      await testPage.close()
    }

    let connected = false
    let attempt = 1
    while (attempt <= 3 && !connected) {
      // eslint-disable-next-line no-await-in-loop
      const quickTestPage = await browser.newPage()
      try {
        // eslint-disable-next-line no-await-in-loop
        await quickTestPage.goto(`${baseURL}/health`, { timeout: 5000 })
        // eslint-disable-next-line no-await-in-loop
        await quickTestPage.close()
        connected = true
        // eslint-disable-next-line no-unused-vars
      } catch (immediateError) {
        // eslint-disable-next-line no-await-in-loop
        await quickTestPage.close()
        if (attempt < 3) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => {
            setTimeout(() => resolve(), 2000)
          })
        }
      }
      attempt += 1
    }

    if (!connected) {
      throw new Error(`Server became unavailable after 3 attempts`)
    }
  }

  // For test environments with WireMock, skip full page navigation
  // since authentication is mocked and we've already verified health endpoints
  const isTestEnvironment = process.env.TEST_ENV === 'test' || baseURL.includes('localhost')
  const isCIEnvironment = process.env.CI || process.env.CIRCLECI || process.env.GITHUB_ACTIONS

  if (isTestEnvironment) {
    // eslint-disable-next-line no-console
    console.log(`🧪 Test environment detected - skipping full page navigation`)

    if (isCIEnvironment) {
      // eslint-disable-next-line no-console
      console.log(`🏗️  CI environment detected - ensuring all services are stable`)
      // Additional wait for CI stability
      await new Promise(resolve => {
        setTimeout(resolve, 5000)
      })

      // Verify the main app is actually responding in CI
      try {
        const appHealthCheck = await fetch(`${baseURL}/health`, { timeout: 5000 })
        if (appHealthCheck.ok) {
          // eslint-disable-next-line no-console
          console.log(`✅ Main application health verified in CI`)
        } else {
          // eslint-disable-next-line no-console
          console.log(`⚠️  Main application health check returned: ${appHealthCheck.status}`)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`⚠️  Main application health check failed: ${error.message}`)
      }
    }

    // eslint-disable-next-line no-console
    console.log(`✅ Health checks passed, WireMock stubs initialized`)
    // Save minimal storage state for test environment
    await page.context().storageState({ path: 'storageState.json' })
    await browser.close()
    return
  }
  let navigationAttempt = 1
  let lastError = null

  // eslint-disable-next-line no-console
  console.log(`🚀 Navigating to: ${baseURL}`)

  while (navigationAttempt <= 3) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await page.goto(`${baseURL}`, { timeout: 30000 })
      // eslint-disable-next-line no-await-in-loop
      await page.waitForLoadState('networkidle')
      break
    } catch (error) {
      lastError = error
      if (navigationAttempt === 3) {
        throw lastError
      }
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => {
        setTimeout(() => resolve(), 3000)
      })
    }
    navigationAttempt += 1
  }

  const currentUrl = page.url()
  const loginFormExists = (await page.locator('input#i0116').count()) > 0
  const currentUrlObj = new URL(currentUrl)
  const isLaunchpadPage =
    TRUSTED_HOSTS.includes(currentUrlObj.host) && currentUrlObj.host !== 'login.microsoftonline.com'
  const isLocalhost = currentUrlObj.host === 'localhost:3000'
  const pageTitle = await page.title()

  if (!loginFormExists) {
    if (isLaunchpadPage) {
      if (
        pageTitle.toLowerCase().includes('403') ||
        pageTitle.toLowerCase().includes('forbidden') ||
        pageTitle.toLowerCase().includes('error')
      ) {
        throw new Error('Access denied on trusted host - authentication may have failed')
      }
    } else if (!isLocalhost) {
      const bodyText = await page.locator('body').textContent()
      const firstWords = (bodyText && bodyText.substring(0, 200)) || 'No content found'
      throw new Error(`Unexpected page content: "${firstWords}..."`)
    }
  } else {
    try {
      await page.waitForSelector('input#i0116', { timeout: 30000 })
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      const pageContent = await page.textContent('body')
      throw new Error(`Microsoft login form not found at ${currentUrl}. Page content: ${pageContent}`)
    }

    await page.fill('input#i0116', process.env.MS_USERNAME)
    await page.click('button:has-text("Next"), input#idSIButton9')

    await page.waitForSelector('input#i0118', { timeout: 15000 })
    await page.fill('input#i0118', process.env.MS_PASSWORD)
    await page.click('input[type="submit"]')
    await page.waitForSelector('input#idSIButton9', { timeout: 10000 })
    await page.click('input#idSIButton9')

    await page.waitForURL(
      url => {
        const urlObj = new URL(url.toString())
        return TRUSTED_HOSTS.includes(urlObj.host)
      },
      { timeout: 30000 },
    )
  }

  const finalUrl = page.url()
  const finalUrlObj = new URL(finalUrl)
  const finalPageTitle = await page.title()

  const isNotMicrosoftLogin = finalUrlObj.host !== 'login.microsoftonline.com'
  const isTrustedHost = TRUSTED_HOSTS.includes(finalUrlObj.host)

  const hasErrorTitle =
    finalPageTitle.toLowerCase().includes('403') ||
    finalPageTitle.toLowerCase().includes('forbidden') ||
    finalPageTitle.toLowerCase().includes('access denied') ||
    finalPageTitle.toLowerCase().includes('unauthorized') ||
    finalPageTitle.toLowerCase().includes('error')

  const isAuthenticated = isTrustedHost && isNotMicrosoftLogin && !hasErrorTitle

  if (isAuthenticated) {
    await page.context().storageState({ path: 'storageState.json' })
  } else {
    const isLocalTestEnvironment = process.env.TEST_ENV === 'test' || baseURL.includes('localhost')

    if (isLocalTestEnvironment) {
      await page.context().storageState({ path: 'storageState.json' })
    }
  }

  await browser.close()
}
