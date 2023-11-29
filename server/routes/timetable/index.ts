import { type RequestHandler, Router } from 'express'
import { addDays } from 'date-fns'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    // const config = {
    //   content: false,
    //   header: false,
    //   postscript: true,
    //   detailsType: 'small',
    //   lastWeek: false,
    //   nextWeek: false,
    // }

    const config = {
      lastWeek: false,
      nextWeek: false,
    }

    const fromDate = new Date()
    const toDate = addDays(fromDate, 6)

    const events = await services.prisonerProfileService.getEventsFor(res.locals.user, fromDate, toDate)

    // console.log('events--------', events)
    return res.render('pages/timetable', {
      title: 'Timetable',
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  // get('/lastweek', (req, res) => {
  //   console.log('last week')
  // })

  // get('/nextweek', (req, res) => {
  //   console.log('next week')
  // })

  return router
}
