import { OffenderDamageObligation, OffenderTransactionHistoryDto } from '../../@types/prisonApiTypes'
import { ExtendedDamageObligation } from '../transactions/createDamageObligationsTable'
import { ExtendedOffenderTransaction } from '../transactions/createTransactionTable'

export const offenderTransaction: OffenderTransactionHistoryDto = {
  offenderId: 2319320,
  transactionId: 431240219,
  transactionEntrySequence: 1,
  entryDate: '2024-05-17',
  transactionType: 'A_EARN',
  entryDescription: 'Offender Payroll From:16/05/2024 To:16/05/2024',
  referenceNumber: null,
  currency: 'GBP',
  penceAmount: 50,
  accountType: 'SPND',
  postingType: 'CR',
  offenderNo: 'G3682UE',
  agencyId: 'CKI',
  relatedOffenderTransactions: [
    {
      id: 96667542,
      transactionId: 431240219,
      transactionEntrySequence: 1,
      calendarDate: '2024-05-16',
      payTypeCode: 'UNEMPLOYED',
      eventId: null,
      payAmount: 50,
      pieceWork: 0,
      bonusPay: 0,
      currentBalance: 48733,
      paymentDescription: 'Unemployment Pay',
    },
  ],
  currentBalance: 48733,
  holdingCleared: false,
  createDateTime: '2024-05-17T00:02:04.645226',
}

export const offenderTransactionWithPrison: ExtendedOffenderTransaction = {
  ...offenderTransaction,
  prison: 'Cookham Wood (HMP)',
}

export const damageObligation: OffenderDamageObligation = {
  id: 6027,
  offenderNo: 'G3682UE',
  referenceNumber: '1077480',
  startDateTime: '2015-04-05T00:00:00',
  endDateTime: '2017-04-05T00:00:00',
  prisonId: 'FMI',
  amountToPay: 20,
  amountPaid: 20,
  status: 'ACTIVE',
  currency: 'GBP',
}

export const damageObligationWithPrison: ExtendedDamageObligation = {
  ...damageObligation,
  prison: 'Foston Hall (HMP)',
}
