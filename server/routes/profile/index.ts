import { format } from 'date-fns'
import { Request, Response, Router } from 'express'
import i18next from 'i18next'

import { DateFormats } from '../../constants/date'
import { Features } from '../../constants/featureFlags'

import { asyncHandler } from '../../middleware/asyncHandler'
import type { Services } from '../../services'

import { isFeatureEnabled } from '../../utils/featureFlag/featureFlagUtils'
import { formatBalances } from '../../utils/transactions/formatBalances'
import { getEstablishmentLinksData } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const language = req.language || i18next.language
      const { user } = res.locals
      const { idToken } = user
      const { establishment, booking } = idToken
      const prisonId = establishment.agency_id

      const timetableEvents = await Promise.all([
        services.prisonService.getEventsForToday(user.idToken.booking.id, language, new Date()),
      ])

      const { prisonerContentHubURL } = await getEstablishmentLinksData(prisonId)
      const { hasAdjudications } = await services.adjudicationsService.hasAdjudications(booking.id, prisonId)

      const incentivesData = await services.incentivesService.getIncentivesSummaryFor(user.idToken.booking.id)

      const nextVisit = await services.prisonService.getNextVisit(booking.id)
      const transactionsBalances = await services.prisonService.getBalances(booking.id)

      const visitBalances = await services.prisonService.getVisitBalances(req.user.idToken.sub)
      const visitsRemaining = visitBalances ? visitBalances.remainingPvo + visitBalances.remainingVo : 'N/A'

      const isAdjudicationsEnabled = isFeatureEnabled(Features.Adjudications, prisonId)
      const isSocialVisitorsEnabled = isFeatureEnabled(Features.SocialVisitors, prisonId)
      const isTransactionsEnabled = isFeatureEnabled(Features.Transactions, prisonId)
      const isVisitsEnabled = isFeatureEnabled(Features.Visits, prisonId)

      const nextVisitData =
        nextVisit && Object.keys(nextVisit).length > 0
          ? {
              date: format(nextVisit.startTime, DateFormats.LONG_PRETTY_DATE),
              startTime: format(nextVisit.startTime, DateFormats.PRETTY_TIME),
              endTime: nextVisit.endTime ? format(nextVisit.endTime, DateFormats.PRETTY_TIME) : '',
              visitType: nextVisit.visitTypeDescription,
              visitors: nextVisit.visitors,
            }
          : null

      return res.render('pages/profile', {
        title: 'Profile',
        givenName: idToken.given_name,
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
          socialVisitors: {
            isEnabled: isSocialVisitorsEnabled,
          },
          timetable: {
            timetableEvents: timetableEvents[0],
            readMoreUrl: `${prisonerContentHubURL}/tags/1341`,
          },
          transactions: {
            balances: formatBalances(transactionsBalances),
            readMoreUrl: `${prisonerContentHubURL}/tags/872`,
            isEnabled: isTransactionsEnabled,
          },
          visits: {
            nextVisit: nextVisitData,
            readMoreUrl: `${prisonerContentHubURL}/tags/1133`,
            visitsRemaining,
            isEnabled: isVisitsEnabled,
          },
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
