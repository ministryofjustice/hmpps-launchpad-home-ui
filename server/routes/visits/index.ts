import { Request, Response, Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler'
import type { Services } from '../../services'
import { getEstablishmentLinksData } from '../../utils/utils'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware('visits'),
    asyncHandler(async (req: Request, res: Response) => {
      const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)

      return res.render('pages/visits', {
        data: {
          title: 'Social visitors',
          readMoreUrl: `${prisonerContentHubURL}/tags/1133`,
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
