import { Request, Response, Router } from 'express'
import i18next from 'i18next'
import { Features } from '../../constants/featureFlags'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import type { Services } from '../../services'
import { formatAdjudication } from '../../utils/adjudications/formatAdjudication'
import { getPaginationData } from '../../utils/pagination/pagination'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', featureFlagMiddleware(Features.Adjudications), async (req: Request, res: Response) => {
    const { idToken } = res.locals.user
    const language = req.language || i18next.language

    const reportedAdjudications = await services.adjudicationsService.getReportedAdjudicationsFor(
      idToken.booking.id,
      idToken.establishment.agency_id,
      language,
      idToken.sub,
    )

    const paginationData = getPaginationData(Number(req.query.page), reportedAdjudications.content.length)
    const pagedReportedAdjudications = reportedAdjudications.content.slice(paginationData.min - 1, paginationData.max)

    await auditService.audit({
      what: AUDIT_EVENTS.VIEW_ADJUDICATIONS,
      idToken,
      details: { ...(req.query.page && { page: req.query.page }) },
    })

    res.render('pages/adjudications', {
      givenName: idToken.given_name,
      data: {
        paginationData,
        rawQuery: req.query.page,
        reportedAdjudications: pagedReportedAdjudications,
        readMoreUrl: '/external/adjudications',
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  router.get('/:chargeNumber', featureFlagMiddleware(Features.Adjudications), async (req: Request, res: Response) => {
    const { idToken } = res.locals.user

    const { reportedAdjudication } = await services.adjudicationsService.getReportedAdjudication(
      req.params.chargeNumber,
      idToken.establishment?.agency_id,
      idToken.sub,
    )

    const formattedAdjudication = reportedAdjudication
      ? await formatAdjudication(reportedAdjudication, services, idToken)
      : null

    if (idToken.sub !== reportedAdjudication.prisonerNumber) {
      res.redirect('/adjudications')
    } else {
      await auditService.audit({
        what: AUDIT_EVENTS.VIEW_CHARGE,
        idToken,
        details: { chargeNumber: req.params.chargeNumber },
      })

      res.render('pages/adjudication', {
        givenName: idToken.given_name,
        data: {
          adjudication: formattedAdjudication,
          chargeNumber: req.params.chargeNumber,
          readMoreUrl: '/external/adjudications',
        },
      })
    }
  })

  return router
}
