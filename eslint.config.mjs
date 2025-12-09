import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default hmppsConfig({
  extraIgnorePaths: ['assets/**/*.js', 'test_results/**', 'test-results/**', 'playwright-report/**'],
  extraPathsAllowingDevDependencies: ['.allowed-scripts.mjs'],
})
