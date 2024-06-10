import { prisonAgencyIds } from './prisons'

interface FeatureFlag {
  enabled: boolean
  allowedPrisons: string[]
}

interface FeatureFlags {
  [key: string]: FeatureFlag
}

// eslint-disable-next-line import/prefer-default-export
export const featureFlags: FeatureFlags = {
  adjudications: {
    enabled: false,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
  transactions: {
    enabled: true,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
  visits: {
    enabled: false,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
}
