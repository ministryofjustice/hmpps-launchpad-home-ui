const { chromium } = require('@playwright/test')

module.exports = async function globalSetup() {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000'

  if (!process.env.BASE_URL) {
    // eslint-disable-next-line no-console
    console.log('Warning: BASE_URL environment variable not set, using default: http://localhost:3000')
  }

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${baseURL}`)
  await page.fill('input#i0116', process.env.MS_USERNAME)
  await page.click('button:has-text("Next"), input#idSIButton9')
  await page.fill('input#i0118', process.env.MS_PASSWORD)
  await page.click('input[type="submit"]')
  await page.waitForSelector('input#idSIButton9', { timeout: 10000 })
  await page.click('input#idSIButton9')
  // Save storage state for reuse
  await page.context().storageState({ path: 'storageState.json' })
  await browser.close()
}
