/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

// Environment URL mapping using environment variables (secure approach)
const getEnvironmentUrl = (env: string): string => {
  switch (env) {
    case 'test':
      return process.env.TEST_INGRESS_URL || 'http://localhost:3000'
    case 'dev':
      return process.env.DEV_INGRESS_URL || 'http://localhost:3000'
    case 'staging':
      return process.env.STAGING_INGRESS_URL || 'http://localhost:3000'
    default:
      return process.env.INGRESS_URL || 'http://localhost:3000'
  }
}

// Determine base URL with priority: TEST_ENV > INGRESS_URL > default localhost
let configBaseURL: string
if (process.env.TEST_ENV) {
  configBaseURL = getEnvironmentUrl(process.env.TEST_ENV)
} else {
  configBaseURL = process.env.INGRESS_URL || 'http://localhost:3000'
}

export default defineConfig({
  workers: 2,
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
    navigationTimeout: 30000,
  },

  timeout: 60000,
  retries: 1,

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
