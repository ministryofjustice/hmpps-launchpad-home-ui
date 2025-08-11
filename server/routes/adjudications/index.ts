import { Request, Response, Router } from 'express'
import i18next from 'i18next'
import * as z from 'zod'
import { Features } from '../../constants/featureFlags'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import type { Services } from '../../services'
import { formatAdjudication } from '../../utils/adjudications/formatAdjudication'
import { getPaginationData } from '../../utils/pagination/pagination'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'
import { ReportedAdjudicationDto } from '../../@types/adjudicationsApiTypes'

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
    let adjudicationData: ReportedAdjudicationDto = null

    const schema = z.object({
      chargeNumber: z.string().regex(/^[0-9a-zA-Z\\-]+$/),
    })

    const params = schema.safeParse(req.params)

    if (params.success) {
      const { reportedAdjudication } = await services.adjudicationsService.getReportedAdjudication(
        params.data.chargeNumber,
        idToken.establishment?.agency_id,
        idToken.sub,
      )

      if (reportedAdjudication && reportedAdjudication.prisonerNumber === idToken.sub) {
        adjudicationData = reportedAdjudication
      }
    }

    if (!adjudicationData) {
      res.redirect('/adjudications')
    } else {
      await auditService.audit({
        what: AUDIT_EVENTS.VIEW_CHARGE,
        idToken,
        details: { chargeNumber: params.data.chargeNumber },
      })

      const formattedAdjudication = await formatAdjudication(adjudicationData, services, idToken)

      res.render('pages/adjudication', {
        givenName: idToken.given_name,
        data: {
          adjudication: formattedAdjudication,
          chargeNumber: params.data.chargeNumber,
          readMoreUrl: '/external/adjudications',
        },
      })
    }
  })

  return router
}
