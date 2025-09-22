import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  globalSetup: require.resolve('./integration_tests/support/playwright.global-setup.ts'),
  globalTeardown: require.resolve('./integration_tests/support/playwright.global-teardown.ts'),
  use: {
    storageState: 'storageState.json',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 30000,
  retries: 0,
  testDir: './integration_tests/playwright/test/Features/e2e',
});
