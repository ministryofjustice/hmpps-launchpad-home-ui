import { Request, Response, Router } from 'express'
import i18next from 'i18next'

import { Features } from '../../constants/featureFlags'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

import type { Services } from '../../services'

import { formatAdjudication } from '../../utils/adjudications/formatAdjudication'
import { getPaginationData } from '../../utils/pagination/pagination'
import { getEstablishmentData } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware(Features.Adjudications),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals
      const language = req.language || i18next.language

      const { prisonerContentHubURL } = getEstablishmentData(user.idToken.establishment.agency_id) || {}
      const reportedAdjudications = await services.adjudicationsService.getReportedAdjudicationsFor(
        user.idToken.booking.id,
        user.idToken.establishment.agency_id,
        language,
        user.idToken.sub,
      )

      const paginationData = getPaginationData(Number(req.query.page), reportedAdjudications.content.length)
      const pagedReportedAdjudications = reportedAdjudications.content.slice(paginationData.min - 1, paginationData.max)

      res.render('pages/adjudications', {
        givenName: user.idToken.given_name,
        data: {
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

      const { prisonerContentHubURL } = getEstablishmentData(user.idToken.establishment.agency_id) || {}
      const { reportedAdjudication } = await services.adjudicationsService.getReportedAdjudication(
        req.params.chargeNumber,
        user.idToken.establishment?.agency_id,
        user.idToken.sub,
      )

      const formattedAdjudication = reportedAdjudication
        ? await formatAdjudication(reportedAdjudication, services, user.idToken)
        : null

      return user.idToken.sub !== reportedAdjudication.prisonerNumber
        ? res.redirect('/adjudications')
        : res.render('pages/adjudication', {
            givenName: user.idToken.given_name,
            data: {
              adjudication: formattedAdjudication,
              chargeNumber: req.params.chargeNumber,
              readMoreUrl: `${prisonerContentHubURL}/content/4193`,
            },
          })
    }),
  )

  return router
}
