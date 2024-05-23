import { Account } from '../../@types/prisonApiTypes'
import { AccountCodes } from '../../constants/transactions'
import { getBalanceByAccountCode } from './getBalanceByAccountCode'

describe('getBalanceByAccountCode', () => {
  const balances: Account = {
    cash: 200,
    currency: 'GBP',
    damageObligations: 400,
    savings: 300,
    spends: 100,
  }

  it('should return the balance for spends account', () => {
    const result = getBalanceByAccountCode(balances, AccountCodes.SPENDS)
    expect(result).toBe('100.00')
  })

  it('should return the balance for private (cash) account', () => {
    const result = getBalanceByAccountCode(balances, AccountCodes.PRIVATE)
    expect(result).toBe('200.00')
  })

  it('should return the balance for savings account', () => {
    const result = getBalanceByAccountCode(balances, AccountCodes.SAVINGS)
    expect(result).toBe('300.00')
  })

  it('should throw an error for an unknown account code', () => {
    expect(() => {
      getBalanceByAccountCode(balances, 'unknown-account-code')
    }).toThrowError('Unknown account code: unknown-account-code')
  })

  it('should throw an error for DAMAGE_OBLIGATIONS account code', () => {
    expect(() => {
      getBalanceByAccountCode(balances, AccountCodes.DAMAGE_OBLIGATIONS)
    }).toThrowError(`Unknown account code: ${AccountCodes.DAMAGE_OBLIGATIONS}`)
  })
})
