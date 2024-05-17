import { formatDate } from 'date-fns'
import { OffenderDamageObligation } from '../../@types/prisonApiTypes'
import { formatCurrency } from '../currency'
import { sortByDateTime } from '../date'
import { DateFormats } from '../enums'

export type ExtendedDamageObligation = OffenderDamageObligation & { prison: string }

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
