import { prisonAgencyIds } from './prisons'

interface FeatureFlag {
  enabled: boolean
  allowedPrisons: string[]
}

interface FeatureFlags {
  [key: string]: FeatureFlag
}

const COMMON_PRISON_LIST = [
  prisonAgencyIds.Bullingdon,
  prisonAgencyIds.Cardiff,
  prisonAgencyIds.Chelmsford,
  prisonAgencyIds.CookhamWood,
  prisonAgencyIds.Erlestoke,
  prisonAgencyIds.FelthamA,
  prisonAgencyIds.FelthamB,
  prisonAgencyIds.Garth,
  prisonAgencyIds.Lindholme,
  prisonAgencyIds.NewHall,
  prisonAgencyIds.Ranby,
  prisonAgencyIds.StokeHeath,
  prisonAgencyIds.Styal,
  prisonAgencyIds.Swaleside,
  prisonAgencyIds.TheMount,
  prisonAgencyIds.Wayland,
  prisonAgencyIds.Werrington,
  prisonAgencyIds.Wetherby,
  prisonAgencyIds.Woodhill,
]

const ADJUDICATIONS_PRISON_LIST = COMMON_PRISON_LIST.filter(
  prison => ![prisonAgencyIds.Bullingdon, prisonAgencyIds.Chelmsford, prisonAgencyIds.Woodhill].includes(prison),
)

export const Features = {
  Adjudications: 'adjudications',
  Settings: 'settings',
  SocialVisitors: 'socialVisitors',
  Transactions: 'transactions',
  Translations: 'translations',
  Visits: 'visits',
} as const

export const featureFlags: FeatureFlags = {
  [Features.Adjudications]: {
    enabled: true,
    allowedPrisons: ADJUDICATIONS_PRISON_LIST,
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
    allowedPrisons: COMMON_PRISON_LIST,
  },
  [Features.Translations]: {
    enabled: true,
    allowedPrisons: COMMON_PRISON_LIST,
  },
  [Features.Visits]: {
    enabled: true,
    allowedPrisons: COMMON_PRISON_LIST,
  },
}
