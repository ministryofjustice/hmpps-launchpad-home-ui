import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default hmppsConfig({
  extraIgnorePaths: ['assets/**/*.js', 'test_results/**/*.js', 'test-results/**/*.js', 'playwright-report/**/*.js'],
})
