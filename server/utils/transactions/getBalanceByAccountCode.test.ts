import { Account } from '../../@types/prisonApiTypes'
import { AccountCodes } from '../../constants/transactions'
import { getBalanceByAccountCode } from './getBalanceByAccountCode'

describe('getBalanceByAccountCode', () => {
  const mockAccount: Account = {
    spends: 100.25,
    cash: 200.5,
    savings: 300.75,
    damageObligations: 0,
    currency: 'GBP',
  }

  it('should return "N/A" when balances is null', () => {
    expect(getBalanceByAccountCode(null, AccountCodes.SPENDS)).toBe('N/A')
  })

  it('should return the correct formatted balance for SPENDS', () => {
    expect(getBalanceByAccountCode(mockAccount, AccountCodes.SPENDS)).toBe('100.25')
  })

  it('should return the correct formatted balance for PRIVATE', () => {
    expect(getBalanceByAccountCode(mockAccount, AccountCodes.PRIVATE)).toBe('200.50')
  })

  it('should return the correct formatted balance for SAVINGS', () => {
    expect(getBalanceByAccountCode(mockAccount, AccountCodes.SAVINGS)).toBe('300.75')
  })

  it('should return "N/A" for unknown account codes', () => {
    expect(getBalanceByAccountCode(mockAccount, 'UNKNOWN_CODE')).toBe('N/A')
  })

  it('should return "N/A" if the balance is null for a valid account code', () => {
    const accountWithNullBalance: Account = {
      spends: null,
      cash: null,
      savings: null,
      damageObligations: 0,
      currency: 'GBP',
    }
    expect(getBalanceByAccountCode(accountWithNullBalance, AccountCodes.SPENDS)).toBe('N/A')
    expect(getBalanceByAccountCode(accountWithNullBalance, AccountCodes.PRIVATE)).toBe('N/A')
    expect(getBalanceByAccountCode(accountWithNullBalance, AccountCodes.SAVINGS)).toBe('N/A')
  })
})
