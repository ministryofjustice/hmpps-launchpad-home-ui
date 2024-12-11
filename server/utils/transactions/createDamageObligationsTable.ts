import { formatDate } from 'date-fns'
import i18next from 'i18next'

import { OffenderDamageObligation } from '../../@types/prisonApiTypes'
import { DateFormats } from '../../constants/date'
import { formatCurrency } from '../currency/currency'
import { sortByDateTime } from '../date/date'

export type ExtendedDamageObligation = OffenderDamageObligation & { prison: string }

export const createDamageObligationsTable = (damageObligations: ExtendedDamageObligation[], language: string) => {
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
      'transactions.damageObligations.adjudicationNumber',
      'transactions.damageObligations.paymentStartEnd',
      'transactions.damageObligations.totalAmount',
      'transactions.damageObligations.amountPaid',
      'transactions.damageObligations.owes',
      'transactions.details.prison',
      'transactions.damageObligations.damageDescription',
    ].map(columnName => ({
      text: i18next.t(columnName, { lng: language }),
    })),
    rows,
    totalRemainingAmount: formatCurrency(totalRemainingAmount, 'GBP'),
  }
}
