import { endOfMonth, isFuture, startOfMonth } from 'date-fns'
import { Request, Response, Router } from 'express'

import { AgencyType } from '../../constants/agency'
import { AccountCodes, TransactionTypes } from '../../constants/transactions'
import { asyncHandler } from '../../middleware/asyncHandler'
import type { Services } from '../../services'
import { createDateSelectionRange } from '../../utils/date'
import { createDamageObligationsTable } from '../../utils/transactions/createDamageObligationsTable'
import { createTransactionTable } from '../../utils/transactions/createTransactionTable'
import { getBalanceByAccountCode } from '../../utils/transactions/getBalanceByAccountCode'
import { getEstablishmentLinksData } from '../../utils/utils'
import { getConfig } from '../config'

export default function routes(services: Services): Router {
  const router = Router()

  const accountTypes = [TransactionTypes.SPENDS, TransactionTypes.SAVINGS, TransactionTypes.PRIVATE]

  const renderTransactions = async (
    req: Request,
    res: Response,
    accountCode: string,
    selectedTab: (typeof TransactionTypes)[keyof typeof TransactionTypes],
  ) => {
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

    const selectedDate = req.query.selectedDate ? req.query.selectedDate.toString() : undefined
    const dateSelectionRange = createDateSelectionRange(selectedDate)
    const dateRangeFrom = startOfMonth(selectedDate ? new Date(selectedDate) : new Date())
    const dateRangeTo = !isFuture(endOfMonth(dateRangeFrom)) ? endOfMonth(dateRangeFrom) : new Date()

    const balances = await services.prisonerProfileService.getBalances(req.user.idToken.booking.id)
    const prisons = await services.prisonerProfileService.getPrisonsByAgencyType(AgencyType.INST)
    const transactions = await services.prisonerProfileService.getTransactions(
      req.user,
      accountCode,
      dateRangeFrom,
      dateRangeTo,
    )

    const transactionsWithPrison = transactions.map(transaction => {
      const prisonDescription = prisons.find(p => p.agencyId === transaction.agencyId)?.description || ''
      return { ...transaction, prison: prisonDescription }
    })

    res.render('pages/transactions', {
      title: 'Transactions',
      config: getConfig(),
      data: {
        accountTypes,
        balance: getBalanceByAccountCode(balances, accountCode),
        contentHubTransactionsHelpLinkUrl: `${prisonerContentHubURL}/content/8534`,
        dateSelectionRange,
        hasDamageObligations: balances.damageObligations > 0,
        selectedDate,
        selectedTab,
        transactions: createTransactionTable(transactionsWithPrison),
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderDamageObligationsTransactions = async (req: Request, res: Response) => {
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

    const balances = await services.prisonerProfileService.getBalances(req.user.idToken.booking.id)
    const prisons = await services.prisonerProfileService.getPrisonsByAgencyType(AgencyType.INST)
    const { damageObligations } = await services.prisonerProfileService.getDamageObligations(req.user)

    const damageObligationsWithPrison = damageObligations.map(damageObligation => {
      const prisonDescription = prisons.find(p => p.agencyId === damageObligation.prisonId)?.description || ''
      return { ...damageObligation, prison: prisonDescription }
    })

    res.render('pages/transactions/damage-obligations', {
      title: 'Transactions',
      config: getConfig(),
      data: {
        accountTypes,
        balance: balances.damageObligations,
        contentHubTransactionsHelpLinkUrl: `${prisonerContentHubURL}/content/8534`,
        damageObligations: createDamageObligationsTable(damageObligationsWithPrison),
        selectedTab: TransactionTypes.DAMAGE_OBLIGATIONS,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  router.get(
    ['/', '/spends'],
    asyncHandler((req: Request, res: Response) =>
      renderTransactions(req, res, AccountCodes.SPENDS, TransactionTypes.SPENDS),
    ),
  )
  router.get(
    '/private',
    asyncHandler((req: Request, res: Response) =>
      renderTransactions(req, res, AccountCodes.PRIVATE, TransactionTypes.PRIVATE),
    ),
  )
  router.get(
    '/savings',
    asyncHandler((req: Request, res: Response) =>
      renderTransactions(req, res, AccountCodes.SAVINGS, TransactionTypes.SAVINGS),
    ),
  )
  router.get('/damage-obligations', asyncHandler(renderDamageObligationsTransactions))

  return router
}
