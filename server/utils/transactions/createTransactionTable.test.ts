import { offenderTransactionWithPrison } from '../mocks/transactions'
import { createTransactionTable } from './createTransactionTable'

const mockTranslations: Record<string, string> = {
  'transactions.details.paymentDate': 'Payment date',
  'transactions.details.moneyIn': 'Money in',
  'transactions.details.moneyOut': 'Money out',
  'transactions.details.balance': 'Balance',
  'transactions.details.paymentDescription': 'Payment description',
  'transactions.details.prison': 'Prison',
}

jest.mock('i18next', () => ({
  t: (key: string) => mockTranslations[key] || key,
}))

describe(createTransactionTable.name, () => {
  it('should return a table with the correct data', () => {
    const transactionTable = createTransactionTable([offenderTransactionWithPrison], 'en')

    expect(transactionTable).toEqual({
      head: [
        { text: 'Payment date' },
        { text: 'Money in' },
        { text: 'Money out' },
        { text: 'Balance' },
        { text: 'Payment description' },
        { text: 'Prison' },
      ],
      rows: [
        [
          { text: '17 May 2024' },
          { text: '£0.50' },
          { text: null },
          { text: '£487.33' },
          { text: 'Unemployment Pay from 16 May 2024' },
          { text: 'Cookham Wood (HMP)' },
        ],
      ],
    })
  })
})
