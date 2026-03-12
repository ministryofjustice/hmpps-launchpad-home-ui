import { test, expect } from '@playwright/test'
import { acceptDataAccessModal } from '../../../Framework/utils/acceptDataAccessModal'

const baseURL = process.env.TEST_INGRESS_URL || 'http://localhost:3000'

test('User is logged in via Microsoft SSO @regression', async ({ page }) => {
  await page.goto('/')
  await acceptDataAccessModal(page)
  await expect(page).toHaveURL(baseURL)
})
