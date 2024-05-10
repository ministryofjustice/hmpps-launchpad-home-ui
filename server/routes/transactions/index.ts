import { Request, Response, Router } from 'express'

import { endOfMonth, startOfMonth } from 'date-fns'
import type { Services } from '../../services'
import { asyncHandler } from '../../utils/asyncHandler'
import { getConfig } from '../config'
import { transactionTypes } from '../../constants/transactions'

export default function routes(services: Services): Router {
  const router = Router()

  const renderSpendsTransactions = async (req: Request, res: Response) => {
    const { selectedDate } = req.query

    const fromDate = startOfMonth(new Date())
    const toDate = endOfMonth(fromDate)

    // const transactionsRes = await services.prisonerProfileService.getTransactions(
    //   req.user,
    //   transactionTypes.SPENDS,
    //   fromDate,
    //   toDate,
    // )
    // console.log({ transactionsRes })

    res.render('pages/transactions', {
      title: 'Transactions',
      config: getConfig(),
      data: {},
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderPrivateTransactions = async (req: Request, res: Response) => {
    res.render('pages/transactions', {
      title: 'Transactions',
      config: getConfig(),
      data: {},
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderSavingsTransactions = async (req: Request, res: Response) => {
    res.render('pages/transactions', {
      title: 'Transactions',
      config: getConfig(),
      data: {},
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderDamageObligationsTransactions = async (req: Request, res: Response) => {
    res.render('pages/transactions/damage-obligations', {
      title: 'Transactions',
      config: getConfig(),
      data: {},
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
