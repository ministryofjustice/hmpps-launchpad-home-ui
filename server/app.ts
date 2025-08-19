import express from 'express'
import createError from 'http-errors'
import i18next from 'i18next'
import FilesystemBackend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'
import path from 'path'

import errorHandler from './errorHandler'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import { metricsMiddleware } from './monitoring/metricsApp'
import { initSentry, sentryErrorHandler } from './sentrySetup'
import nunjucksSetup from './utils/nunjucksSetup'

import { setTranslationsEnabled } from './middleware/setTranslationsEnabled'
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
import externalRoutes from './routes/external'

import { setPrisonerContentHubUrl } from './middleware/setPrisonerContentHubUrl'
import type { Services } from './services'

initSentry()

i18next
  .use(middleware.LanguageDetector)
  .use(FilesystemBackend)
  .init({
    preload: ['en', 'cy'],
    supportedLngs: ['en', 'cy'],
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
    },
    detection: {
      caches: ['cookie'],
    },
  })

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(
    middleware.handle(i18next, {
      ignoreRoutes: ['/foo'],
      removeLngFromUrl: false,
    }),
  )

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
  app.use(setTranslationsEnabled)
  app.use(setPrisonerContentHubUrl)

  app.use('/', indexRoutes(services))
  app.use('/adjudications', adjudicationsRoutes(services))
  app.use('/profile', profileRoutes(services))
  app.use('/remove-access', removeAccessRoutes(services))
  app.use('/settings', settingsRoutes(services))
  app.use('/timetable', timetableRoutes(services))
  app.use('/transactions', transactionsRoutes(services))
  app.use('/visits', visitsRoutes(services))
  app.use('/external', externalRoutes())

  app.use(sentryErrorHandler())

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
