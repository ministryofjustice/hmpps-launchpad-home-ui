import auth from '../mockApis/auth'

export default async function globalSetup() {
  // Set up Wiremock authentication bypass stubs
  // This replaces Microsoft SSO with mock authentication for testing
  const maxRetries = 10
  let retries = 0

  while (retries < maxRetries) {
    try {
      // Setup authentication bypass stubs for Wiremock
      // These stubs allow tests to access protected routes without actual login
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
