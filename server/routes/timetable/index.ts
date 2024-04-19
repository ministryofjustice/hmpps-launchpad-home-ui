import { type RequestHandler, Router } from 'express'
import { addDays, subDays } from 'date-fns'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
import { getEstablishmentLinksData } from '../../utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
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

    const events = await Promise.all([services.prisonerProfileService.getEventsFor(res.locals.user, fromDate, toDate)])
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

    return res.render('pages/timetable', {
      title: 'Timetable',
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
      linksData: {
        prisonerContentHubURL,
      },
    })
  })

  get('/last-week', async (req, res) => {
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

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

    const events = await Promise.all([services.prisonerProfileService.getEventsFor(res.locals.user, fromDate, toDate)])

    return res.render('pages/timetable', {
      title: 'Timetable',
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
      linksData: {
        prisonerContentHubURL,
      },
    })
  })

  get('/next-week', async (req, res) => {
    const { prisonerContentHubURL } =
      (await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)) || {}

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

    const events = await Promise.all([services.prisonerProfileService.getEventsFor(res.locals.user, fromDate, toDate)])

    return res.render('pages/timetable', {
      title: 'Timetable',
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
      linksData: {
        prisonerContentHubURL,
      },
    })
  })

  return router
}
