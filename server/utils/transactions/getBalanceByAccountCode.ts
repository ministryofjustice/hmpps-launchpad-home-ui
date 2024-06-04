import { Account } from '../../@types/prisonApiTypes'
import { AccountCodes } from '../../constants/transactions'

// eslint-disable-next-line import/prefer-default-export
export const getBalanceByAccountCode = (balances: Account, accountCode: string): string => {
  let balance: number

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
      throw new Error(`Unknown account code: ${accountCode}`)
  }

  return balance.toFixed(2)
}
