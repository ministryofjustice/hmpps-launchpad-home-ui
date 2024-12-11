export const AccountCodes = {
  SPENDS: 'spends',
  PRIVATE: 'cash',
  SAVINGS: 'savings',
  DAMAGE_OBLIGATIONS: 'damage-obligations',
} as const

export const TransactionTypes = {
  SPENDS: 'spends',
  PRIVATE: 'private',
  SAVINGS: 'savings',
  DAMAGE_OBLIGATIONS: 'damage-obligations',
} as const

export const AccountTypes = [
  {
    label: 'transactions.types.spends',
    url: TransactionTypes.SPENDS,
  },
  {
    label: 'transactions.types.private',
    url: TransactionTypes.PRIVATE,
  },
  {
    label: 'transactions.types.savings',
    url: TransactionTypes.SAVINGS,
  },
]
