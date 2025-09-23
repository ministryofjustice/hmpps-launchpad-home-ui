/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export default defineConfig({
  globalSetup: path.resolve(__dirname, 'integration_tests/support/playwright.global-setup.js'),
  globalTeardown: path.resolve(__dirname, 'integration_tests/support/playwright.global-teardown.js'),
  use: {
    storageState: 'storageState.json',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 30000,
  retries: 2,
  reporter: [['html', { open: 'never' }], ['list'], ['junit', { outputFile: 'test-results/results.xml' }]],
  testDir: './integration_tests/playwright/test/Features/e2e',
})
