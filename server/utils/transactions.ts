import { formatDate, parseISO } from 'date-fns'
import { OffenderDamageObligation, OffenderTransactionHistoryDto } from '../@types/prisonApiTypes'
import { formatCurrency } from './currency'
import { DateFormats } from './enums'
import { sortByDateTime } from './date'

type ExtendedOffenderTransaction = OffenderTransactionHistoryDto & { prison: string }
type ExtendedDamageObligation = OffenderDamageObligation & { prison: string }

export const createTransactionTable = (transactions: ExtendedOffenderTransaction[]) => {
  const hasRelatedOffenderTransactions = (transaction: ExtendedOffenderTransaction) =>
    transaction.relatedOffenderTransactions.length > 0

  const sortByEntryDate = (transaction1: ExtendedOffenderTransaction, transaction2: ExtendedOffenderTransaction) => {
    const entryDateDiff = parseISO(transaction2.entryDate).valueOf() - parseISO(transaction1.entryDate).valueOf()

    if (entryDateDiff !== 0) return entryDateDiff

    return 0
  }

  const relatedTransactions = transactions.filter(hasRelatedOffenderTransactions).flatMap(transaction =>
    transaction.relatedOffenderTransactions.map(rTransaction => ({
      entryDate: transaction.entryDate,
      penceAmount: rTransaction.payAmount,
      currentBalance: rTransaction.currentBalance,
      entryDescription: `${rTransaction.paymentDescription} from ${formatDate(
        rTransaction.calendarDate,
        DateFormats.GDS_PRETTY_DATE,
      )}`,
      postingType: 'CR',
      currency: transaction.currency,
      prison: transaction.prison,
    })),
  )

  const nonRelatedTransactions = transactions.filter(transaction => !hasRelatedOffenderTransactions(transaction))

  const head = ['Payment date', 'Money in', 'Money out', 'Balance', 'Payment description', 'Prison'].map(
    columnName => ({
      text: columnName,
    }),
  )

  const rows = [...nonRelatedTransactions, ...relatedTransactions]
    .sort(sortByEntryDate)
    .map(transaction => ({
      paymentDate: formatDate(transaction.entryDate, DateFormats.GDS_PRETTY_DATE),
      balance: formatCurrency(transaction.currentBalance / 100, transaction.currency),
      moneyIn:
        transaction.postingType === 'CR' ? formatCurrency(transaction.penceAmount / 100, transaction.currency) : null,
      moneyOut:
        transaction.postingType === 'DR'
          ? formatCurrency(0 - transaction.penceAmount / 100, transaction.currency)
          : null,
      paymentDescription: transaction.entryDescription,
      prison: transaction.prison,
    }))
    .map(transaction =>
      [
        transaction.paymentDate,
        transaction.moneyIn,
        transaction.moneyOut,
        transaction.balance,
        transaction.paymentDescription,
        transaction.prison,
      ].map(rowValue => ({ text: rowValue })),
    )

  return { head, rows }
}

export const createDamageObligationsTable = (damageObligations: ExtendedDamageObligation[]) => {
  const activeDamageObligations = damageObligations.filter(damageObligation => damageObligation.status === 'ACTIVE')

  const totalRemainingAmount = activeDamageObligations
    .filter(damageObligation => damageObligation.currency === 'GBP')
    .reduce(
      (runningTotal, damageObligation) => runningTotal + (damageObligation.amountToPay - damageObligation.amountPaid),
      0,
    )

  const rows = activeDamageObligations
    .sort((damageObligation1, damageObligation2) =>
      sortByDateTime(damageObligation2.startDateTime, damageObligation1.startDateTime),
    )
    .map((damageObligation: ExtendedDamageObligation) => {
      const startDate = formatDate(damageObligation.startDateTime, DateFormats.GDS_PRETTY_DATE)
      const endDate = formatDate(damageObligation.endDateTime, DateFormats.GDS_PRETTY_DATE)

      return {
        adjudicationNumber: damageObligation.referenceNumber,
        timePeriod:
          damageObligation.startDateTime && damageObligation.endDateTime ? `${startDate} to ${endDate}` : 'Unknown',
        totalAmount: formatCurrency(damageObligation.amountToPay, damageObligation.currency),
        amountPaid: formatCurrency(damageObligation.amountPaid, damageObligation.currency),
        amountOwed: formatCurrency(
          damageObligation.amountToPay - damageObligation.amountPaid,
          damageObligation.currency,
        ),
        prison: damageObligation.prison,
        description: damageObligation.comment,
      }
    })
    .map(damageObligation =>
      [
        damageObligation.adjudicationNumber,
        damageObligation.timePeriod,
        damageObligation.totalAmount,
        damageObligation.amountPaid,
        damageObligation.amountOwed,
        damageObligation.prison,
        damageObligation.description,
      ].map(rowValue => ({ text: rowValue })),
    )

  return {
    head: [
      'Adjudication number',
      'Payment start and end date',
      'Total amount',
      'Amount paid',
      'Amount owed',
      'Prison',
      'Description',
    ].map(columnName => ({
      text: columnName,
    })),
    rows,
    totalRemainingAmount: formatCurrency(totalRemainingAmount, 'GBP'),
  }
}
