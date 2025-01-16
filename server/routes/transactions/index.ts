import { endOfMonth, isFuture, startOfMonth } from 'date-fns'
import { Request, Response, Router } from 'express'
import i18next from 'i18next'

import { AgencyType } from '../../constants/agency'
import { Features } from '../../constants/featureFlags'
import { AccountCodes, AccountTypes, TransactionTypes } from '../../constants/transactions'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

import type { Services } from '../../services'

import { createDateSelectionRange } from '../../utils/date/date'
import { createDamageObligationsTable } from '../../utils/transactions/createDamageObligationsTable'
import { createTransactionTable } from '../../utils/transactions/createTransactionTable'
import { getBalanceByAccountCode } from '../../utils/transactions/getBalanceByAccountCode'

import { getConfig } from '../config'

export default function routes(services: Services): Router {
  const router = Router()

  const renderTransactions = async (
    req: Request,
    res: Response,
    accountCode: string,
    selectedTab: (typeof TransactionTypes)[keyof typeof TransactionTypes],
  ) => {
    const language = req.language || i18next.language

    const selectedDate = req.query.selectedDate ? req.query.selectedDate.toString() : undefined
    const dateSelectionRange = createDateSelectionRange({ language, selectedDate })
    const dateRangeFrom = startOfMonth(selectedDate ? new Date(selectedDate) : new Date())
    const dateRangeTo = !isFuture(endOfMonth(dateRangeFrom)) ? endOfMonth(dateRangeFrom) : new Date()

    const balances = await services.prisonService.getBalances(req.user.idToken.booking.id)
    const prisons = await services.prisonService.getPrisonsByAgencyType(AgencyType.INST)
    const transactions = await services.prisonService.getTransactions(req.user, accountCode, dateRangeFrom, dateRangeTo)

    const transactionsWithPrison = transactions.map(transaction => {
      const prisonDescription = prisons.find(p => p.agencyId === transaction.agencyId)?.description || ''
      return { ...transaction, prison: prisonDescription }
    })

    res.render('pages/transactions', {
      title: 'Transactions',
      config: getConfig(),
      data: {
        accountTypes: AccountTypes,
        balance: getBalanceByAccountCode(balances, accountCode),
        contentHubTransactionsHelpLinkUrl: `/content/8534`,
        dateSelectionRange,
        hasDamageObligations: balances.damageObligations > 0,
        selectedDate,
        selectedTab,
        transactions: createTransactionTable(transactionsWithPrison, language),
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderDamageObligationsTransactions = async (req: Request, res: Response) => {
    const language = req.language || i18next.language

    const balances = await services.prisonService.getBalances(req.user.idToken.booking.id)
    const prisons = await services.prisonService.getPrisonsByAgencyType(AgencyType.INST)
    const { damageObligations } = await services.prisonService.getDamageObligations(req.user)

    const damageObligationsWithPrison = damageObligations.map(damageObligation => {
      const prisonDescription = prisons.find(p => p.agencyId === damageObligation.prisonId)?.description || ''
      return { ...damageObligation, prison: prisonDescription }
    })

    res.render('pages/transactions/damage-obligations', {
      title: 'Transactions',
      config: getConfig(),
      data: {
        accountTypes: AccountTypes,
        balance: balances.damageObligations,
        contentHubTransactionsHelpLinkUrl: `/content/8534`,
        damageObligations: createDamageObligationsTable(damageObligationsWithPrison, language),
        selectedTab: TransactionTypes.DAMAGE_OBLIGATIONS,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const transactionRoutes = [
    { path: ['/', '/spends'], accountCode: AccountCodes.SPENDS, transactionType: TransactionTypes.SPENDS },
    { path: '/private', accountCode: AccountCodes.PRIVATE, transactionType: TransactionTypes.PRIVATE },
    { path: '/savings', accountCode: AccountCodes.SAVINGS, transactionType: TransactionTypes.SAVINGS },
  ]

  transactionRoutes.forEach(({ path, accountCode, transactionType }) => {
    router.get(
      path,
      featureFlagMiddleware(Features.Transactions),
      asyncHandler((req: Request, res: Response) => {
        return renderTransactions(req, res, accountCode, transactionType)
      }),
    )
  })

  router.get(
    '/damage-obligations',
    featureFlagMiddleware(Features.Transactions),
    asyncHandler(renderDamageObligationsTransactions),
  )

  return router
}
