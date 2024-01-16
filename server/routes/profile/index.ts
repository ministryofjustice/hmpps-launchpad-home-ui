import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const today = new Date()

    const timetableEvents = await Promise.all([
      services.prisonerProfileService.getEventsFor(res.locals.user, today, today),
    ])

    const { given_name: givenName } = res.locals.user.idToken

    return res.render('pages/profile', {
      givenName,
      data: {
        timetableEvents,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
