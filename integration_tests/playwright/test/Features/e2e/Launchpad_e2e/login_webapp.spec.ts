import dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL;

test('User is logged in via Microsoft SSO', async ({ page }) => {
  await page.goto('/'); 
  await expect(page).toHaveURL(baseURL);
});

