import path from 'path'
import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'

import homepageRoutes from '../homepage/index'
import profileRoutes from '../profile/index'
import timetableRoutes from '../timetable/index'
import visitsRoutes from '../visits/index'
import transactionsRoutes from '../transactions/index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import { Services } from '../../services'

export const idToken = {
  name: 'name',
  given_name: 'given name',
  family_name: 'family name',
  nonce: 'a nonce',
  iat: 123456,
  aud: 'aud',
  sub: 'sub',
  exp: 12345,
  booking: {
    id: '12345',
  },
  establishment: {
    id: '12345',
    agency_id: '12345',
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

function appSetup(services: Services, production: boolean, userSupplier: () => Express.User): Express {
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
  app.use('/', homepageRoutes(services))
  app.use('/profile', profileRoutes(services))
  app.use('/timetable', timetableRoutes(services))
  app.use('/transactions', transactionsRoutes(services))
  app.use('/visits', visitsRoutes(services))
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {},
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services as Services, production, userSupplier)
}
