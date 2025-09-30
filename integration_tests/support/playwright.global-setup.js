const { chromium } = require('@playwright/test')

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
    console.log('🔍 Scanning all localhost ports...')

    const ports = [3000, 3001, 3002, 8080, 8081]
    const availablePorts = []

    // First, scan all ports to see what's available
    for (const port of ports) {
      const testUrl = `http://localhost:${port}`
      // eslint-disable-next-line no-await-in-loop
      const testPage = await browser.newPage()

      try {
        // eslint-disable-next-line no-console
        console.log(`🔍 Scanning port ${port}...`)

        // Try health endpoint first
        // eslint-disable-next-line no-await-in-loop
        await testPage.goto(`${testUrl}/health`, { timeout: 3000 })
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
          await testPage.goto(testUrl, { timeout: 3000 })
          // eslint-disable-next-line no-console
          console.log(`✅ Port ${port}: App accessible (no health endpoint)`)
          availablePorts.push({ port, type: 'no-health', url: testUrl })
          // eslint-disable-next-line no-await-in-loop
          await testPage.close()
          // eslint-disable-next-line no-unused-vars
        } catch (pageError) {
          // eslint-disable-next-line no-console
          console.log(`❌ Port ${port}: Not accessible`)
          // eslint-disable-next-line no-await-in-loop
          await testPage.close()
        }
      }
    }

    // Show summary of what was found
    // eslint-disable-next-line no-console
    console.log(`📋 Port scan results:`)
    for (const portInfo of availablePorts) {
      // eslint-disable-next-line no-console
      console.log(`   Port ${portInfo.port}: ${portInfo.type}`)
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
    const isTestEnvironment = process.env.TEST_ENV === 'test' || baseURL.includes('localhost')

    if (isTestEnvironment) {
      await page.context().storageState({ path: 'storageState.json' })
    }
  }

  await browser.close()
}
