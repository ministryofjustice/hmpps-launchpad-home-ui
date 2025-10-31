import auth from '../playwright/test/mockApis/auth'
import tokenVerification from '../playwright/test/mockApis/tokenVerification'

export default async function globalSetup() {
  // Set up Wiremock authentication stubs for OAuth2 and legacy auth
  const maxRetries = 10
  let retries = 0

  while (retries < maxRetries) {
    try {
      // Setup OAuth2 Launchpad Auth mock (authorize callback)
      // eslint-disable-next-line no-await-in-loop
      await auth.stubOauth2AuthorizeCallback()
      // eslint-disable-next-line no-await-in-loop
      await auth.stubOauth2Token()

      // Setup token verification mocks
      // eslint-disable-next-line no-await-in-loop
      await tokenVerification.stubVerifyToken(true)
      // eslint-disable-next-line no-await-in-loop
      await tokenVerification.stubPing(200)

      // Setup legacy HMPPS Auth mocks (for backward compatibility)
      // eslint-disable-next-line no-await-in-loop
      await auth.stubAuthPing()
      // eslint-disable-next-line no-await-in-loop
      await auth.stubSignIn()
      // eslint-disable-next-line no-await-in-loop
      await auth.stubAuthUser('Test User')

      // eslint-disable-next-line no-console
      console.log('✓ Wiremock authentication stubs setup completed successfully')
      return
    } catch (error) {
      retries += 1
      if (retries >= maxRetries) {
        // eslint-disable-next-line no-console
        console.error('✗ Wiremock setup failed after all retries:', error)
        // Don't throw error - let tests handle auth setup individually
        // eslint-disable-next-line no-console
        console.log('ℹ Continuing without global Wiremock stubs - individual tests will set up auth')
        return
      }

      // eslint-disable-next-line no-console
      console.log(`ℹ Wiremock not ready yet, retrying... (${retries}/${maxRetries})`)
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => {
        setTimeout(resolve, 2000)
      })
    }
  }
}
