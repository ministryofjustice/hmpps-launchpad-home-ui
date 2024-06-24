import { Request, Response, Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import type { Services } from '../../services'
import { getPaginationData } from '../../utils/pagination/pagination'
import { getEstablishmentLinksData } from '../../utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware('visits'),
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
