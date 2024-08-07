import { Request, Response, Router } from 'express'

import { DateFormats } from '../../constants/date'
import { Features } from '../../constants/featureFlags'

import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'

import { formatDate } from '../../utils/date/date'

import { ApprovedClients } from '../../@types/launchpad'
import type { Services } from '../../services'
import { getPaginationData } from '../../utils/pagination/pagination'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware(Features.Settings),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals
      const approvedClients = await services.launchpadAuthService.getApprovedClients(user.idToken.sub, user.accessToken)

      const formatApprovedClients = (clients: ApprovedClients) =>
        clients.content.map(({ id, logoUri, name, createdDate, scopes, autoApprove }) => ({
          id,
          logoUri,
          name,
          accessSharedDate: formatDate(createdDate, DateFormats.GDS_PRETTY_DATE),
          permissions: scopes.map(scope => scope.humanReadable),
          autoApprove: false,
        }))

      const formattedClients = formatApprovedClients(approvedClients)
      const paginationData = getPaginationData(Number(req.query.page), formattedClients.length, 3)
      const paginatedClients = formattedClients.slice(paginationData.min - 1, paginationData.max)

      const { client, success } = req.query

      res.render('pages/settings', {
        title: 'Settings',
        data: {
          approvedClients: paginatedClients,
          paginationData,
          rawQuery: req.query.page,
        },
        response: {
          client,
          success: success === 'true',
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
