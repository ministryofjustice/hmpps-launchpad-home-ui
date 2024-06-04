import { offenderTransactionWithPrison } from '../mocks/transactions'
import { createTransactionTable } from './createTransactionTable'

describe(createTransactionTable.name, () => {
  it('should return a table with the correct data', () => {
    const transactionTable = createTransactionTable([offenderTransactionWithPrison])

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
