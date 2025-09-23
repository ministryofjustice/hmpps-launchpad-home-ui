import { test } from '@playwright/test'

const healthyFixture = {
  healthy: true,
  checks: {
    hmppsAuth: 'OK',
    tokenVerification: { status: 200, retries: 0 },
  },
}

const unhealthyFixture = {
  healthy: false,
  checks: {
    hmppsAuth: 'OK',
    tokenVerification: { status: 500, retries: 2 },
  },
}

test.describe('Advanced Healthcheck Stubbing', () => {
  test('Health endpoint returns healthy or unhealthy based on query', async ({ page }) => {
    await page.route('**/health', async route => {
      const url = route.request().url()
      if (url.includes('unhealthy=true')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(unhealthyFixture),
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(healthyFixture),
        })
      }
    })
    // Healthy response
    await page
          .goto('/health')
    // Unhealthy response
    await page
          .goto('/health?unhealthy=true')
  })

  test('Ping endpoint returns UP or DOWN', async ({ page }) => {
    await page.route('**/ping', async route => {
      // Inspect request headers for conditional response
      if (route.request().headers()['x-force-down'] === 'true') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'DOWN' }),
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'UP' }),
        })
      }
    })
    await page.goto('/ping')
    // Simulate DOWN by sending custom header
    await page.evaluate(() => {
      fetch('/ping', { headers: { 'x-force-down': 'true' } })
    })
  })

  test('Assert request payload and stub response', async ({ page }) => {
    await page.route('**/health', async route => {
      const postData = route.request().postData()
      // Check if request payload matches expected
      if (postData && postData.includes('simulateError')) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Simulated error' }),
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(healthyFixture),
        })
      }
    })
    await page.evaluate(() => {
      fetch('/health', {
        method: 'POST',
        body: JSON.stringify({ simulateError: true }),
        headers: { 'Content-Type': 'application/json' },
      })
    })
  })
})
