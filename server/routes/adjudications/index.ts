import { Request, Response, Router } from 'express'
import i18next from 'i18next'
import { Features } from '../../constants/featureFlags'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import type { Services } from '../../services'
import { formatAdjudication } from '../../utils/adjudications/formatAdjudication'
import { getPaginationData } from '../../utils/pagination/pagination'
import auditPageViewMiddleware from '../../middleware/auditPageViewMiddleware'
import { AUDIT_PAGE_NAMES } from '../../constants/audit'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware(Features.Adjudications),
    auditPageViewMiddleware(AUDIT_PAGE_NAMES.ADJUDICATIONS),
    async (req: Request, res: Response) => {
      const { user } = res.locals
      const language = req.language || i18next.language

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
          readMoreUrl: '/external/adjudications',
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    },
  )

  router.get(
    '/:chargeNumber',
    featureFlagMiddleware(Features.Adjudications),
    auditPageViewMiddleware(AUDIT_PAGE_NAMES.CHARGE),
    async (req: Request, res: Response) => {
      const { user } = res.locals

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
              readMoreUrl: '/external/adjudications',
            },
          })
    },
  )

  return router
}
