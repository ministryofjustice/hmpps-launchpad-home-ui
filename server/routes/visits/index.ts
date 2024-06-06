import { Request, Response, Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import type { Services } from '../../services'
import { getEstablishmentLinksData } from '../../utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware('visits'),
    asyncHandler(async (req: Request, res: Response) => {
      const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)
      const socialVisitors = await services.prisonerProfileService.getSocialVisitors(req.user.idToken.sub)

      return res.render('pages/visits', {
        data: {
          title: 'Social visitors',
          readMoreUrl: `${prisonerContentHubURL}/tags/1133`,
          socialVisitors: socialVisitors.map(visitor => [{ text: `${visitor.firstName} ${visitor.lastName}` }]),
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
