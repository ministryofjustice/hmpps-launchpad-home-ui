import { prisonAgencyIds } from './prisons'

interface FeatureFlag {
  enabled: boolean
  allowedPrisons: string[]
}

interface FeatureFlags {
  [key: string]: FeatureFlag
}

const ALLOW_ALL_PRISONS = [
  prisonAgencyIds.Erlestoke,
  prisonAgencyIds.FelthamA,
  prisonAgencyIds.FelthamB,
  prisonAgencyIds.NewHall,
  prisonAgencyIds.Styal,
  prisonAgencyIds.Werrington,
  prisonAgencyIds.Wetherby,
]

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
    allowedPrisons: ALLOW_ALL_PRISONS,
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
    allowedPrisons: ALLOW_ALL_PRISONS,
  },
  [Features.Visits]: {
    enabled: true,
    allowedPrisons: ALLOW_ALL_PRISONS,
  },
}
