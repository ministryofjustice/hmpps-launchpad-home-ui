import { type RequestHandler, Router } from 'express'
import { getEstablishmentLinksData } from '../../utils/utils'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
import { featureFlags } from '../../constants/featureFlags'

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

    const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)

    const { given_name: givenName } = res.locals.user.idToken

    const prisonId = res.locals.user.idToken.establishment.agency_id
    const isVisitsEnabled = featureFlags.visits.enabled && featureFlags.visits.allowedPrisons.includes(prisonId)

    return res.render('pages/profile', {
      givenName,
      data: {
        incentivesData,
        incentivesReadMoreURL: `${prisonerContentHubURL}/tags/1417`,
        moneyReadMoreURL: `${prisonerContentHubURL}/tags/872`,
        prisonerContentHubURL: `${prisonerContentHubURL}/tags/1341`,
        timetableEvents: timetableEvents[0],
        visitsReadMoreURL: `${prisonerContentHubURL}/tags/1133`,
      },
      features: {
        isVisitsEnabled,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
