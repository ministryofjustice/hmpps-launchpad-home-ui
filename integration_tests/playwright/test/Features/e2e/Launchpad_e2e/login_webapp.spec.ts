import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'

dotenv.config()

const baseURL = process.env.LAUNCHPAD_URL

test('User is logged in via Microsoft SSO', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(baseURL)
})
