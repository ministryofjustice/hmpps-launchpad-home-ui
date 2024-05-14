import { endOfMonth, startOfMonth } from 'date-fns'
import { Request, Response, Router } from 'express'

import { TransactionTypes } from '../../constants/transactions'
import { asyncHandler } from '../../middleware/asyncHandler'
import type { Services } from '../../services'
import { createDateSelectionRange } from '../../utils/date'
import { createTransactionTable } from '../../utils/transactions'
import { getEstablishmentLinksData } from '../../utils/utils'
import { getConfig } from '../config'

export default function routes(services: Services): Router {
  const router = Router()

  const accountTypes = [TransactionTypes.SPENDS, TransactionTypes.SAVINGS, TransactionTypes.PRIVATE]

  const renderSpendsTransactions = async (req: Request, res: Response) => {
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

    const selectedDate = req.query.selectedDate ? req.query.selectedDate.toString() : undefined
    const dateSelectionRange = createDateSelectionRange(selectedDate)

    const fromDate = startOfMonth(new Date())
    const toDate = endOfMonth(fromDate)

    const balances = await services.prisonerProfileService.getBalances(req.user.idToken.booking.id)
    const transactions = await services.prisonerProfileService.getTransactions(
      req.user,
      TransactionTypes.SPENDS,
      fromDate,
      toDate,
    )

    res.render('pages/transactions', {
      title: 'Transactions',
      config: getConfig(),
      data: {
        accountTypes,
        balance: balances.spends,
        contentHubTransactionsHelpLinkUrl: `${prisonerContentHubURL}/content/8534`,
        dateSelectionRange,
        hasDamageObligations: balances.damageObligations > 0,
        selectedDate: req.query.selectedDate,
        selectedTab: TransactionTypes.SPENDS,
        transactions: createTransactionTable(transactions),
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderPrivateTransactions = async (req: Request, res: Response) => {
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

    const selectedDate = req.query.selectedDate ? req.query.selectedDate.toString() : undefined
    const dateSelectionRange = createDateSelectionRange(selectedDate)

    const fromDate = startOfMonth(new Date())
    const toDate = endOfMonth(fromDate)

    const balances = await services.prisonerProfileService.getBalances(req.user.idToken.booking.id)
    const transactions = await services.prisonerProfileService.getTransactions(
      req.user,
      TransactionTypes.PRIVATE,
      fromDate,
      toDate,
    )

    res.render('pages/transactions', {
      title: 'Transactions',
      config: getConfig(),
      data: {
        accountTypes,
        balance: balances.cash,
        contentHubTransactionsHelpLinkUrl: `${prisonerContentHubURL}/content/8534`,
        dateSelectionRange,
        hasDamageObligations: balances.damageObligations > 0,
        selectedDate: req.query.selectedDate,
        selectedTab: TransactionTypes.PRIVATE,
        transactions,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderSavingsTransactions = async (req: Request, res: Response) => {
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

    const selectedDate = req.query.selectedDate ? req.query.selectedDate.toString() : undefined
    const dateSelectionRange = createDateSelectionRange(selectedDate)

    const fromDate = startOfMonth(new Date())
    const toDate = endOfMonth(fromDate)

    const balances = await services.prisonerProfileService.getBalances(req.user.idToken.booking.id)
    const transactions = await services.prisonerProfileService.getTransactions(
      req.user,
      TransactionTypes.SAVINGS,
      fromDate,
      toDate,
    )

    res.render('pages/transactions', {
      title: 'Transactions',
      config: getConfig(),
      data: {
        accountTypes,
        balance: balances.savings,
        contentHubTransactionsHelpLinkUrl: `${prisonerContentHubURL}/content/8534`,
        dateSelectionRange,
        hasDamageObligations: balances.damageObligations > 0,
        selectedDate: req.query.selectedDate,
        selectedTab: TransactionTypes.SAVINGS,
        transactions,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderDamageObligationsTransactions = async (req: Request, res: Response) => {
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

    const selectedDate = req.query.selectedDate ? req.query.selectedDate.toString() : undefined
    const dateSelectionRange = createDateSelectionRange(selectedDate)

    const fromDate = startOfMonth(new Date())
    const toDate = endOfMonth(fromDate)

    const balances = await services.prisonerProfileService.getBalances(req.user.idToken.booking.id)
    const transactions = await services.prisonerProfileService.getTransactions(
      req.user,
      TransactionTypes.DAMAGE_OBLIGATIONS,
      fromDate,
      toDate,
    )

    res.render('pages/transactions/damage-obligations', {
      title: 'Transactions',
      config: getConfig(),
      data: {
        accountTypes,
        balance: balances.damageObligations,
        contentHubTransactionsHelpLinkUrl: `${prisonerContentHubURL}/content/8534`,
        dateSelectionRange,
        hasDamageObligations: balances.damageObligations > 0,
        selectedDate: req.query.selectedDate,
        selectedTab: TransactionTypes.DAMAGE_OBLIGATIONS,
        transactions,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  router.get(['/', '/spends'], asyncHandler(renderSpendsTransactions))
  router.get('/private', asyncHandler(renderPrivateTransactions))
  router.get('/savings', asyncHandler(renderSavingsTransactions))
  router.get('/damage-obligations', asyncHandler(renderDamageObligationsTransactions))

  return router
}
