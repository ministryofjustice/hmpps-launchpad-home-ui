import { formatCurrency } from './currency'

describe('formatCurrency function', () => {
  it('should format currency correctly for GBP', () => {
    const formattedAmount = formatCurrency(1000, 'GBP')
    expect(formattedAmount).toBe('£1,000.00')
  })

  it('should handle null amount', () => {
    const formattedAmount = formatCurrency(null, 'GBP')
    expect(formattedAmount).toBeNull()
  })

  it('should handle NaN amount', () => {
    const formattedAmount = formatCurrency(NaN, 'GBP')
    expect(formattedAmount).toBeNull()
  })

  it('should handle missing currency', () => {
    const formattedAmount = formatCurrency(1000, '')
    expect(formattedAmount).toBeNull()
  })

  it('should handle undefined currency', () => {
    const formattedAmount = formatCurrency(1000, undefined)
    expect(formattedAmount).toBeNull()
  })
})
