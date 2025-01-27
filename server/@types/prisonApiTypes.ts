import { components } from './prison-api'

export type Agency = components['schemas']['Agency']
export type OffenderDamageObligation = components['schemas']['OffenderDamageObligationModel']
export type OffenderTransactionHistoryDto = components['schemas']['OffenderTransactionHistoryDto']
export type ScheduledEvent = components['schemas']['ScheduledEvent']
export type UserDetail = components['schemas']['UserDetail']
export type VisitDetails = components['schemas']['VisitDetails']
export type VisitBalances = components['schemas']['VisitBalances']

export type Account = {
  spends: number | null
  cash: number | null
  savings: number | null
  damageObligations: number | null
  currency: string | null
}
