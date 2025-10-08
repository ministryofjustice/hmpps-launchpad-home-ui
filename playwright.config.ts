/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const baseURL = process.env.LAUNCHPAD_URL || 'http://localhost:3000'

export default defineConfig({
  globalSetup: path.resolve(__dirname, 'integration_tests/support/playwright.global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'integration_tests/support/playwright.global-teardown.ts'),
  use: {
    storageState: 'storageState.json',
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 30000,
  retries: 2,
  reporter: [['html', { open: 'never' }], ['list'], ['junit', { outputFile: 'test-results/results.xml' }]],
  testDir: './integration_tests/playwright/test/Features/e2e',
})
