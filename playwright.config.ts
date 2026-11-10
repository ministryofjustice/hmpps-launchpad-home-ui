import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export default defineConfig({
  globalSetup: path.resolve(__dirname, 'integration_tests/support/playwright.global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'integration_tests/support/playwright.global-teardown.ts'),
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },
  timeout: 30000,
  fullyParallel: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0, // More retries in CI
  reporter:
    process.env.CI && process.env.PLAYWRIGHT_MERGE_REPORTS !== 'true'
      ? [
          ['blob', { outputDir: 'test_results/blob-report' }],
          ['list'],
          ['junit', { outputFile: 'test_results/junit.xml' }],
          ['github'],
        ]
      : [
          ['html', { open: 'never', outputFolder: 'test_results/playwright-report' }],
          ['list'],
          ['junit', { outputFile: 'test_results/junit.xml' }],
        ],
  outputDir: 'test_results/test-output',
  testDir: './integration_tests/playwright/test/Features/e2e',
})
