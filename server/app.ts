// eslint-disable-next-line import/order
import { initSentry, sentryErrorHandler } from './sentrySetup'

import express from 'express'
import createError from 'http-errors'
import path from 'path'

import errorHandler from './errorHandler'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import { metricsMiddleware } from './monitoring/metricsApp'
import nunjucksSetup from './utils/nunjucksSetup'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import setUpWebRequestParsing from './middleware/setupRequestParsing'

import adjudicationsRoutes from './routes/adjudications'
import indexRoutes from './routes/homepage'
import profileRoutes from './routes/profile'
import removeAccessRoutes from './routes/removeAccess'
import settingsRoutes from './routes/settings'
import timetableRoutes from './routes/timetable'
import transactionsRoutes from './routes/transactions'
import visitsRoutes from './routes/visits'

import type { Services } from './services'

initSentry()

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(metricsMiddleware)
  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())

  nunjucksSetup(app, path)

  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())

  app.use('/', indexRoutes(services))
  app.use('/adjudications', adjudicationsRoutes(services))
  app.use('/profile', profileRoutes(services))
  app.use('/remove-access', removeAccessRoutes(services))
  app.use('/settings', settingsRoutes(services))
  app.use('/timetable', timetableRoutes(services))
  app.use('/transactions', transactionsRoutes(services))
  app.use('/visits', visitsRoutes(services))

  app.use(sentryErrorHandler())

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
