import { test as base, expect } from '@playwright/test'
import { setupEnhancedLogging } from './enhanced-logging'

// Enhanced logging interface for CI
interface EnhancedLogging {
  logNavigation: (url: string, action: string) => void
  logError: (error: string, context?: string) => void
  logConsoleMessage: (message: string, type: string) => void
  logFinalState: () => Promise<void>
}

// Extend the base test with enhanced logging fixtures
export const test = base.extend<{ enhancedLogging: EnhancedLogging }>({
  enhancedLogging: async ({ page }, use, testInfo) => {
    // Set up enhanced logging using the external function
    const loggingSetup = setupEnhancedLogging(page, testInfo)

    // Enhanced logging interface that wraps the setup
    const enhancedLogging: EnhancedLogging = {
      logNavigation: (url: string, action: string) => {
        loggingSetup.log(`🧭 Navigation ${action}: ${url}`)
      },

      logError: (error: string, context?: string) => {
        const message = context ? `${context}: ${error}` : error
        loggingSetup.log(`❌ ${message}`, 'ERROR')
      },

      logConsoleMessage: (message: string, type: string) => {
        loggingSetup.log(`💬 ${type}: ${message}`)
      },

      logFinalState: loggingSetup.logFinalState,
    }

    await use(enhancedLogging)

    // Log final state when test completes
    await enhancedLogging.logFinalState()
  },
})

export { expect }
