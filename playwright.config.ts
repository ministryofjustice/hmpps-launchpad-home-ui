/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

// Determine the base URL based on the context
// Use 127.0.0.1 in CI for DNS reliability, localhost for development
let configBaseURL = process.env.INGRESS_URL || (process.env.CI ? 'http://127.0.0.1:3000' : 'http://localhost:3000')

// Validate base URL format
if (!configBaseURL.startsWith('http://') && !configBaseURL.startsWith('https://')) {
  configBaseURL = `http://${configBaseURL}`
}

// Log configuration info for debugging (only in CI or when DEBUG is set)
if (process.env.CI || process.env.DEBUG) {
  // eslint-disable-next-line no-console
  console.log(`🎯 Playwright configured with base URL: ${configBaseURL}`)
  // eslint-disable-next-line no-console
  console.log(`🌍 Environment: ${process.env.TEST_ENV || 'default (local)'}`)
  // eslint-disable-next-line no-console
  console.log(`🔧 CI Mode: ${process.env.CI ? 'enabled' : 'disabled'}`)
}

export default defineConfig({
  workers: 1, // Always use 1 worker to avoid race conditions and ensure shared state
  fullyParallel: false, // Disable parallel execution to maintain service stability
  globalSetup: path.resolve(__dirname, 'integration_tests/support/playwright.global-setup.js'),
  globalTeardown: path.resolve(__dirname, 'integration_tests/support/playwright.global-teardown.js'),

  outputDir: 'integration_tests/screenshots',

  use: {
    storageState: 'storageState.json',
    baseURL: configBaseURL,
    headless: true,
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
      size: { width: 640, height: 480 },
    },
    actionTimeout: 30000,
    navigationTimeout: 60000, // Increased timeout for slower CI environments
    trace: 'retain-on-failure',
    // Browser launch options for CI environments
    launchOptions: process.env.CI ? {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--enable-local-file-accesses',
        '--allow-running-insecure-content',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    } : undefined,
  },

  timeout: 60000,
  retries: process.env.CI ? 3 : 1, // Fewer retries locally to avoid overwhelming the app

  reporter: [
    ['html', { open: 'never', outputFolder: 'integration_tests/videos' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  testDir: './integration_tests/playwright/test/Features/e2e',

  projects: [
    {
      name: 'default-tests',
      testDir: './integration_tests/playwright/test/Features/e2e',
    },
    {
      name: 'healthcheck',
      testDir: './integration_tests/e2e',
      testMatch: '**/*.{js,jsx,ts,tsx}',
      timeout: 60000,
    },
  ],
})
