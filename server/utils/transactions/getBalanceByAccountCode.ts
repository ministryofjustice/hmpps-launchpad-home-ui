import { Account } from '../../@types/prisonApiTypes'
import { AccountCodes } from '../../constants/transactions'

// eslint-disable-next-line import/prefer-default-export
export const getBalanceByAccountCode = (balances: Account | null, accountCode: string): string => {
  if (!balances) {
    return 'N/A'
  }

  let balance: number | null = null

  switch (accountCode) {
    case AccountCodes.SPENDS:
      balance = balances.spends
      break
    case AccountCodes.PRIVATE:
      balance = balances.cash
      break
    case AccountCodes.SAVINGS:
      balance = balances.savings
      break
    default:
      return 'N/A'
  }

  return balance ? balance.toFixed(2) : 'N/A'
}
