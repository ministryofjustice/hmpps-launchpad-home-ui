import { prisonAgencyIds } from './prisons'

interface FeatureFlag {
  enabled: boolean
  allowedPrisons: string[] | typeof ALLOW_ALL_PRISONS
}

interface FeatureFlags {
  [key: string]: FeatureFlag
}

export const ALLOW_ALL_PRISONS = 'ALL'

export const Features = {
  Adjudications: 'adjudications',
  Settings: 'settings',
  SocialVisitors: 'socialVisitors',
  Transactions: 'transactions',
  Visits: 'visits',
} as const

export const featureFlags: FeatureFlags = {
  [Features.Adjudications]: {
    enabled: true,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
  [Features.Settings]: {
    enabled: false,
    allowedPrisons: [],
  },
  [Features.SocialVisitors]: {
    enabled: false,
    allowedPrisons: [],
  },
  [Features.Transactions]: {
    enabled: true,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
  [Features.Visits]: {
    enabled: true,
    allowedPrisons: [prisonAgencyIds.Erlestoke],
  },
}
