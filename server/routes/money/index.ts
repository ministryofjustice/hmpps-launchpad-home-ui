import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
// import { getEstablishmentLinksData, processSelectedDate } from '../../utils/utils'
// import {
//   createTransactionsResponseFrom,
//   createDamageObligationsResponseFrom,
//   createPendingTransactionsResponseFrom,
// } from '../../utils/formatters'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get(['/transactions', '/transactions/spends'], async (req, res, next) => {
    // const templateData = {
    //   title: 'My transactions',
    //   config: {
    //     content: false,
    //     header: false,
    //     postscript: true,
    //     detailsType: 'small',
    //   },
    // }

    const accountCode = 'spends'
    // const { selectedDate } = req.query // added when using UI view by month and year element
    // const { dateSelection, fromDate, toDate } = processSelectedDate(selectedDate?.toString())

    // const transactionsData = await Promise.all([
    //   services.prisonerProfileService.getTransactionsFor(res.locals.user, accountCode, fromDate, toDate),
    // ])

    // if (!transactionsData) {
    //   return next(new Error('Failed to fetch transaction data'))
    // }

    // const { transactions, balances } = transactionsData

    // const {
    //   transactions: formattedTransactions,
    //   balance: formattedBalances,
    //   shouldShowDamageObligationsTab,
    // } = createTransactionsResponseFrom(accountCode, {
    //   transactions,
    //   balances,
    // })

    const displayDamageObligationsTab = true
    const { prisonerContentHubURL } = await services.linksService.getHomepageLinks(res.locals.user)
    const data = {
      selected: accountCode,
      accountTypes: ['spends', 'private', 'savings'],
      displayDamageObligationsTab,
    }

    return res.render('pages/transactions', {
      title: 'Transactions',
      contentHubTransactionsHelpLinkURL: `${prisonerContentHubURL}/content/8534`,
      data,
      // transactionsData,
    })
  })

  get('/damage-obligations', async (req, res, next) => {
    res.json({ route: 'money > damage-obligations' })
  })

  get('/transactions/savings', async (req, res, next) => {
    res.json({ route: 'money > transactions > savings' })
  })

  get('/transactions/private', async (req, res, next) => {
    res.json({ route: 'money > transactions > private' })
  })

  return router
}
