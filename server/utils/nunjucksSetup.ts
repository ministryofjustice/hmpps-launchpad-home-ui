/* eslint-disable no-param-reassign */
import * as pathModule from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import { initialiseName } from './utils'
import config from '../config'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Launchpad'

  app.locals.environment = process.env.NODE_ENV

  // Cachebusting version string
  if (config.production) {
    // Version only changes on reboot
    app.locals.version = Date.now().toString()
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/govuk-frontend/dist/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )
  njkEnv.addGlobal('ga4SiteId', config.analytics.ga4SiteId)
  njkEnv.addFilter('initialiseName', initialiseName)

  njkEnv.addFilter('toPagination', ({ page, totalPages }, query) => {
    const urlForPage = (n: number): string => {
      const urlSearchParams = new URLSearchParams(query)
      urlSearchParams.set('page', n.toString())
      return `?${urlSearchParams.toString()}`
    }

    const items = [...Array(totalPages).keys()].map(n => ({
      number: n + 1,
      href: urlForPage(n + 1),
      current: n + 1 === page,
    }))

    return {
      previous:
        page > 1
          ? {
              text: 'Previous',
              href: urlForPage(page - 1),
            }
          : null,
      next:
        page < totalPages
          ? {
              text: 'Next',
              href: urlForPage(page + 1),
            }
          : null,
      items,
    }
  })
}
