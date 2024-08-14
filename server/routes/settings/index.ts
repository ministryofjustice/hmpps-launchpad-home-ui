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

  const formatApprovedClients = (clients: ApprovedClients) => {
    return clients.content.map(({ id, logoUri, name, createdDate, scopes, autoApprove }) => ({
      id,
      logoUri,
      name,
      accessSharedDate: formatDate(createdDate, DateFormats.GDS_PRETTY_DATE),
      permissions: scopes.filter(scope => scope?.humanReadable).map(scope => scope.humanReadable),
      autoApprove,
    }))
  }

  const getSuccessStatus = (success?: string): string | null => {
    if (success === 'true') return 'success'
    if (success === 'false') return 'error'
    return null
  }

  router.get(
    '/',
    featureFlagMiddleware(Features.Settings),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals
      const approvedClients = await services.launchpadAuthService.getApprovedClients(user.idToken.sub, user.accessToken)

      const formattedClients = formatApprovedClients(approvedClients)
      const paginationData = getPaginationData(Number(req.query.page), formattedClients.length, 3)
      const paginatedClients = formattedClients.slice(paginationData.min - 1, paginationData.max)

      const data = {
        approvedClients: paginatedClients,
        paginationData,
        rawQuery: req.query.page,
      }

      const response = {
        client: req.query.client,
        success: getSuccessStatus(req.query.success as string),
      }

      res.render('pages/settings', {
        title: 'Settings',
        data,
        response,
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
