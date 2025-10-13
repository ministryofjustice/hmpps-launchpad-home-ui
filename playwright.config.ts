/* eslint-disable import/no-extraneous-dependencies */
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
  },
  timeout: 30000,
  retries: process.env.CI ? 3 : 2, // More retries in CI
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ...(process.env.CI ? [['github'] as const] : []), // GitHub Actions annotations in CI
  ],
  outputDir: 'test-results',
  testDir: './integration_tests/playwright/test/Features/e2e',
})
