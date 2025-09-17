import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './integration_tests/playwright',
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000', // Update as needed
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
