import { Request, Response, Router } from 'express'
import * as z from 'zod'
import { Features } from '../../constants/featureFlags'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import type { Services } from '../../services'
import { getPaginationData } from '../../utils/pagination/pagination'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', featureFlagMiddleware(Features.SocialVisitors), async (req: Request, res: Response) => {
    const { idToken } = req.user

    const schema = z.object({
      page: z.coerce.number().int().min(1).optional(),
    })

    const query = schema.safeParse(req.query)

    if (!query.success) {
      return res.redirect('/visits')
    }

    const socialVisitorsRes = await services.prisonerContactRegistryService.getSocialVisitors(
      idToken.sub,
      idToken.establishment.agency_id,
    )

    const paginationData = getPaginationData(query.data.page, socialVisitorsRes.length)
    const socialVisitors = socialVisitorsRes
      .slice(paginationData.min - 1, paginationData.max)
      .map(visitor => [{ text: `${visitor.firstName} ${visitor.lastName}` }])

    await auditService.audit({
      what: AUDIT_EVENTS.VIEW_VISITS,
      idToken,
      details: { ...(query.data.page && { page: query.data.page }) },
    })

    return res.render('pages/visits', {
      data: {
        paginationData,
        rawQuery: query.data,
        readMoreUrl: '/external/visits',
        socialVisitors,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
