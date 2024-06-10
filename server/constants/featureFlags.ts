import { prisonAgencyIds } from './prisons'

export const Features = {
  Adjudications: 'adjudications',
  Transactions: 'transactions',
  Visits: 'visits',
} as const

interface FeatureFlag {
  enabled: boolean
  allowedPrisons: string[]
}

interface FeatureFlags {
  [key: string]: FeatureFlag
}

// eslint-disable-next-line import/prefer-default-export
export const featureFlags: FeatureFlags = {
  [Features.Adjudications]: {
    enabled: false,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
  [Features.Transactions]: {
    enabled: true,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
  [Features.Visits]: {
    enabled: false,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
}
