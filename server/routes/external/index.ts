import { Request, Response, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { asyncHandler } from '../../middleware/asyncHandler'
import logger from '../../../logger'
import { getEstablishmentData } from '../../utils/utils'
import { AUDIT_ACTIONS } from '../../constants/audit'
import config from '../../config'

export default function routes(): Router {
  const router = Router()

  router.get(
    '/:target(self\\-service|content\\-hub|prison\\-radio|inside\\-time|adjudications|incentives|timetable|transactions|visits|privacy-policy|transactions-help)',
    asyncHandler(async (req: Request, res: Response) => {
      const { target } = req.params
      const { idToken } = res.locals.user
      const agencyId = idToken.establishment?.agency_id
      const bookingId = idToken.booking.id
      const prisonerId = idToken.sub

      const { prisonerContentHubURL, selfServiceURL } = getEstablishmentData(agencyId)

      const links: { [key: string]: string } = {
        'self-service': selfServiceURL,
        'content-hub': prisonerContentHubURL,
        'prison-radio': `${prisonerContentHubURL}/tags/785`,
        'inside-time': 'https://insidetimeprison.org/',
        adjudications: `${prisonerContentHubURL}/content/4193`,
        incentives: `${prisonerContentHubURL}/tags/1417`,
        timetable: `${prisonerContentHubURL}/tags/1341`,
        transactions: `${prisonerContentHubURL}/tags/872`,
        visits: `${prisonerContentHubURL}/tags/1133`,
        'privacy-policy': `${prisonerContentHubURL}/content/4856`,
        'transactions-help': `${prisonerContentHubURL}/content/8534`,
      }

      const redirectUrl = links[target]

      logger.info(`Redirecting ${prisonerId} to ${redirectUrl}`)

      await auditService.sendAuditMessage({
        action: AUDIT_ACTIONS.VIEW_EXTERNAL_PAGE,
        who: prisonerId,
        service: config.apis.audit.serviceName,
        details: JSON.stringify({
          page: target.toUpperCase().replace('-', '_'),
          method: req.method,
          pageUrl: req.originalUrl,
          params: req.params,
          query: req.query,
          body: req.body,
          agencyId,
          bookingId,
          redirectUrl,
        }),
      })

      res.redirect(redirectUrl)
    }),
  )

  return router
}
