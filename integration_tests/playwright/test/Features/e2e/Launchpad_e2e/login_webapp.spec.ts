import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'

dotenv.config()

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

test('User can access application with bypassed authentication', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(`${baseURL}/`)
})
