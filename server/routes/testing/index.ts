import { format } from 'date-fns'
import { Request, Response, Router } from 'express'

import { DateFormats } from '../../constants/date'

import type { Services } from '../../services'

import { asyncHandler } from '../../middleware/asyncHandler'
import { formatAdjudication } from '../../utils/adjudications/formatAdjudication'
import { getPaginationData } from '../../utils/pagination/pagination'
import { getEstablishmentLinksData } from '../../utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/ib48d19u/profile',
    asyncHandler(async (req: Request, res: Response) => {
      const timetableEvents = await Promise.all([services.prisonService.getEventsForToday(res.locals.user, new Date())])

      const prisonId = res.locals.user.idToken.establishment.agency_id

      const { prisonerContentHubURL } = await getEstablishmentLinksData(prisonId)
      const { hasAdjudications } = await services.adjudicationsService.hasAdjudications(res.locals.user)

      const incentivesData = await services.incentivesService.getIncentivesSummaryFor(res.locals.user)
      const nextVisit = await services.prisonService.getNextVisit(res.locals.user.idToken.booking.id)
      const transactionsBalances = await services.prisonService.getBalances(req.user.idToken.booking.id)

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
            isEnabled: true,
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
            balances: transactionsBalances,
            readMoreUrl: `${prisonerContentHubURL}/tags/872`,
            isEnabled: true,
          },
          visits: {
            nextVisit: nextVisitData,
            readMoreUrl: `${prisonerContentHubURL}/tags/1133`,
            isEnabled: true,
          },
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  router.get(
    '/ib48d19u/adjudications',
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals

      const { prisonerContentHubURL } = getEstablishmentLinksData(user.idToken.establishment.agency_id) || {}
      const reportedAdjudications = await services.adjudicationsService.getReportedAdjudicationsFor(
        user.idToken.booking.id,
        user.idToken.establishment.agency_id,
      )

      const paginationData = getPaginationData(Number(req.query.page), reportedAdjudications.content.length)
      const pagedReportedAdjudications = reportedAdjudications.content.slice(paginationData.min - 1, paginationData.max)

      res.render('pages/testing/adjudications', {
        givenName: user.idToken.given_name,
        data: {
          title: 'Adjudications',
          paginationData,
          rawQuery: req.query.page,
          reportedAdjudications: pagedReportedAdjudications,
          readMoreUrl: `${prisonerContentHubURL}/content/4193`,
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  router.get(
    '/ib48d19u/adjudications/:chargeNumber',
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals

      const { prisonerContentHubURL } = getEstablishmentLinksData(user.idToken.establishment.agency_id) || {}
      const { reportedAdjudication } = await services.adjudicationsService.getReportedAdjudication(
        req.params.chargeNumber,
        user.idToken.establishment.agency_id,
      )
      const formattedAdjudication = await formatAdjudication(reportedAdjudication, services)

      res.render('pages/adjudication', {
        givenName: user.idToken.given_name,
        title: `View details of ${reportedAdjudication.chargeNumber}`,
        data: {
          adjudication: formattedAdjudication,
          readMoreUrl: `${prisonerContentHubURL}/content/4193`,
        },
      })
    }),
  )

  router.get(
    '/ib48d19u/visits',
    asyncHandler(async (req: Request, res: Response) => {
      const { prisonerContentHubURL } = getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id) || {}
      const socialVisitorsRes = await services.prisonerContactRegistryService.getSocialVisitors(req.user.idToken.sub)

      const paginationData = getPaginationData(Number(req.query.page), socialVisitorsRes.length)
      const socialVisitors = socialVisitorsRes
        .slice(paginationData.min - 1, paginationData.max)
        .map(visitor => [{ text: `${visitor.firstName} ${visitor.lastName}` }])

      return res.render('pages/visits', {
        data: {
          title: 'Social visitors',
          paginationData,
          rawQuery: req.query.page,
          readMoreUrl: `${prisonerContentHubURL}/tags/1133`,
          socialVisitors,
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
