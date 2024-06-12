import { Request, Response, Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

import type { Services } from '../../services'

import { formatReportedAdjudication } from '../../utils/adjudications/formatReportedAdjudication'
import { getEstablishmentLinksData } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware('adjudications'),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals

      const { prisonerContentHubURL } = getEstablishmentLinksData(user.idToken.establishment.agency_id) || {}
      const reportedAdjudications = await services.prisonerProfileService.getReportedAdjudicationsFor(
        user.idToken.booking.id,
        user.idToken.establishment.agency_id,
      )
      const displayPagination = reportedAdjudications.totalPages > 1

      res.render('pages/adjudications', {
        givenName: user.idToken.given_name,
        title: 'Adjudications',
        data: {
          reportedAdjudications,
          displayPagination,
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
      const { reportedAdjudication } = await services.prisonerProfileService.getReportedAdjudication(
        req.params.chargeNumber,
        user.idToken.establishment.agency_id,
      )
      const formattedAdjudication = await formatReportedAdjudication(reportedAdjudication, services)

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

  return router
}
