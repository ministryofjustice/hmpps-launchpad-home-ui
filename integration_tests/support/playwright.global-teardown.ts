import fs from 'fs'

export default async function globalTeardown() {
  // Remove test-results directory if it exists
  if (fs.existsSync('test-results')) {
    fs.rmSync('test-results', { recursive: true, force: true })
  }

  // Remove any temporary files in integration_tests/support/tmp
  const tmpDir = 'integration_tests/support/tmp'
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}
