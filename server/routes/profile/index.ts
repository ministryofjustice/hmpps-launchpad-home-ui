import { format } from 'date-fns'
import { Request, Response, Router } from 'express'
import i18next from 'i18next'
import { DateFormats } from '../../constants/date'
import { Features } from '../../constants/featureFlags'
import type { Services } from '../../services'
import { isFeatureEnabled } from '../../utils/featureFlag/featureFlagUtils'
import { formatBalances } from '../../utils/transactions/formatBalances'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', async (req: Request, res: Response) => {
    const language = req.language || i18next.language
    const { idToken } = res.locals.user
    const { establishment, booking } = idToken

    const timetableEvents = await Promise.all([
      services.prisonService.getEventsForToday(
        idToken.booking.id,
        language,
        idToken.sub,
        idToken.establishment.agency_id,
        new Date(),
      ),
    ])

    const { hasAdjudications } = await services.adjudicationsService.hasAdjudications(
      booking.id,
      establishment.agency_id,
      idToken.sub,
    )

    const incentivesData = await services.incentivesService.getIncentivesSummaryFor(
      booking.id,
      idToken.sub,
      establishment.agency_id,
    )

    const nextVisit = await services.prisonService.getNextVisit(booking.id, idToken.sub, establishment.agency_id)
    const transactionsBalances = await services.prisonService.getBalances(
      booking.id,
      idToken.sub,
      establishment.agency_id,
    )

    const visitBalances = await services.prisonService.getVisitBalances(req.user.idToken.sub, establishment.agency_id)
    const visitsRemaining = visitBalances ? visitBalances.remainingPvo + visitBalances.remainingVo : 'N/A'

    const isAdjudicationsEnabled = isFeatureEnabled(Features.Adjudications, establishment.agency_id)
    const isSocialVisitorsEnabled = isFeatureEnabled(Features.SocialVisitors, establishment.agency_id)
    const isTransactionsEnabled = isFeatureEnabled(Features.Transactions, establishment.agency_id)
    const isVisitsEnabled = isFeatureEnabled(Features.Visits, establishment.agency_id)

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

    await auditService.audit({ what: AUDIT_EVENTS.VIEW_PROFILE, idToken })

    return res.render('pages/profile', {
      title: 'Profile',
      givenName: idToken.given_name,
      data: {
        adjudications: {
          hasAdjudications,
          readMoreUrl: '/external/adjudications',
          isEnabled: isAdjudicationsEnabled,
        },
        incentives: {
          incentivesData,
          readMoreUrl: '/external/incentives',
        },
        socialVisitors: {
          isEnabled: isSocialVisitorsEnabled,
        },
        timetable: {
          timetableEvents: timetableEvents[0],
          readMoreUrl: '/external/learning-and-skills',
        },
        transactions: {
          balances: formatBalances(transactionsBalances),
          readMoreUrl: '/external/money-and-debt',
          isEnabled: isTransactionsEnabled,
        },
        visits: {
          nextVisit: nextVisitData,
          readMoreUrl: '/external/visits',
          visitsRemaining,
          isEnabled: isVisitsEnabled,
        },
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
