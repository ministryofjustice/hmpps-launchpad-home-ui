import { Page } from '@playwright/test'

export async function acceptDataAccessModal(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded')

  const selector = 'button[form="form_approve"]'
  const approveButton = page.locator(selector)

  const isVisible = await approveButton.isVisible({ timeout: 15000 }).catch(() => false)
  if (isVisible) {
    await approveButton.click()
    await page.waitForLoadState('networkidle')
    return
  }

  // Fall back to frames in case the consent modal renders inside an iframe.
  for (const frame of page.frames()) {
    const frameButton = frame.locator(selector)
    const frameVisible = await frameButton.isVisible({ timeout: 5000 }).catch(() => false)
    if (frameVisible) {
      await frameButton.click()
      await page.waitForLoadState('networkidle')
      return
    }
  }
}
