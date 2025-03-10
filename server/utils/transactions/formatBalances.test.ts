import { formatBalances } from './formatBalances'

describe('formatBalances', () => {
  it('formats numeric values to two decimal places', () => {
    const input = {
      spends: 10,
      cash: 20.5,
      savings: 30.1234,
      damageObligations: 40.9999,
      currency: 'GBP',
    }

    const expectedOutput = {
      spends: '10.00',
      cash: '20.50',
      savings: '30.12',
      damageObligations: '41.00',
      currency: 'GBP',
    }

    expect(formatBalances(input)).toEqual(expectedOutput)
  })

  it('handles an empty object', () => {
    expect(formatBalances({})).toEqual({})
  })

  it('handles objects with zero values correctly', () => {
    const input = {
      spends: 0,
      cash: 0.0,
    }

    const expectedOutput = {
      spends: '0.00',
      cash: '0.00',
    }

    expect(formatBalances(input)).toEqual(expectedOutput)
  })

  it('handles negative numbers correctly', () => {
    const input = {
      spends: -10,
      cash: -20.567,
    }

    const expectedOutput = {
      spends: '-10.00',
      cash: '-20.57',
    }

    expect(formatBalances(input)).toEqual(expectedOutput)
  })
})
