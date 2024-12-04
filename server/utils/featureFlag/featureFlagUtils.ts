import { featureFlags } from '../../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
export const isFeatureEnabled = (flag: string, prisonId: string): boolean => {
  const feature = featureFlags[flag]
  return feature?.enabled && feature.allowedPrisons.includes(prisonId)
}
