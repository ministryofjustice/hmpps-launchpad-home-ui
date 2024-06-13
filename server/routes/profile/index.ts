import { format } from 'date-fns'
import { Router, type RequestHandler } from 'express'

import { DateFormats } from '../../constants/date'
import { Features } from '../../constants/featureFlags'

import asyncMiddleware from '../../middleware/asyncMiddleware'

import type { Services } from '../../services'

import { isFeatureEnabled } from '../../utils/featureFlagUtils'
import { getEstablishmentLinksData } from '../../utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const timetableEvents = await Promise.all([
      services.prisonerProfileService.getEventsForToday(res.locals.user, new Date()),
    ])

    const prisonId = res.locals.user.idToken.establishment.agency_id
    const { prisonerContentHubURL } = await getEstablishmentLinksData(prisonId)
    const { hasAdjudications } = await services.prisonerProfileService.hasAdjudications(res.locals.user)
    const incentivesData = await services.prisonerProfileService.getIncentivesSummaryFor(res.locals.user)
    const nextVisit = await services.prisonerProfileService.getNextVisit(res.locals.user.idToken.booking.id)

    const isAdjudicationsEnabled = isFeatureEnabled(Features.Adjudications, prisonId)
    const isTransactionsEnabled = isFeatureEnabled(Features.Transactions, prisonId)
    const isVisitsEnabled = isFeatureEnabled(Features.Visits, prisonId)

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
      title: 'Profile',
      givenName: res.locals.user.idToken.given_name,
      data: {
        adjudications: {
          hasAdjudications,
          readMoreUrl: `${prisonerContentHubURL}/content/4193`,
          isEnabled: isAdjudicationsEnabled,
        },
        incentives: {
          incentivesData,
          readMoreUrl: `${prisonerContentHubURL}/tags/1417`,
        },
        timetable: {
          timetableEvents: timetableEvents[0],
          readMoreUrl: `${prisonerContentHubURL}/tags/1341`,
        },
        transactions: {
          readMoreUrl: `${prisonerContentHubURL}/tags/872`,
          isEnabled: isTransactionsEnabled,
        },
        visits: {
          nextVisit: nextVisitData,
          readMoreUrl: `${prisonerContentHubURL}/tags/1133`,
          isEnabled: isVisitsEnabled,
        },
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
