import { Request, Response, Router } from 'express'

import { Features } from '../../constants/featureFlags'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

import type { Services } from '../../services'

import { getPaginationData } from '../../utils/pagination/pagination'
import auditPageViewMiddleware from '../../middleware/auditPageViewMiddleware'
import { AUDIT_PAGE_NAMES } from '../../constants/audit'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware(Features.SocialVisitors),
    auditPageViewMiddleware(AUDIT_PAGE_NAMES.VISITS),
    asyncHandler(async (req: Request, res: Response) => {
      const socialVisitorsRes = await services.prisonerContactRegistryService.getSocialVisitors(
        req.user.idToken.sub,
        req.user.idToken.establishment.agency_id,
      )

      const paginationData = getPaginationData(Number(req.query.page), socialVisitorsRes.length)
      const socialVisitors = socialVisitorsRes
        .slice(paginationData.min - 1, paginationData.max)
        .map(visitor => [{ text: `${visitor.firstName} ${visitor.lastName}` }])

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
