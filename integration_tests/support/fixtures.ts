import { test as base, expect } from '@playwright/test'

// Enhanced logging interface for CI
interface EnhancedLogging {
  logNavigation: (url: string, action: string) => void
  logError: (error: string, context?: string) => void
  logConsoleMessage: (message: string, type: string) => void
}

// Extend the base test with enhanced logging fixtures
export const test = base.extend<{ enhancedLogging: EnhancedLogging }>({
  enhancedLogging: async ({ page }, use) => {
    const isCI = process.env.CI === 'true'
    const testName = test.info().title

    // Helper function to create timestamped log messages
    const logWithTimestamp = (message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') => {
      const timestamp = new Date().toISOString()
      const prefix = `[${level}] [${timestamp}] [${testName}]`

      if (isCI) {
        // In CI, use console.log for GitHub Actions to capture
        // eslint-disable-next-line no-console
        console.log(`${prefix} ${message}`)
      } else if (level === 'ERROR') {
        // eslint-disable-next-line no-console
        console.error(`${prefix} ${message}`)
      } else if (level === 'WARN') {
        // eslint-disable-next-line no-console
        console.warn(`${prefix} ${message}`)
      } else {
        // eslint-disable-next-line no-console
        console.log(`${prefix} ${message}`)
      }
    }

    // Set up page event listeners for comprehensive logging
    page.on('console', msg => {
      const type = msg.type()
      const text = msg.text()

      // Log all console messages from the page
      logWithTimestamp(`Console ${type.toUpperCase()}: ${text}`, type === 'error' ? 'ERROR' : 'INFO')

      // Capture console errors specifically
      if (type === 'error') {
        logWithTimestamp(`❌ Browser Console Error: ${text}`, 'ERROR')
      }
    })

    // Log page crashes
    page.on('pageerror', error => {
      logWithTimestamp(`❌ Page Error: ${error.message}`, 'ERROR')
      logWithTimestamp(`Stack trace: ${error.stack}`, 'ERROR')
    })

    // Log navigation events
    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) {
        logWithTimestamp(`🚀 Navigated to: ${frame.url()}`)
      }
    })

    // Log failed network requests
    page.on('requestfailed', request => {
      const failure = request.failure()
      logWithTimestamp(
        `❌ Network Request Failed: ${request.method()} ${request.url()} - ${failure?.errorText}`,
        'ERROR',
      )
    })

    // Log response errors (4xx, 5xx)
    page.on('response', response => {
      if (response.status() >= 400) {
        logWithTimestamp(
          `❌ HTTP Error Response: ${response.status()} ${response.statusText()} - ${response.url()}`,
          'ERROR',
        )
      }
    })

    // Enhanced logging interface
    const enhancedLogging: EnhancedLogging = {
      logNavigation: (url: string, action: string) => {
        logWithTimestamp(`🧭 Navigation ${action}: ${url}`)
      },

      logError: (error: string, context?: string) => {
        const message = context ? `${context}: ${error}` : error
        logWithTimestamp(`❌ ${message}`, 'ERROR')
      },

      logConsoleMessage: (message: string, type: string) => {
        logWithTimestamp(`💬 ${type}: ${message}`)
      },
    }

    // Log test start
    logWithTimestamp(`🏁 Test started: ${testName}`)

    await use(enhancedLogging)

    // Log test completion
    logWithTimestamp(`✅ Test completed: ${testName}`)
  },

  // Override the page fixture to include automatic error logging
  page: async ({ page: basePage, enhancedLogging }, use) => {
    // Wrap page.goto with enhanced error logging
    const originalGoto = basePage.goto.bind(basePage)
    const enhancedGoto = async (url: string, options?: Parameters<typeof originalGoto>[1]) => {
      enhancedLogging.logNavigation(url, 'attempting')

      try {
        const response = await originalGoto(url, options)
        enhancedLogging.logNavigation(url, 'successful')
        return response
      } catch (error) {
        enhancedLogging.logError(`Failed to navigate to ${url}: ${error.message}`, 'Navigation Error')
        throw error
      }
    }

    // Wrap page.waitForURL with enhanced logging
    const originalWaitForURL = basePage.waitForURL.bind(basePage)
    const enhancedWaitForURL = async (
      url: Parameters<typeof originalWaitForURL>[0],
      options?: Parameters<typeof originalWaitForURL>[1],
    ) => {
      enhancedLogging.logNavigation(url.toString(), 'waiting for URL')

      try {
        const result = await originalWaitForURL(url, options)
        enhancedLogging.logNavigation(basePage.url(), 'URL wait successful')
        return result
      } catch (error) {
        enhancedLogging.logError(`Timeout waiting for URL ${url}: ${error.message}`, 'URL Wait Error')
        throw error
      }
    }

    // Create a new page object with enhanced methods
    const enhancedPage = Object.create(basePage)
    enhancedPage.goto = enhancedGoto
    enhancedPage.waitForURL = enhancedWaitForURL

    await use(enhancedPage)
  },
})

export { expect }
