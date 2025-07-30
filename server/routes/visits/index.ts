import { Request, Response, Router } from 'express'

import { Features } from '../../constants/featureFlags'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

import type { Services } from '../../services'

import { getPaginationData } from '../../utils/pagination/pagination'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware(Features.SocialVisitors),
    asyncHandler(async (req: Request, res: Response) => {
      const { idToken } = req.user

      const socialVisitorsRes = await services.prisonerContactRegistryService.getSocialVisitors(
        idToken.sub,
        idToken.establishment.agency_id,
      )

      const paginationData = getPaginationData(Number(req.query.page), socialVisitorsRes.length)
      const socialVisitors = socialVisitorsRes
        .slice(paginationData.min - 1, paginationData.max)
        .map(visitor => [{ text: `${visitor.firstName} ${visitor.lastName}` }])

      await auditService.audit({
        what: AUDIT_EVENTS.VIEW_VISITS,
        idToken,
        details: { ...(req.query.page && { page: req.query.page }) },
      })

      return res.render('pages/visits', {
        data: {
          paginationData,
          rawQuery: req.query.page,
          readMoreUrl: '/external/visits',
          socialVisitors,
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
