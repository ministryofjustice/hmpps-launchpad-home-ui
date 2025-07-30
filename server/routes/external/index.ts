import { Request, Response, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import logger from '../../../logger'
import { getEstablishmentData } from '../../utils/utils'
import { AUDIT_ACTIONS } from '../../constants/audit'
import config from '../../config'

export default function routes(): Router {
  const router = Router()

  router.get(
    [
      '/self-service',
      '/content-hub',
      '/prison-radio',
      '/inside-time',
      '/adjudications',
      '/incentives',
      '/timetable',
      '/transactions',
      '/visits',
      '/privacy-policy',
      '/transactions-help',
    ],
    async (req: Request, res: Response) => {
      const { idToken } = res.locals.user
      const agencyId = idToken.establishment?.agency_id
      const bookingId = idToken.booking.id
      const prisonerId = idToken.sub
      const target = req.path

      const { prisonerContentHubURL, selfServiceURL } = getEstablishmentData(agencyId)

      const links: { [key: string]: string } = {
        '/self-service': selfServiceURL,
        '/content-hub': prisonerContentHubURL,
        '/prison-radio': `${prisonerContentHubURL}/${config.contentHubUrls.prisonRadio}`,
        '/inside-time': config.externalUrls.insideTime,
        '/adjudications': `${prisonerContentHubURL}/${config.contentHubUrls.adjudications}`,
        '/incentives': `${prisonerContentHubURL}/${config.contentHubUrls.incentives}`,
        '/timetable': `${prisonerContentHubURL}/${config.contentHubUrls.timetable}`,
        '/transactions': `${prisonerContentHubURL}/${config.contentHubUrls.transactions}`,
        '/visits': `${prisonerContentHubURL}/${config.contentHubUrls.visits}`,
        '/privacy-policy': `${prisonerContentHubURL}/${config.contentHubUrls.privacyPolicy}`,
        '/transactions-help': `${prisonerContentHubURL}/${config.contentHubUrls.transactionsHelp}`,
      }

      const redirectUrl = links[target]

      logger.info(`Redirecting ${prisonerId} to ${redirectUrl}`)

      await auditService.sendAuditMessage({
        action: AUDIT_ACTIONS.VIEW_EXTERNAL_PAGE,
        who: prisonerId,
        service: config.apis.audit.serviceName,
        details: JSON.stringify({
          page: target.toUpperCase().replace('/', '').replace('-', '_'),
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
    },
  )

  return router
}
