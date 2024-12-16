import { addDays, subDays } from 'date-fns'
import { type RequestHandler, Router } from 'express'
import i18next from 'i18next'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const language = req.language || i18next.language

    const config = {
      content: false,
      header: false,
      postscript: true,
      detailsType: 'small',
      lastWeek: false,
      nextWeek: false,
    }

    const fromDate = new Date()
    const toDate = addDays(fromDate, 6)

    const events = await Promise.all([
      services.prisonService.getEventsFor(res.locals.user.idToken.booking.id, fromDate, toDate, language),
    ])

    return res.render('pages/timetable', {
      givenName: res.locals.user.idToken.given_name,
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  get('/last-week', async (req, res) => {
    const language = req.language || i18next.language

    const config = {
      content: false,
      header: false,
      postscript: true,
      detailsType: 'small',
      lastWeek: true,
      nextWeek: false,
    }

    const today = new Date()
    const fromDate = subDays(today, 7)
    const toDate = subDays(today, 1)

    const events = await Promise.all([
      services.prisonService.getEventsFor(res.locals.user.idToken.booking.id, fromDate, toDate, language),
    ])

    return res.render('pages/timetable', {
      givenName: res.locals.user.idToken.given_name,
      title: 'Timetable',
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  get('/next-week', async (req, res) => {
    const language = req.language || i18next.language

    const config = {
      content: false,
      header: false,
      postscript: true,
      detailsType: 'small',
      lastWeek: false,
      nextWeek: true,
    }

    const today = new Date()
    const fromDate = addDays(today, 7)
    const toDate = addDays(fromDate, 6)

    const events = await Promise.all([
      services.prisonService.getEventsFor(res.locals.user.idToken.booking.id, fromDate, toDate, language),
    ])

    return res.render('pages/timetable', {
      givenName: res.locals.user.idToken.given_name,
      title: 'Timetable',
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
