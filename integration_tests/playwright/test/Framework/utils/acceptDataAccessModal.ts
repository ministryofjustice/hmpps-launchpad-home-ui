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
  const frames = page.frames()
  const frameVisibility = await Promise.all(
    frames.map(frame => frame.locator(selector).isVisible({ timeout: 5000 }).catch(() => false)),
  )
  const visibleIndex = frameVisibility.findIndex(Boolean)
  if (visibleIndex >= 0) {
    await frames[visibleIndex].locator(selector).click()
    await page.waitForLoadState('networkidle')
  }
}
