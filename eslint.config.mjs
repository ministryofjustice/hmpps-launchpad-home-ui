import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig({
    extraIgnorePaths: [
      'assets/**/*.js',
      'integration_tests/videos/**/*',
      'integration_tests/screenshots/**/*',
      'playwright-report/**/*',
      'test-results/**/*',
      'test_results/**/*',
    ],
  }),
  {
    files: ['integration_tests/support/playwright.global-setup.js'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
]
