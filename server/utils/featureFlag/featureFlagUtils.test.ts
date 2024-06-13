import { isFeatureEnabled } from './featureFlagUtils'

jest.mock('../../constants/featureFlags', () => ({
  ALLOW_ALL_PRISONS: 'ALL',
  featureFlags: {
    adjudications: {
      enabled: true,
      allowedPrisons: 'ALL',
    },
    transactions: {
      enabled: true,
      allowedPrisons: ['prison1', 'prison2'],
    },
    visits: {
      enabled: false,
      allowedPrisons: ['prison1'],
    },
  },
}))

describe(isFeatureEnabled.name, () => {
  it('should return true if the feature is enabled for all prisons', () => {
    expect(isFeatureEnabled('adjudications', 'prison1')).toBe(true)
  })

  it('should return true if the feature is enabled for the specified prison', () => {
    expect(isFeatureEnabled('transactions', 'prison1')).toBe(true)
  })

  it('should return false if the feature is not enabled for the specified prison', () => {
    expect(isFeatureEnabled('visits', 'prison2')).toBe(false)
  })

  it('should return false if the feature is enabled but the prison is not allowed', () => {
    expect(isFeatureEnabled('transactions', 'prison3')).toBe(false)
  })
})
