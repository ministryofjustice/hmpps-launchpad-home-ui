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
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  timeout: 30000,
  retries: process.env.CI ? 0 : 0, // More retries in CI
  // Grep configuration to control which tests to run
  // By default, @regression tests are skipped unless REGRESSION=true is set
  grep: process.env.REGRESSION === 'true' ? /@regression/ : undefined,
  grepInvert: process.env.REGRESSION === 'true' ? undefined : /@regression/,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ...(process.env.CI ? [['github'] as const] : []), // GitHub Actions annotations in CI
  ],
  outputDir: 'test-results',
  testDir: './integration_tests/playwright/test/Features/e2e',
})
