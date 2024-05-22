import { Account } from '../../@types/prisonApiTypes'
import { AccountCodes } from '../../constants/transactions'

// eslint-disable-next-line import/prefer-default-export
export const getBalanceByAccountCode = (balances: Account, accountCode: string): number => {
  switch (accountCode) {
    case AccountCodes.SPENDS:
      return balances.spends
    case AccountCodes.PRIVATE:
      return balances.cash
    case AccountCodes.SAVINGS:
      return balances.savings
    default:
      throw new Error(`Unknown account code: ${accountCode}`)
  }
}
