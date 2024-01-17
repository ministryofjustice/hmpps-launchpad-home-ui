import { type RequestHandler, Router } from 'express'
import { getEstablishmentLinksData } from '../../utils/utils'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const today = new Date()

    const timetableEvents = await Promise.all([
      services.prisonerProfileService.getEventsFor(res.locals.user, today, today), // update to getEventsForToday()
    ])

    const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)

    const { given_name: givenName } = res.locals.user.idToken

    // console.log(timetableEvents)

    return res.render('pages/profile', {
      givenName,
      data: {
        timetableEvents,
        prisonerContentHubURL: `${prisonerContentHubURL}/tags/1341`,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
