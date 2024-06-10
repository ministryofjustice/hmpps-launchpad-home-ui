import { format } from 'date-fns'
import { Router, type RequestHandler } from 'express'

import { DateFormats } from '../../constants/date'
import { featureFlags } from '../../constants/featureFlags'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
import { getEstablishmentLinksData } from '../../utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const timetableEvents = await Promise.all([
      services.prisonerProfileService.getEventsForToday(res.locals.user, new Date()),
    ])

    const incentivesData = await services.prisonerProfileService.getIncentivesSummaryFor(res.locals.user)
    const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)
    const nextVisit = await services.prisonerProfileService.getNextVisit(res.locals.user.idToken.booking.id)

    const prisonId = res.locals.user.idToken.establishment.agency_id
    const isVisitsEnabled = featureFlags.visits.enabled && featureFlags.visits.allowedPrisons.includes(prisonId)

    const nextVisitData =
      nextVisit && Object.keys(nextVisit).length > 0
        ? {
            date: format(nextVisit.startTime, DateFormats.LONG_PRETTY_DATE),
            startTime: format(nextVisit.startTime, DateFormats.PRETTY_TIME),
            endTime: nextVisit.endTime ? format(nextVisit.endTime, DateFormats.PRETTY_TIME) : '',
            visitType: nextVisit.visitTypeDescription,
          }
        : null

    return res.render('pages/profile', {
      givenName: res.locals.user.idToken.given_name,
      data: {
        incentivesData,
        incentivesReadMoreURL: `${prisonerContentHubURL}/tags/1417`,
        moneyReadMoreURL: `${prisonerContentHubURL}/tags/872`,
        nextVisit: nextVisitData,
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
