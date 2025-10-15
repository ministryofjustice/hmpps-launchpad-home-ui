/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const isCI = process.env.CI === 'true'

export default defineConfig({
  globalSetup: path.resolve(__dirname, 'integration_tests/support/playwright.global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'integration_tests/support/playwright.global-teardown.ts'),
  // Import global hooks for enhanced logging
  ...(isCI && {
    testMatch: ['**/e2e/**/*.spec.ts'],
  }),
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    // Enhanced logging for CI
    ...(isCI && {
      // Capture console logs in CI
      launchOptions: {
        // Enable verbose browser logging in CI
        args: ['--enable-logging', '--log-level=0'],
      },
    }),
  },
  timeout: 30000,
  retries: process.env.CI ? 0 : 0, // More retries in CI
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ...(process.env.CI ? [['github'] as const] : []), // GitHub Actions annotations in CI
    // Add verbose line reporter in CI for detailed output
    ...(isCI ? [['line'] as const] : []),
  ],
  outputDir: 'test-results',
  testDir: './integration_tests/playwright/test/Features/e2e',
  // Enhanced project configuration for CI logging
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Additional CI-specific browser options
        ...(isCI && {
          // Enable more detailed browser logging
          contextOptions: {
            // Record har files for network debugging in CI
            recordHar: { path: 'test-results/network.har', mode: 'minimal' },
          },
        }),
      },
    },
  ],
})
