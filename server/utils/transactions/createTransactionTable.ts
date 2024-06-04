import { formatDate, parseISO } from 'date-fns'
import { OffenderTransactionHistoryDto } from '../../@types/prisonApiTypes'
import { DateFormats } from '../../constants/date'
import { formatCurrency } from '../currency'

export type ExtendedOffenderTransaction = OffenderTransactionHistoryDto & { prison: string }

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
