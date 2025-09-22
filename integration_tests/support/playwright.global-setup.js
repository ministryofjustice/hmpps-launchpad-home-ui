const { chromium } = require('@playwright/test');

module.exports = async function globalSetup(config) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL + '/login');
  await page.fill('input#i0116', process.env.MS_USERNAME);
  await page.click('button:has-text("Next"), input#idSIButton9');
  await page.fill('input#i0118', process.env.MS_PASSWORD);
  await page.click('input[type="submit"]');
  await page.waitForSelector('input#idSIButton9', { timeout: 10000 });
  await page.click('input#idSIButton9');
  // Save storage state for reuse
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}