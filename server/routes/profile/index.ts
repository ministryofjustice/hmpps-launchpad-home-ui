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
      services.prisonerProfileService.getEventsForToday(res.locals.user, today),
    ])

    const incentivesData = await services.prisonerProfileService.getIncentivesSummaryFor(res.locals.user)

    const { hasAdjudications } = await services.prisonerProfileService.hasAdjudications(res.locals.user)

    // const adjudicationsData = await services.prisonerProfileService.getIncentivesSummaryFor(res.locals.user)

    const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)

    return res.render('pages/profile', {
      givenName: res.locals.user.idToken.given_name,
      data: {
        timetableEvents: timetableEvents[0],
        incentivesData,
        prisonerContentHubURL: `${prisonerContentHubURL}/tags/1341`,
        incentivesReadMoreURL: `${prisonerContentHubURL}/tags/1417`,
        hasAdjudications,
        adjudicationsReadMoreURL: `${prisonerContentHubURL}/content/4193`,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
