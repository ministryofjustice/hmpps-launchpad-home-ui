import { ALLOW_ALL_PRISONS, featureFlags } from '../../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
export const isFeatureEnabled = (flag: string, prisonId: string): boolean => {
  const feature = featureFlags[flag]
  return feature?.enabled && (feature.allowedPrisons === ALLOW_ALL_PRISONS || feature.allowedPrisons.includes(prisonId))
}
