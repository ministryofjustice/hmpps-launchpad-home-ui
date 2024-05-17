import { damageObligationWithPrison } from '../mocks/transactions'
import { createDamageObligationsTable } from './createDamageObligationsTable'

describe(createDamageObligationsTable.name, () => {
  it('should return a table with the correct data', () => {
    const damageObligationsTable = createDamageObligationsTable([damageObligationWithPrison])

    expect(damageObligationsTable).toEqual({
      head: [
        { text: 'Adjudication number' },
        { text: 'Payment start and end date' },
        { text: 'Total amount' },
        { text: 'Amount paid' },
        { text: 'Amount owed' },
        { text: 'Prison' },
        { text: 'Description' },
      ],
      rows: [
        [
          { text: '1077480' },
          { text: '5 April 2015 to 5 April 2017' },
          { text: '£20.00' },
          { text: '£20.00' },
          { text: '£0.00' },
          { text: 'Foston Hall (HMP)' },
          { text: undefined },
        ],
      ],
      totalRemainingAmount: '£0.00',
    })
  })
})
