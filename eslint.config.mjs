import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

const baseConfig = hmppsConfig()

export default [
  {
    ignores: [
      'playwright-report/**',
      'allure-report/**',
      'allure-results/**',
      'test-results/**',
      'pw-output/**',
      'coverage/**',
    ],
  },
  ...baseConfig,
]
