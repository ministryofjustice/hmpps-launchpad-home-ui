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
    allowedPrisons: ALLOW_ALL_PRISONS,
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
