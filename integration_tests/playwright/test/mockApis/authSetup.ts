import { Page } from '@playwright/test'
import jwt from 'jsonwebtoken'

export async function setupMockAuthentication(page: Page): Promise<void> {
  // Create a proper JWT token structure for OAuth2
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: 'G3682UE',
    name: 'Test User',
    given_name: 'Test',
    family_name: 'User',
    email: 'test.user@example.com',
    preferred_username: 'G3682UE',
    establishment_id: 'BWI',
    establishment_name: 'HMP Berwyn',
    booking_id: 'G6123VG',
    prisoner_number: 'A1234BC',
    agency_id: 'BWI',
    iat: now,
    exp: now + 3600,
    iss: 'http://localhost:9091',
    aud: 'launchpad-home-ui',
  }

  const accessToken = jwt.sign(payload, 'secret')

  // Navigate to the app first
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  // Inject auth into localStorage and sessionStorage
  await page.evaluate(token => {
    localStorage.setItem('id_token', token)
    localStorage.setItem('access_token', token)
    sessionStorage.setItem('id_token', token)
    sessionStorage.setItem('access_token', token)
  }, accessToken)

  // Set the session cookie after navigation
  await page.context().addCookies([
    {
      name: 'express:sess',
      value: accessToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ])

  // Now reload to fully authenticate
  await page.reload({ waitUntil: 'networkidle' })
}

export async function setupOAuth2Flow(page: Page): Promise<void> {
  // Navigate to / which will trigger OAuth2 redirect
  const navigationPromise = page.goto('/', { waitUntil: 'domcontentloaded' })

  // Wait for navigation to /auth/oauth2/authorize or similar
  // Then Playwright should follow redirects automatically
  try {
    await navigationPromise
  } catch (error) {
    // If it times out, the OAuth2 flow might not be working as expected
    // eslint-disable-next-line no-console
    console.error('OAuth2 flow error:', error)
    throw error
  }
}

export default {
  setupMockAuthentication,
  setupOAuth2Flow,
}
