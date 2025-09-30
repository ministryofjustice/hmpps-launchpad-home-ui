import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig({ extraIgnorePaths: ['assets/**/*.js'] }),
  {
    files: ['integration_tests/support/playwright.global-setup.js'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
]
