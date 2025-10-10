import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'

dotenv.config()

test.describe('User Authentication', () => {
  test('User is logged in via Microsoft SSO', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
  })
})
