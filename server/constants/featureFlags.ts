import { prisons } from './prisons'

interface FeatureFlag {
  enabled: boolean
  allowedPrisons: string[]
}

interface FeatureFlags {
  [key: string]: FeatureFlag
}

// eslint-disable-next-line import/prefer-default-export
export const featureFlags: FeatureFlags = {
  visits: {
    enabled: true,
    allowedPrisons: [prisons.CookhamWood],
  },
}
