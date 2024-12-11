import { damageObligationWithPrison } from '../mocks/transactions'
import { createDamageObligationsTable } from './createDamageObligationsTable'

const mockTranslations: Record<string, string> = {
  'transactions.damageObligations.adjudicationNumber': 'Adjudication number',
  'transactions.damageObligations.paymentStartEnd': 'Payment start and end date',
  'transactions.damageObligations.totalAmount': 'Total amount',
  'transactions.damageObligations.amountPaid': 'Amount paid',
  'transactions.damageObligations.owes': 'Your currently owe',
  'transactions.details.prison': 'Prison',
  'transactions.damageObligations.damageDescription': 'Description',
}

jest.mock('i18next', () => ({
  t: (key: string) => mockTranslations[key] || key,
}))

describe(createDamageObligationsTable.name, () => {
  it('should return a table with the correct data', () => {
    const damageObligationsTable = createDamageObligationsTable([damageObligationWithPrison], 'en')

    expect(damageObligationsTable).toEqual({
      head: [
        { text: 'Adjudication number' },
        { text: 'Payment start and end date' },
        { text: 'Total amount' },
        { text: 'Amount paid' },
        { text: 'Your currently owe' },
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
