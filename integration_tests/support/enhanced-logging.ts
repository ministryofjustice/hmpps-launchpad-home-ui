import { Page, TestInfo } from '@playwright/test'

/**
 * Enhanced logging setup for CI debugging
 * This file provides functions to set up comprehensive logging for page events and navigation
 */

// Helper function to check if running in CI
export function isRunningInCI(): boolean {
  return process.env.CI === 'true'
}

// Function to set up enhanced logging for a page
export function setupEnhancedLogging(page: Page, testInfo: TestInfo) {
  const isCI = process.env.CI === 'true'
  const testName = testInfo.title

  // Helper function for consistent logging format
  const log = (message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') => {
    const timestamp = new Date().toISOString()
    const prefix = `[PLAYWRIGHT-${level}] [${timestamp}] [${testName}]`

    if (isCI) {
      // eslint-disable-next-line no-console
      console.log(`${prefix} ${message}`)
    } else if (level === 'ERROR') {
      // eslint-disable-next-line no-console
      console.error(`${prefix} ${message}`)
    } else {
      // eslint-disable-next-line no-console
      console.log(`${prefix} ${message}`)
    }
  }

  // Log test start with full context
  log(`🏁 Starting test: ${testName}`)
  log(`📍 Test file: ${testInfo.file}`)
  log(`🌐 Base URL: ${process.env.BASE_URL || 'http://localhost:3000'}`)
  log(`🔧 CI Environment: ${isCI ? 'Yes' : 'No'}`)
  log(`🎯 Project: ${testInfo.project.name}`)

  // Enhanced page event logging
  page.on('console', msg => {
    const type = msg.type()
    const text = msg.text()
    const location = msg.location()

    // Log all console messages with location info
    const locationInfo = location.url ? ` (${location.url}:${location.lineNumber}:${location.columnNumber})` : ''
    log(`💬 Browser Console [${type.toUpperCase()}]: ${text}${locationInfo}`, type === 'error' ? 'ERROR' : 'INFO')
  })

  // Log page errors with full stack traces
  page.on('pageerror', error => {
    log(`❌ Page JavaScript Error: ${error.message}`, 'ERROR')
    if (error.stack) {
      log(`📚 Stack trace: ${error.stack}`, 'ERROR')
    }
  })

  // Log all navigation attempts
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      log(`🚀 Page navigated to: ${frame.url()}`)
    }
  })

  // Log failed requests with detailed information
  page.on('requestfailed', request => {
    const failure = request.failure()
    const method = request.method()
    const url = request.url()
    const resourceType = request.resourceType()

    log(`❌ Request Failed: ${method} ${url} [${resourceType}]`, 'ERROR')
    if (failure) {
      log(`   └─ Error: ${failure.errorText}`, 'ERROR')
    }
  })

  // Log HTTP error responses
  page.on('response', response => {
    const status = response.status()
    const url = response.url()
    const method = response.request().method()

    if (status >= 400) {
      log(`❌ HTTP Error: ${status} ${response.statusText()} - ${method} ${url}`, 'ERROR')

      // Log response headers for debugging
      const headers = response.headers()
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase().includes('error') || key.toLowerCase().includes('message')) {
          log(`   └─ Header ${key}: ${value}`, 'ERROR')
        }
      })
    }
  })

  // Log dialog events (alerts, confirms, etc.)
  page.on('dialog', dialog => {
    log(`🗨️  Dialog appeared: ${dialog.type()} - "${dialog.message()}"`, 'WARN')
  })

  // Log when page crashes or closes unexpectedly
  page.on('crash', () => {
    log(`💥 Page crashed!`, 'ERROR')
  })

  page.on('close', () => {
    log(`🚪 Page closed`)
  })

  // Set up request/response logging for API calls
  page.route('**/*', async (route, request) => {
    const url = request.url()
    const method = request.method()

    // Log API requests (exclude assets)
    if (url.includes('/api/') || url.includes('/ping') || url.includes('/health')) {
      log(`📡 API Request: ${method} ${url}`)
    }

    // Continue with the request
    await route.continue()
  })

  // Add initial page state logging
  log(`📄 Initial page URL: ${page.url()}`)

  // Log viewport size
  const viewportSize = page.viewportSize()
  if (viewportSize) {
    log(`📐 Viewport: ${viewportSize.width}x${viewportSize.height}`)
  }

  return {
    log,
    async logFinalState() {
      // Log final page state
      try {
        const finalUrl = page.url()
        log(`📍 Final page URL: ${finalUrl}`)

        // Log page title if available
        const title = await page.title().catch(() => 'Unknown')
        log(`📝 Final page title: "${title}"`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        log(`⚠️  Could not get final page state: ${errorMessage}`, 'WARN')
      }

      // Log test completion with status
      let statusEmoji = '⏭️ '
      const { status } = testInfo
      if (status === 'passed') {
        statusEmoji = '✅'
      } else if (status === 'failed') {
        statusEmoji = '❌'
      }
      log(`${statusEmoji} Test ${status}: ${testName}`)

      // Log duration
      const { duration } = testInfo
      log(`⏱️  Test duration: ${duration}ms`)

      // If test failed, log additional debugging information
      if (status === 'failed' && testInfo.errors.length > 0) {
        log(`🔍 Test failed with ${testInfo.errors.length} error(s):`, 'ERROR')
        testInfo.errors.forEach((error, index) => {
          log(`   Error ${index + 1}: ${error.message}`, 'ERROR')
          if (error.stack) {
            // Log first few lines of stack trace
            const stackLines = error.stack.split('\n').slice(0, 5).join('\n')
            log(`   Stack: ${stackLines}`, 'ERROR')
          }
        })
      }

      // Log attachments if any were created
      if (testInfo.attachments.length > 0) {
        log(`📎 Test attachments: ${testInfo.attachments.length}`)
        testInfo.attachments.forEach((attachment, index) => {
          log(`   ${index + 1}. ${attachment.name} (${attachment.contentType})`)
        })
      }
    },
  }
}
