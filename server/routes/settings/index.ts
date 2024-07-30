import { Request, Response, Router } from 'express'

import { DateFormats } from '../../constants/date'
import { Features } from '../../constants/featureFlags'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

import { formatDate } from '../../utils/date/date'

import { ApprovedClients } from '../../@types/launchpad'
import type { Services } from '../../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware(Features.Settings),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals
      const approvedClients = await services.launchpadAuthService.getApprovedClients(user.idToken.sub, user.accessToken)

      const createClientsArray = (data: ApprovedClients) =>
        data.content.flatMap(({ logoUri, name, createdDate, scopes, autoApprove }) =>
          Array(5).fill({
            logoUri,
            name,
            accessSharedDate: formatDate(createdDate, DateFormats.GDS_PRETTY_DATE),
            permissions: scopes.map(scope => scope.humanReadable),
            autoApprove,
          }),
        )

      return res.render('pages/settings', {
        title: 'Settings',
        data: {
          approvedClients: createClientsArray(approvedClients),
          // paginationData,
          // rawQuery: req.query.page,
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
