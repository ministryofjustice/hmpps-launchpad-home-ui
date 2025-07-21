import cookieSession from 'cookie-session'
import express, { Express } from 'express'
import createError from 'http-errors'
import path from 'path'

import { csrfSync } from 'csrf-sync'
import * as auth from '../../authentication/auth'
import errorHandler from '../../errorHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import { Services } from '../../services'
import nunjucksSetup from '../../utils/nunjucksSetup'

import adjudicationsRoutes from '../adjudications/index'
import homepageRoutes from '../homepage/index'
import profileRoutes from '../profile/index'
import removeAccessRoutes from '../removeAccess/index'
import settingsRoutes from '../settings/index'
import timetableRoutes from '../timetable/index'
import transactionsRoutes from '../transactions/index'
import visitsRoutes from '../visits/index'
import externalRoutes from '../external/index'

export const idToken = {
  name: 'name',
  given_name: 'given name',
  family_name: 'family name',
  nonce: 'a nonce',
  iat: 123456,
  aud: 'aud',
  sub: 'sub',
  exp: 769012,
  booking: {
    id: '12345',
  },
  establishment: {
    id: '34567',
    agency_id: '67890',
    name: 'name',
    display_name: 'display name',
    youth: false,
  },
  iss: 'iss',
}

export const user = {
  refreshToken: 'REFRESH_TOKEN',
  idToken,
  accessToken: 'ACCESS_TOKEN',
  token: 'ACCESS_TOKEN',
}

export const flashProvider = jest.fn()

function appSetup(
  services: Services,
  production: boolean,
  userSupplier: () => Express.User,
  disableCsrf: boolean,
): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)
  app.use(cookieSession({ keys: [''] }))
  app.use((req, res, next) => {
    req.user = userSupplier()
    req.flash = flashProvider
    res.locals = {}
    res.locals.user = { ...req.user }
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  if (!disableCsrf) {
    const {
      csrfSynchronisedProtection, // This is the default CSRF protection middleware.
    } = csrfSync({
      // By default, csrf-sync uses x-csrf-token header, but we use the token in forms and send it in the request body, so change getTokenFromRequest so it grabs from there
      getTokenFromRequest: req => {
        // eslint-disable-next-line no-underscore-dangle
        return req.body._csrf
      },
    })

    app.use(csrfSynchronisedProtection)

    app.use((req, res, next) => {
      res.locals.csrfToken = req.csrfToken()
      next()
    })
  }

  app.use('/', homepageRoutes(services))
  app.use('/adjudications', featureFlagMiddleware('adjudications'), adjudicationsRoutes(services))
  app.use('/profile', profileRoutes(services))
  app.use('/remove-access', removeAccessRoutes(services))
  app.use('/settings', settingsRoutes(services))
  app.use('/timetable', timetableRoutes(services))
  app.use('/transactions', featureFlagMiddleware('transactions'), transactionsRoutes(services))
  app.use('/visits', featureFlagMiddleware('visits'), visitsRoutes(services))
  app.use('/external', externalRoutes())

  app.use((_req, _res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {},
  userSupplier = () => user,
  disableCsrf = false,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
  disableCsrf?: boolean
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services as Services, production, userSupplier, disableCsrf)
}
