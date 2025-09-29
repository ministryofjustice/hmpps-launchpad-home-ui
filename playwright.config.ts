/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export default defineConfig({
  workers: 1,
  globalSetup: path.resolve(__dirname, 'integration_tests/support/playwright.global-setup.js'),
  globalTeardown: path.resolve(__dirname, 'integration_tests/support/playwright.global-teardown.js'),

  outputDir: 'integration_tests/screenshots',

  use: {
    storageState: 'storageState.json',
    baseURL: process.env.BASE_URL || process.env.INGRESS_URL || 'http://localhost:3000',
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
  retries: 2,

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
