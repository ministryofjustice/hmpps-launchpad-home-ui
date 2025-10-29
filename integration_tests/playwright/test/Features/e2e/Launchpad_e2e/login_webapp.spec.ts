import { test, expect } from '@playwright/test'

const baseURL = process.env.TEST_INGRESS_URL || 'http://localhost:3000'

test('User is logged in via Microsoft SSO @regression', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(baseURL)
})
