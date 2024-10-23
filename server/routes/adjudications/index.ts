import { Request, Response, Router } from 'express'

import { Features } from '../../constants/featureFlags'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

import type { Services } from '../../services'

import { formatAdjudication } from '../../utils/adjudications/formatAdjudication'
import { getPaginationData } from '../../utils/pagination/pagination'
import { getEstablishmentLinksData } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware(Features.Adjudications),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals

      const { prisonerContentHubURL } = getEstablishmentLinksData(user.idToken.establishment.agency_id) || {}
      const reportedAdjudications = await services.adjudicationsService.getReportedAdjudicationsFor(
        user.idToken.booking.id,
        user.idToken.establishment.agency_id,
      )

      const paginationData = getPaginationData(Number(req.query.page), reportedAdjudications.content.length)
      const pagedReportedAdjudications = reportedAdjudications.content.slice(paginationData.min - 1, paginationData.max)

      res.render('pages/adjudications', {
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
    '/:chargeNumber',
    featureFlagMiddleware('adjudications'),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals

      const { prisonerContentHubURL } = getEstablishmentLinksData(user.idToken.establishment.agency_id) || {}
      const { reportedAdjudication } = await services.adjudicationsService.getReportedAdjudication(
        req.params.chargeNumber,
        user.idToken.establishment.agency_id,
      )

      const formattedAdjudication = reportedAdjudication
        ? await formatAdjudication(reportedAdjudication, services)
        : null

      return res.render('pages/adjudication', {
        givenName: user.idToken.given_name,
        title: `View details of ${req.params.chargeNumber}`,
        data: {
          adjudication: formattedAdjudication,
          readMoreUrl: `${prisonerContentHubURL}/content/4193`,
        },
      })
    }),
  )

  return router
}
